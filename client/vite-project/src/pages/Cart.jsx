import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useCart } from '../context/CartContext'

function Cart() {
  const { cartItems, loading, error, refreshCart, updateQuantity, removeFromCart } = useCart()

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.product?.price || 0) * Number(item.quantity || 0),
    0,
  )
  const totalItems = cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0)

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
          <p className="text-lg font-bold">Unable to load your cart.</p>
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
          <p className="mt-3 text-[#1e293b]/70">Looks like you haven&apos;t added anything yet.</p>
          <Link
            className="mt-6 inline-flex rounded-full bg-[#1e293b] px-5 py-3 font-semibold text-white"
            to="/products"
          >
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
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8b5cf6]">Cart</p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.06em]">My Cart</h1>
          </div>
          <Link className="font-semibold text-[#8b5cf6]" to="/products">Continue shopping</Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.7fr_0.9fr]">
          <div className="space-y-6">
            {cartItems.map((item) => {
              const product = item.product
              return (
                <article key={product._id} className="flex flex-col gap-4 rounded-[1.5rem] border border-[#1e293b]/[0.08] bg-white p-4 shadow-sm sm:flex-row sm:items-center">
                  <img className="h-28 w-full rounded-2xl object-cover sm:h-24 sm:w-24" src={product.image} alt={product.name} />
                  <div className="flex-1">
                    <h2 className="text-xl font-bold">{product.name}</h2>
                    <p className="mt-1 text-sm text-[#1e293b]/60">{product.category}</p>
                    <p className="mt-3 text-lg font-bold">₹{Number(product.price).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1e293b]/15 text-xl disabled:opacity-50"
                      type="button"
                      disabled={item.quantity <= 1}
                      onClick={() => updateQuantity(product._id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="min-w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1e293b]/15 text-xl disabled:opacity-50"
                      type="button"
                      disabled={item.quantity >= Number(product.stock || 0)}
                      onClick={() => updateQuantity(product._id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="rounded-full border border-[#1e293b]/15 px-4 py-2.5 text-sm font-semibold text-[#1e293b] transition hover:border-[#8b5cf6] hover:text-[#8b5cf6]"
                    type="button"
                    onClick={() => removeFromCart(product._id)}
                  >
                    Remove
                  </button>
                </article>
              )
            })}
          </div>

          <aside className="rounded-[1.5rem] border border-[#1e293b]/[0.08] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black tracking-[-0.05em]">Order Summary</h2>
            <div className="mt-6 space-y-3 text-sm text-[#1e293b]/70">
              <div className="flex items-center justify-between">
                <span>Items</span>
                <span className="font-semibold text-[#1e293b]">{totalItems}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#1e293b]">₹{Number(subtotal).toFixed(2)}</span>
              </div>
            </div>
            <Link
              className="mt-8 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#1e293b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#8b5cf6]"
              to="/checkout"
            >
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default Cart
