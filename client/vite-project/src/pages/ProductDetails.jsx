import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ProductImage from '../components/ProductImage'
import { useCart } from '../context/CartContext'
import { fetchProduct } from '../services/productApi'

function ProductDetails() {
  const { id } = useParams()
  const [request, setRequest] = useState({ key: '', status: 'loading' })
  const [added, setAdded] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [adding, setAdding] = useState(false)
  const { addToCart, cartItems } = useCart()
  const requestKey = `${id}:${attempt}`

  useEffect(() => {
    let active = true
    fetchProduct(id)
      .then((item) => {
        if (!active) return
        setRequest({ key: requestKey, status: 'ready', product: item })
      })
      .catch((error) => {
        if (active) {
          const status = error.response?.status === 404 ? 'notFound' : 'error'
          setRequest({ key: requestKey, status })
        }
      })
    return () => { active = false }
  }, [id, requestKey])

  const { status, product } = request.key === requestKey
    ? request
    : { status: 'loading', product: null }

  const inCart = cartItems.some((item) => item.product?._id === product?._id)

  const handleAddToCart = async () => {
    if (!product || adding || product.stock === 0) return

    setAdding(true)
    try {
      await addToCart(product._id)
      setAdded(true)
    } catch {
      setAdded(false)
    } finally {
      setAdding(false)
    }
  }

  if (status === 'loading') return <><Navbar /><p className="p-12 text-center" role="status">Loading product…</p></>
  if (status === 'error' || status === 'notFound') {
    return (
      <main className="min-h-screen bg-[#fffdf5] p-12 text-center text-[#1e293b]">
        <Navbar />
        <p role={status === 'error' ? 'alert' : undefined}>
          {status === 'notFound' ? 'Product not found.' : 'Something went wrong while loading this product.'}
        </p>
        {status === 'error' && (
          <button className="mt-4 text-[#8b5cf6] underline" type="button" onClick={() => setAttempt((value) => value + 1)}>
            Try again
          </button>
        )}
        <Link className="mt-4 block text-[#8b5cf6]" to="/products">Back to products</Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#fffdf5] px-5 py-12 text-[#1e293b] sm:px-8">
      <Navbar />
      <article className="mx-auto mt-8 grid max-w-6xl gap-10 rounded-3xl bg-white p-5 shadow-sm sm:p-10 md:grid-cols-2">
        <ProductImage
          key={product._id}
          className="aspect-square w-full rounded-2xl bg-[#f1f5f9] object-cover"
          src={product.image}
          alt={product.name}
        />
        <div className="flex flex-col justify-center">
          <Link className="mb-8 text-sm font-semibold text-[#8b5cf6]" to="/products">← Back to products</Link>
          <p className="text-sm font-bold uppercase tracking-widest text-[#8b5cf6]">{product.category}</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">{product.name}</h1>
          <p className="mt-4 text-2xl font-bold">₹{Number(product.price).toFixed(2)}</p>
          <p className="mt-6 leading-7 text-[#1e293b]/70">{product.description}</p>
          <p className={`mt-6 text-sm font-medium ${product.stock > 0 ? 'text-[#1e293b]/60' : 'text-[#7c3aed]'}`}>
            {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
          </p>
          <button
            className="mt-6 min-h-11 w-fit rounded-xl bg-[#1e293b] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7c3aed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            disabled={product.stock === 0 || adding}
            onClick={handleAddToCart}
          >
            {adding ? 'Adding…' : inCart || added ? 'Add another to cart' : 'Add to cart'}
          </button>
        </div>
      </article>
    </main>
  )
}

export default ProductDetails
