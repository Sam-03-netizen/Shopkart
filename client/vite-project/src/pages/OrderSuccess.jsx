import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getOrderById } from '../services/productApi'

function OrderSuccess() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { order: currentOrder } = await getOrderById(id)
        setOrder(currentOrder)
      } catch {
        setOrder(null)
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
        <div className="mx-auto max-w-xl px-5 py-20 text-center">
          <p className="text-lg font-semibold">Preparing your order summary...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#fffdf5] px-5 py-12 text-[#1e293b] sm:px-8">
      <Navbar />
      <div className="mx-auto mt-8 max-w-2xl rounded-[2rem] border border-[#1e293b]/[0.08] bg-white p-8 text-center shadow-sm">
        <div className="text-6xl" aria-hidden="true">✅</div>
        <h1 className="mt-6 text-4xl font-black tracking-[-0.06em]">Order Placed Successfully</h1>

        <div className="mt-8 space-y-4 text-left rounded-2xl border border-[#1e293b]/10 bg-[#fffdf5] p-5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm uppercase tracking-[0.2em] text-[#1e293b]/60">Order ID</span>
            <span className="font-bold">{order?._id?.slice(-6) || id?.slice(-6)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm uppercase tracking-[0.2em] text-[#1e293b]/60">Total</span>
            <span className="font-bold">₹{Number(order?.totalAmount || 0).toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm uppercase tracking-[0.2em] text-[#1e293b]/60">Status</span>
            <span className="font-bold">{order?.status || 'PLACED'}</span>
          </div>
        </div>

        <p className="mt-6 text-[#1e293b]/70">Your order has been saved successfully.</p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link className="rounded-full bg-[#1e293b] px-5 py-3 font-semibold text-white" to="/orders">View My Orders</Link>
          <Link className="rounded-full border border-[#1e293b]/15 px-5 py-3 font-semibold text-[#1e293b]" to="/products">Continue Shopping</Link>
        </div>
      </div>
    </main>
  )
}

export default OrderSuccess
