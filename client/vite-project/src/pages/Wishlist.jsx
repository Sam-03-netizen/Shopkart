import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { fetchWishlist, removeWishlistItem } from '../services/productApi'

function Wishlist() {
  const [status, setStatus] = useState('loading')
  const [products, setProducts] = useState([])
  const [attempt, setAttempt] = useState(0)
  const [removingId, setRemovingId] = useState(null)

  useEffect(() => {
    let active = true

    setStatus('loading')

    fetchWishlist()
      .then(({ wishlist }) => {
        if (!active) return
        setProducts(wishlist)
        setStatus(wishlist.length ? 'ready' : 'empty')
      })
      .catch(() => {
        if (active) {
          setProducts([])
          setStatus('error')
        }
      })

    return () => { active = false }
  }, [attempt])

  const handleRemove = async (productId) => {
    if (removingId === productId) return

    setRemovingId(productId)

    try {
      await removeWishlistItem(productId)
      const nextProducts = products.filter((product) => product._id !== productId)
      setProducts(nextProducts)
      setStatus(nextProducts.length ? 'ready' : 'empty')
    } catch {
      setStatus('error')
    } finally {
      setRemovingId(null)
    }
  }

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-[#fffdf5] px-5 py-12 text-[#1e293b]">
        <Navbar />
        <div className="mx-auto mt-8 max-w-4xl text-center">
          <p className="text-lg font-semibold">Loading your wishlist...</p>
        </div>
      </main>
    )
  }

  if (status === 'error') {
    return (
      <main className="min-h-screen bg-[#fffdf5] px-5 py-12 text-[#1e293b]">
        <Navbar />
        <div className="mx-auto mt-8 max-w-xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-bold">Something went wrong.</p>
          <p className="mt-3 text-[#1e293b]/70">We couldn&apos;t load your wishlist.</p>
          <button
            className="mt-6 rounded-full bg-[#8b5cf6] px-5 py-2.5 font-semibold text-white"
            type="button"
            onClick={() => setAttempt((value) => value + 1)}
          >
            Try Again
          </button>
        </div>
      </main>
    )
  }

  if (status === 'empty') {
    return (
      <main className="min-h-screen bg-[#fffdf5] px-5 py-12 text-[#1e293b]">
        <Navbar />
        <div className="mx-auto mt-8 max-w-xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <div className="text-5xl" aria-hidden="true">❤️</div>
          <h1 className="mt-4 text-3xl font-black tracking-[-0.06em]">Your wishlist is empty</h1>
          <p className="mt-3 text-[#1e293b]/70">Save products you love and find them here later.</p>
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
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8b5cf6]">Wishlist</p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.06em]">Saved for later</h1>
          </div>
          <Link className="font-semibold text-[#8b5cf6]" to="/products">Continue shopping</Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <article key={product._id} className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <img className="aspect-[4/3] w-full object-cover" src={product.image} alt={product.name} />
              <div className="p-5">
                <p className="text-sm font-semibold text-[#8b5cf6]">{product.category}</p>
                <h2 className="mt-2 text-xl font-bold">{product.name}</h2>
                <p className="mt-3 text-lg font-bold">₹{Number(product.price).toFixed(2)}</p>
                <p className={`mt-3 text-sm font-medium ${product.stock > 0 ? 'text-[#1e293b]/60' : 'text-[#7c3aed]'}`}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </p>

                <div className="mt-5 flex gap-3">
                  <Link
                    className="inline-flex min-h-10 flex-1 items-center justify-center rounded-xl bg-[#1e293b] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7c3aed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6] focus-visible:ring-offset-2"
                    to={`/products/${product._id}`}
                  >
                    View Details
                  </Link>
                  <button
                    className="min-h-10 rounded-xl border border-[#1e293b]/15 px-4 py-2.5 text-sm font-semibold text-[#1e293b]/75 transition-colors hover:border-[#7c3aed] hover:text-[#7c3aed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6] disabled:cursor-not-allowed disabled:opacity-60"
                    type="button"
                    disabled={removingId === product._id}
                    onClick={() => handleRemove(product._id)}
                  >
                    {removingId === product._id ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}

export default Wishlist
