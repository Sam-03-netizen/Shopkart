import mongoose from 'mongoose'
import Customer from '../models/user.model.js'
import Product from '../models/product.model.js'

export const addToCart = async (req, res) => {
    const { productId } = req.body ?? {}

    if (!productId || !mongoose.isValidObjectId(productId)) {
        return res.status(400).json({ success: false, message: 'Invalid product ID.' })
    }

    try {
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' })
        }

        const customer = await Customer.findById(req.user._id)
        if (!customer) {
            return res.status(401).json({ success: false, message: 'Not authorized' })
        }

        const existingItem = customer.cart.find((item) => item.product.toString() === productId)

        if (existingItem) {
            const nextQuantity = existingItem.quantity + 1
            if (nextQuantity > product.stock) {
                return res.status(400).json({ success: false, message: 'Quantity exceeds available stock.' })
            }
            existingItem.quantity = nextQuantity
        } else {
            if (product.stock < 1) {
                return res.status(400).json({ success: false, message: 'Product is out of stock.' })
            }
            customer.cart.push({ product: product._id, quantity: 1 })
        }

        await customer.save()

        return res.status(200).json({
            success: true,
            message: 'Product added to cart',
            cart: customer.cart,
        })
    } catch (error) {
        console.error('Add to cart failed:', error)
        return res.status(500).json({ success: false, message: 'Unable to add product to cart.' })
    }
}

export const getCart = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user._id).populate({
            path: 'cart.product',
            select: 'name price category image stock _id',
        })

        if (!customer) {
            return res.status(401).json({ success: false, message: 'Not authorized' })
        }

        const cart = (customer.cart || []).filter((item) => item.product)

        return res.status(200).json({
            success: true,
            cart,
        })
    } catch (error) {
        console.error('Get cart failed:', error)
        return res.status(500).json({ success: false, message: 'Unable to load cart.' })
    }
}

export const updateCartItem = async (req, res) => {
    const { productId, quantity } = req.body ?? {}

    if (!productId || !mongoose.isValidObjectId(productId)) {
        return res.status(400).json({ success: false, message: 'Invalid product ID.' })
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ success: false, message: 'Quantity must be at least 1.' })
    }

    try {
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' })
        }

        const customer = await Customer.findById(req.user._id)
        if (!customer) {
            return res.status(401).json({ success: false, message: 'Not authorized' })
        }

        const item = customer.cart.find((cartItem) => cartItem.product.toString() === productId)
        if (!item) {
            return res.status(404).json({ success: false, message: 'Product not found in cart.' })
        }

        if (quantity > product.stock) {
            return res.status(400).json({ success: false, message: 'Quantity exceeds available stock.' })
        }

        item.quantity = quantity
        await customer.save()

        return res.status(200).json({
            success: true,
            message: 'Cart updated successfully',
            cart: customer.cart,
        })
    } catch (error) {
        console.error('Update cart failed:', error)
        return res.status(500).json({ success: false, message: 'Unable to update cart.' })
    }
}

export const removeFromCart = async (req, res) => {
    const { productId } = req.body ?? {}

    if (!productId || !mongoose.isValidObjectId(productId)) {
        return res.status(400).json({ success: false, message: 'Invalid product ID.' })
    }

    try {
        const customer = await Customer.findById(req.user._id)
        if (!customer) {
            return res.status(401).json({ success: false, message: 'Not authorized' })
        }

        const cartIndex = customer.cart.findIndex((item) => item.product.toString() === productId)
        if (cartIndex === -1) {
            return res.status(404).json({ success: false, message: 'Product not found in cart.' })
        }

        customer.cart.splice(cartIndex, 1)
        await customer.save()

        return res.status(200).json({
            success: true,
            message: 'Product removed from cart',
            cart: customer.cart,
        })
    } catch (error) {
        console.error('Remove from cart failed:', error)
        return res.status(500).json({ success: false, message: 'Unable to remove product from cart.' })
    }
}
