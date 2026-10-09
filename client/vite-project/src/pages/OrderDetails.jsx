import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getOrderById } from '../services/productApi'

function OrderDetails() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        setError('')
        const { order: currentOrder } = await getOrderById(id)
        setOrder(currentOrder)
      } catch {
        setError('Unable to load your order details.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fffdf5] text-[#1e293b]">
        <Navbar />
        <div className="mx-auto max-w-4xl px-5 py-20 text-center">
          <p className="text-lg font-semibold">Loading order details...</p>
        </div>
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#fffdf5] text-[#1e293b]">
        <Navbar />
        <div className="mx-auto max-w-xl px-5 py-20 text-center">
          <p className="text-lg font-bold">Unable to load your order.</p>
          <Link to="/orders" className="mt-6 inline-flex rounded-full bg-[#1e293b] px-5 py-3 font-semibold text-white">Back to Orders</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#fffdf5] px-5 py-12 text-[#1e293b] sm:px-8">
      <Navbar />
      <div className="mx-auto mt-8 max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8b5cf6]">Order Details</p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.06em]">Order #{order._id.slice(-6)}</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.5rem] border border-[#1e293b]/[0.08] bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1e293b]/10 pb-4">
              <div>
                <p className="text-sm text-[#1e293b]/60">Created</p>
                <p className="mt-1 font-semibold">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-sm text-[#1e293b]/60">Status</p>
                <p className="mt-1 font-semibold">{order.status}</p>
              </div>
              <div>
                <p className="text-sm text-[#1e293b]/60">Payment</p>
                <p className="mt-1 font-semibold">{order.paymentStatus}</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {order.items.map((item) => (
                <div key={`${order._id}-${item.product}`} className="flex gap-4 rounded-2xl border border-[#1e293b]/10 p-3">
                  <img className="h-20 w-20 rounded-xl object-cover" src={item.image} alt={item.name} />
                  <div className="flex-1">
                    <p className="font-bold">{item.name}</p>
                    <p className="mt-1 text-sm text-[#1e293b]/60">Price: ₹{Number(item.price).toFixed(2)} × {item.quantity}</p>
                    <p className="mt-2 font-semibold">₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-6 rounded-[1.5rem] border border-[#1e293b]/[0.08] bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b5cf6]">Shipping</p>
              <div className="mt-4 space-y-1 text-sm text-[#1e293b]/70">
                <p className="font-semibold text-[#1e293b]">{order.shippingAddress?.fullName}</p>
                <p>{order.shippingAddress?.addressLine1}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                <p>{order.shippingAddress?.pincode}</p>
                <p>{order.shippingAddress?.phone}</p>
              </div>
            </div>

            <div className="border-t border-[#1e293b]/10 pt-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b5cf6]">Total</p>
              <p className="mt-3 text-3xl font-black tracking-[-0.06em]">₹{Number(order.totalAmount).toFixed(2)}</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default OrderDetails
