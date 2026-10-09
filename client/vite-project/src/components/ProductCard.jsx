import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { addToWishlist } from '../services/productApi'
import ProductImage from './ProductImage'

function ProductCard({ product }) {
  const inStock = product.stock > 0
  const { addToCart, cartItems } = useCart()
  const [wishlistStatus, setWishlistStatus] = useState('idle')
  const [wishlistMessage, setWishlistMessage] = useState('')
  const [addingToCart, setAddingToCart] = useState(false)
  const [cartMessage, setCartMessage] = useState('')
  const cartQuantity = cartItems.find((item) => item.product?._id === product._id)?.quantity || 0

  const handleWishlistClick = async () => {
    if (wishlistStatus === 'saving') return

    setWishlistStatus('saving')
    setWishlistMessage('')

    try {
      await addToWishlist(product._id)
      setWishlistStatus('saved')
      setWishlistMessage('')
    } catch (error) {
      const status = error?.response?.status
      const nextMessage = status === 409
        ? 'Already in your wishlist.'
        : status === 401
          ? 'Please log in to save products.'
          : 'Could not save this product.'

      setWishlistStatus('error')
      setWishlistMessage(nextMessage)
    }
  }

  const handleAddToCart = async () => {
    if (addingToCart || !inStock) return

    setAddingToCart(true)
    setCartMessage('')
    try {
      await addToCart(product._id)
    } catch (error) {
      setCartMessage(error?.response?.status === 400
        ? 'No more units are available.'
        : error?.response?.status === 401
          ? 'Please log in to add this item.'
          : 'Could not add this item. Please try again.')
    } finally {
      setAddingToCart(false)
    }
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[#1e293b]/[0.08] bg-white shadow-[0_2px_8px_rgba(32,37,31,0.05)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(32,37,31,0.12)]">
      <ProductImage
        className="aspect-[4/3] w-full bg-[#f1f5f9] object-cover transition duration-300 group-hover:scale-[1.02]"
        src={product.image}
        alt={product.name}
      />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="min-w-0 font-bold leading-snug">{product.name}</h2>
          <p className="shrink-0 font-bold tabular-nums">₹{Number(product.price).toFixed(2)}</p>
        </div>
        <p className="mt-2 text-sm text-[#1e293b]/60">{product.category}</p>
        <p className={`mt-3 text-sm font-medium ${inStock ? 'text-[#1e293b]/60' : 'text-[#7c3aed]'}`}>
          {inStock ? `${product.stock} available` : 'Out of stock'}
        </p>

        <button
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#1e293b] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7c3aed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          disabled={addingToCart || !inStock}
          onClick={handleAddToCart}
        >
          {addingToCart ? 'Adding…' : cartQuantity ? `Add to cart · ${cartQuantity} in cart` : 'Add to cart'}
        </button>

        {cartMessage && <p className="mt-2 text-xs text-[#7c3aed]" role="alert">{cartMessage}</p>}

        <button
          className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-[#1e293b]/75 transition-colors hover:bg-[#fffdf5] hover:text-[#7c3aed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6] disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          disabled={wishlistStatus === 'saving'}
          onClick={handleWishlistClick}
        >
          {wishlistStatus === 'saving' && '⏳ Saving...'}
          {wishlistStatus === 'saved' && '♥ Added to Wishlist'}
          {wishlistStatus === 'error' && '♡ Add to Wishlist'}
          {wishlistStatus === 'idle' && '♡ Add to Wishlist'}
        </button>

        {wishlistMessage && (
          <p className="mt-2 text-xs text-red-700" role="alert">
            {wishlistMessage}
          </p>
        )}

        <Link
          className="mt-1 inline-flex min-h-9 items-center justify-center self-center px-4 py-2 text-sm font-semibold text-[#1e293b]/65 transition-colors hover:text-[#7c3aed] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6]"
          to={`/products/${product._id}`}
        >
          View details <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  )
}

export default ProductCard
