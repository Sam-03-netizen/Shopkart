import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getOrders } from '../services/productApi'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError('')
      const { orders: responseOrders = [] } = await getOrders()
      setOrders(responseOrders)
    } catch {
      setError('Unable to load your orders.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fffdf5] text-[#1e293b]">
        <Navbar />
        <div className="mx-auto max-w-xl px-5 py-20 text-center">
          <p className="text-lg font-semibold">Loading your orders...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#fffdf5] text-[#1e293b]">
        <Navbar />
        <div className="mx-auto max-w-xl px-5 py-20 text-center">
          <p className="text-lg font-bold">Unable to load your orders.</p>
          <button type="button" onClick={loadOrders} className="mt-6 rounded-full bg-[#8b5cf6] px-5 py-2.5 font-semibold text-white">Try Again</button>
        </div>
      </main>
    )
  }

  if (!orders.length) {
    return (
      <main className="min-h-screen bg-[#fffdf5] text-[#1e293b]">
        <Navbar />
        <div className="mx-auto max-w-xl px-5 py-20 text-center">
          <div className="text-5xl" aria-hidden="true">📦</div>
          <h1 className="mt-4 text-3xl font-black tracking-[-0.06em]">You have not placed any orders yet.</h1>
          <Link className="mt-6 inline-flex rounded-full bg-[#1e293b] px-5 py-3 font-semibold text-white" to="/products">Start Shopping</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#fffdf5] px-5 py-12 text-[#1e293b] sm:px-8">
      <Navbar />
      <div className="mx-auto mt-8 max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8b5cf6]">Orders</p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.06em]">My Orders</h1>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <article key={order._id} className="rounded-[1.5rem] border border-[#1e293b]/[0.08] bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2 border-b border-[#1e293b]/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-[#8b5cf6]">Order #{order._id.slice(-6)}</p>
                  <p className="mt-2 text-sm text-[#1e293b]/60">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#1e293b]/60">Status: {order.status}</p>
                  <p className="mt-2 text-xl font-black">₹{Number(order.totalAmount || 0).toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-5 space-y-2 text-sm text-[#1e293b]/70">
                {order.items.map((item) => (
                  <div key={`${order._id}-${item.product}`} className="flex items-center justify-between gap-4">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm font-semibold text-[#1e293b]/70">Payment: {order.paymentStatus}</p>
                <Link to={`/orders/${order._id}`} className="rounded-full bg-[#1e293b] px-5 py-2.5 text-sm font-semibold text-white">View Details</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}

export default Orders
