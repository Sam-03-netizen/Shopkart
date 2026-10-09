import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useCart } from '../context/CartContext'
import { createPaymentOrder, verifyPayment } from '../services/productApi'

const initialForm = {
  fullName: '',
  phone: '',
  addressLine1: '',
  city: '',
  state: '',
  pincode: '',
}

const loadRazorpayScript = () => new Promise((resolve) => {
  const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')

  if (existingScript) {
    if (window.Razorpay) {
      resolve(true)
      return
    }

    existingScript.addEventListener('load', () => resolve(true), { once: true })
    existingScript.addEventListener('error', () => resolve(false), { once: true })
    return
  }

  const script = document.createElement('script')
  script.src = 'https://checkout.razorpay.com/v1/checkout.js'
  script.onload = () => resolve(true)
  script.onerror = () => resolve(false)
  document.body.appendChild(script)
})

const validateShippingAddress = (values) => {
  const errors = {}
  const form = {
    fullName: values.fullName?.trim() ?? '',
    phone: values.phone?.trim() ?? '',
    addressLine1: values.addressLine1?.trim() ?? '',
    city: values.city?.trim() ?? '',
    state: values.state?.trim() ?? '',
    pincode: values.pincode?.trim() ?? '',
  }

  if (!form.fullName) errors.fullName = 'Full name is required.'
  if (!form.phone) errors.phone = 'Phone number is required.'
  else if (!/^\+?[0-9]{10,15}$/.test(form.phone)) errors.phone = 'Phone number must contain 10 to 15 digits.'
  if (!form.addressLine1) errors.addressLine1 = 'Address is required.'
  if (!form.city) errors.city = 'City is required.'
  if (!form.state) errors.state = 'State is required.'
  if (!form.pincode) errors.pincode = 'Pincode is required.'
  else if (!/^\d{6}$/.test(form.pincode)) errors.pincode = 'Pincode must contain 6 digits.'

  return { valid: Object.keys(errors).length === 0, errors, form }
}

