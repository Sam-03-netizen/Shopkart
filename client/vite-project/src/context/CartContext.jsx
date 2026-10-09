import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { axiosInstance } from '../axiosCalls/axios'
import { addCartItem, fetchCart, removeCartItem, updateCartItem } from '../services/productApi'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refreshCart = async () => {
    try {
      setLoading(true)
      setError('')
      const { cart } = await fetchCart()
      setCartItems(cart || [])
    } catch {
      setCartItems([])
      setError('Unable to load your cart.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    axiosInstance.get('customers/me')
      .then(() => {
        if (!active) return
        refreshCart()
      })
      .catch(() => {
        if (!active) return
        setCartItems([])
        setLoading(false)
        setError('')
      })

    return () => {
      active = false
    }
  }, [])

  const addToCart = async (productId) => {
    try {
      setError('')
      await addCartItem(productId)
      await refreshCart()
    } catch (error) {
      const message = error?.response?.status === 400
        ? 'Cannot add that quantity to your cart.'
        : error?.response?.status === 401
          ? 'Please log in to continue.'
          : 'Unable to add this item to your cart.'
      setError(message)
      throw error
    }
  }

  const updateQuantity = async (productId, quantity) => {
    try {
      setError('')
      await updateCartItem(productId, quantity)
      await refreshCart()
    } catch (error) {
      const message = error?.response?.status === 400
        ? 'Quantity exceeds available stock.'
        : error?.response?.status === 404
          ? 'This product is not in your cart.'
          : 'Unable to update this cart item.'
      setError(message)
      throw error
    }
  }

  const removeFromCart = async (productId) => {
    try {
      setError('')
      await removeCartItem(productId)
      await refreshCart()
    } catch (error) {
      const message = error?.response?.status === 404
        ? 'This product is already removed from your cart.'
        : 'Unable to remove this product from your cart.'
      setError(message)
      throw error
    }
  }

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0),
    [cartItems],
  )

  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => total + Number(item.product?.price || 0) * Number(item.quantity || 0), 0),
    [cartItems],
  )

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      error,
      cartCount,
      subtotal,
      refreshCart,
      addToCart,
      updateQuantity,
      removeFromCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
