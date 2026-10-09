import crypto from 'crypto'
import mongoose from 'mongoose'
import Customer from '../models/user.model.js'
import Order from '../models/order.model.js'
import Product from '../models/product.model.js'
import razorpay from '../config/razorpay.js'

const normalizePhone = (value = '') => String(value).replace(/\s+/g, '')

const validateShippingAddress = (shippingAddress = {}) => {
  const trimmed = {
    fullName: String(shippingAddress.fullName ?? '').trim(),
    phone: normalizePhone(shippingAddress.phone),
    addressLine1: String(shippingAddress.addressLine1 ?? '').trim(),
    city: String(shippingAddress.city ?? '').trim(),
    state: String(shippingAddress.state ?? '').trim(),
    pincode: String(shippingAddress.pincode ?? '').trim(),
  }

  if (!trimmed.fullName) return { valid: false, message: 'Full name is required.' }
  if (!trimmed.phone || !/^\+?[0-9]{10,15}$/.test(trimmed.phone)) {
    return { valid: false, message: 'Phone number must contain 10 to 15 digits.' }
  }
  if (!trimmed.addressLine1) return { valid: false, message: 'Address is required.' }
  if (!trimmed.city) return { valid: false, message: 'City is required.' }
  if (!trimmed.state) return { valid: false, message: 'State is required.' }
  if (!/^\d{6}$/.test(trimmed.pincode)) return { valid: false, message: 'Pincode must contain 6 digits.' }

  return {
    valid: true,
    shippingAddress: {
      fullName: trimmed.fullName,
      phone: trimmed.phone,
      addressLine1: trimmed.addressLine1,
      city: trimmed.city,
      state: trimmed.state,
      pincode: trimmed.pincode,
    },
  }
}

export const createPaymentOrder = async (req, res) => {
  let shopKartOrder
  try {
    const validation = validateShippingAddress(req.body?.shippingAddress)
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message })
    }

    const customer = await Customer.findById(req.user._id)
    if (!customer) {
      return res.status(401).json({ success: false, message: 'Not authorized.' })
    }

    if (!customer.cart || customer.cart.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty.' })
    }

    const orderItems = []
    let totalAmount = 0

    for (const cartItem of customer.cart) {
      const product = await Product.findById(cartItem.product)

      if (!product) {
        return res.status(404).json({ success: false, message: `Product is no longer available.` })
      }

      const quantity = Number(cartItem.quantity)
      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ success: false, message: `Invalid quantity for ${product.name}.` })
      }

      if (quantity > product.stock) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}.` })
      }

      const itemPrice = Number(product.price)
      totalAmount += itemPrice * quantity
      orderItems.push({
        product: product._id,
        name: product.name,
        price: itemPrice,
        quantity,
        image: product.image,
      })
    }

    if (!razorpay) {
      return res.status(500).json({ success: false, message: 'Razorpay is not configured.' })
    }

    shopKartOrder = await Order.create({
      user: customer._id,
      items: orderItems,
      shippingAddress: validation.shippingAddress,
      totalAmount,
      paymentStatus: 'PENDING',
      status: 'PENDING_PAYMENT',
    })

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      receipt: shopKartOrder._id.toString(),
    })

    shopKartOrder.razorpayOrderId = razorpayOrder.id
    await shopKartOrder.save()

    return res.status(200).json({
      success: true,
      shopKartOrderId: shopKartOrder._id.toString(),
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
      customerEmail: customer.email,
    })
  } catch (error) {
    console.error('Create payment order failed:', error)
    if (shopKartOrder?._id && !shopKartOrder.razorpayOrderId) {
      await Order.findByIdAndDelete(shopKartOrder._id).catch(() => {})
    }
    const providerMessage = error?.error?.description
    if (providerMessage) {
      return res.status(error.statusCode >= 400 && error.statusCode < 600 ? error.statusCode : 502).json({
        success: false,
        message: `Razorpay could not create the payment order: ${providerMessage}`,
      })
    }
    return res.status(500).json({ success: false, message: 'Unable to create payment order.' })
  }
}

export const verifyPayment = async (req, res) => {
  try {
    const { shopKartOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body ?? {}

    if (!shopKartOrderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment details are missing.' })
    }

    if (!mongoose.isValidObjectId(shopKartOrderId)) {
      return res.status(400).json({ success: false, message: 'Invalid order ID.' })
    }

    const order = await Order.findOne({ _id: shopKartOrderId, user: req.user._id })
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' })
    }

    if (order.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({ success: false, message: 'Invalid payment order.' })
    }

    if (order.paymentStatus === 'PAID') {
      return res.status(200).json({ success: true, message: 'Payment already verified.', order })
    }

    const body = `${order.razorpayOrderId}|${razorpay_payment_id}`
    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret) {
      return res.status(500).json({ success: false, message: 'Payment verification is not configured.' })
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex')

    const expected = Buffer.from(expectedSignature, 'hex')
    const received = Buffer.from(String(razorpay_signature), 'hex')
    if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' })
    }

    order.paymentStatus = 'PAID'
    order.status = 'PLACED'
    order.razorpayPaymentId = razorpay_payment_id
    await order.save()

    const customer = await Customer.findById(req.user._id)
    if (customer) {
      customer.cart = []
      await customer.save()
    }

    return res.status(200).json({ success: true, message: 'Payment verified successfully.', order })
  } catch (error) {
    console.error('Verify payment failed:', error)
    return res.status(500).json({ success: false, message: 'Unable to verify payment.' })
  }
}

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    return res.status(200).json({ success: true, orders })
  } catch (error) {
    console.error('Get orders failed:', error)
    return res.status(500).json({ success: false, message: 'Unable to load orders.' })
  }
}

export const getOrderById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid order ID.' })
    }

    const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' })
    }

    return res.status(200).json({ success: true, order })
  } catch (error) {
    console.error('Get order by ID failed:', error)
    return res.status(500).json({ success: false, message: 'Unable to load order.' })
  }
}