function Checkout() {
  const navigate = useNavigate()
  const { cartItems, loading, error, refreshCart } = useCart()
  const [formData, setFormData] = useState(initialForm)
  const [formErrors, setFormErrors] = useState({})
  const [paymentError, setPaymentError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('upi')

  const subtotal = useMemo(() => cartItems.reduce(
    (total, item) => total + Number(item.product?.price || 0) * Number(item.quantity || 0),
    0,
  ), [cartItems])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setFormErrors((current) => ({ ...current, [name]: '' }))
  }

  const handlePaymentFailure = (response) => {
    const message = response?.error?.description || 'Payment failed. Your cart has not been cleared. Please try again.'
    setPaymentError(message)
    setIsSubmitting(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const { valid, errors, form } = validateShippingAddress(formData)

    if (!valid) {
      setFormErrors(errors)
      return
    }

    setPaymentError('')
    setIsSubmitting(true)

    try {
      const orderResponse = await createPaymentOrder({ shippingAddress: form })
      const scriptLoaded = await loadRazorpayScript()

      if (!scriptLoaded || !window.Razorpay) {
        throw new Error('Payment gateway is not available right now.')
      }

      const options = {
        key: orderResponse.key,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: 'ShopKart',
        description: 'ShopKart Order',
        order_id: orderResponse.razorpayOrderId,
        method: paymentMethod === 'upi' ? 'upi' : undefined,
        prefill: {
          name: form.fullName,
          contact: form.phone,
          email: orderResponse.customerEmail,
        },
        handler: async function (response) {
          try {
            const verification = await verifyPayment({
              shopKartOrderId: orderResponse.shopKartOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })

            await refreshCart()
            navigate(`/order-success/${verification.order?._id || orderResponse.shopKartOrderId}`)
          } catch (error) {
            const message = error?.response?.data?.message || 'Unable to verify payment.'
            setPaymentError(message)
          } finally {
            setIsSubmitting(false)
          }
        },
        modal: {
          ondismiss: () => setIsSubmitting(false),
        },
        theme: { color: '#8b5cf6' },
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.on('payment.failed', handlePaymentFailure)
      paymentObject.open()
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Unable to place order.'
      setPaymentError(message)
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fffdf5] text-[#1e293b]">
        <Navbar />
        <div className="mx-auto max-w-4xl px-5 py-20 text-center">
          <p className="text-lg font-semibold">Loading your cart...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#fffdf5] text-[#1e293b]">
        <Navbar />
        <div className="mx-auto max-w-xl px-5 py-20 text-center">
          <p className="text-lg font-semibold">Unable to load your cart.</p>
          <button
            className="mt-6 rounded-full bg-[#8b5cf6] px-5 py-2.5 font-semibold text-white"
            type="button"
            onClick={() => refreshCart()}
          >
            Try Again
          </button>
        </div>
      </main>
    )
  }

  if (!cartItems.length) {
    return (
      <main className="min-h-screen bg-[#fffdf5] text-[#1e293b]">
        <Navbar />
        <div className="mx-auto max-w-xl px-5 py-20 text-center">
          <div className="text-5xl" aria-hidden="true">🛒</div>
          <h1 className="mt-4 text-3xl font-black tracking-[-0.06em]">Your cart is empty</h1>
          <p className="mt-3 text-[#1e293b]/70">Add a few items before checking out.</p>
          <Link className="mt-6 inline-flex rounded-full bg-[#1e293b] px-5 py-3 font-semibold text-white" to="/products">
            Browse Products
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#fffdf5] px-5 py-12 text-[#1e293b] sm:px-8">
      <Navbar />
      <div className="mx-auto mt-8 max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8b5cf6]">Checkout</p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.06em]">Shipping Details</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <form onSubmit={handleSubmit} className="rounded-[1.5rem] border border-[#1e293b]/[0.08] bg-white p-6 shadow-sm">
            <fieldset className="mb-6">
              <legend className="mb-3 text-sm font-semibold">Payment Method</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className={`cursor-pointer rounded-xl border p-4 transition ${paymentMethod === 'upi' ? 'border-[#8b5cf6] bg-[#fff4f1]' : 'border-[#1e293b]/15'}`}>
                  <input
                    className="mr-2 accent-[#8b5cf6]"
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                  />
                  <span className="font-semibold">UPI</span>
                  <span className="mt-1 block pl-6 text-sm text-[#1e293b]/60">Google Pay, PhonePe, Paytm and more</span>
                </label>
                <label className={`cursor-pointer rounded-xl border p-4 transition ${paymentMethod === 'other' ? 'border-[#8b5cf6] bg-[#fff4f1]' : 'border-[#1e293b]/15'}`}>
                  <input
                    className="mr-2 accent-[#8b5cf6]"
                    type="radio"
                    name="paymentMethod"
                    value="other"
                    checked={paymentMethod === 'other'}
                    onChange={() => setPaymentMethod('other')}
                  />
                  <span className="font-semibold">Other methods</span>
                  <span className="mt-1 block pl-6 text-sm text-[#1e293b]/60">Choose in Razorpay Checkout</span>
                </label>
              </div>
            </fieldset>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold" htmlFor="fullName">Full Name</label>
                <input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className="auth-input" placeholder="Enter full name" />
                {formErrors.fullName && <p className="mt-2 text-sm text-[#b4422d]">{formErrors.fullName}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold" htmlFor="phone">Phone Number</label>
                <input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="auth-input" placeholder="9876543210" />
                {formErrors.phone && <p className="mt-2 text-sm text-[#b4422d]">{formErrors.phone}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold" htmlFor="addressLine1">Address</label>
                <input id="addressLine1" name="addressLine1" value={formData.addressLine1} onChange={handleChange} className="auth-input" placeholder="House number, street, area" />
                {formErrors.addressLine1 && <p className="mt-2 text-sm text-[#b4422d]">{formErrors.addressLine1}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold" htmlFor="city">City</label>
                <input id="city" name="city" value={formData.city} onChange={handleChange} className="auth-input" placeholder="City" />
                {formErrors.city && <p className="mt-2 text-sm text-[#b4422d]">{formErrors.city}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold" htmlFor="state">State</label>
                <input id="state" name="state" value={formData.state} onChange={handleChange} className="auth-input" placeholder="State" />
                {formErrors.state && <p className="mt-2 text-sm text-[#b4422d]">{formErrors.state}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold" htmlFor="pincode">Pincode</label>
                <input id="pincode" name="pincode" value={formData.pincode} onChange={handleChange} className="auth-input" placeholder="560001" />
                {formErrors.pincode && <p className="mt-2 text-sm text-[#b4422d]">{formErrors.pincode}</p>}
              </div>
            </div>

            {paymentError && (
              <div className="mt-5 rounded-xl border border-[#f0c2b7] bg-[#fff1ee] px-4 py-3 text-sm font-medium text-[#8e3427]">
                {paymentError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="auth-button mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>

          <aside className="rounded-[1.5rem] border border-[#1e293b]/[0.08] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black tracking-[-0.05em]">Order Summary</h2>
            <div className="mt-6 space-y-4">
              {cartItems.map((item) => (
                <div key={item.product?._id} className="flex items-center justify-between gap-4 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#1e293b]">{item.product?.name}</p>
                    <p className="text-[#1e293b]/60">{item.quantity} × ₹{Number(item.product?.price || 0).toFixed(2)}</p>
                  </div>
                  <p className="whitespace-nowrap font-bold text-[#1e293b]">₹{(Number(item.product?.price || 0) * Number(item.quantity || 0)).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-[#1e293b]/10 pt-4 text-sm text-[#1e293b]/70">
              <div className="flex items-center justify-between">
                <span>Total</span>
                <span className="text-xl font-black tracking-[-0.04em] text-[#1e293b]">₹{Number(subtotal).toFixed(2)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default Checkout
