import { axiosInstance } from '../axiosCalls/axios'

export const fetchProducts = async (filters = {}) => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== '' && value != null),
  )
  const { data } = await axiosInstance.get('products', { params })
  const products = data.products ?? []
  return { products, count: data.count ?? products.length }
}

export const fetchProductCategories = async () => {
  const { data } = await axiosInstance.get('products/categories')
  return data.categories
}

export const fetchProduct = async (id) => {
  const { data } = await axiosInstance.get(`products/${id}`)
  return data.product
}

export const addToWishlist = async (productId) => {
  const { data } = await axiosInstance.post('wishlist', { productId })
  return data
}

export const fetchWishlist = async () => {
  const { data } = await axiosInstance.get('wishlist')
  return { wishlist: data.wishlist ?? [], count: data.count ?? 0 }
}

export const removeWishlistItem = async (productId) => {
  const { data } = await axiosInstance.delete('wishlist', { data: { productId } })
  return data
}

export const fetchCart = async () => {
  const { data } = await axiosInstance.get('cart')
  return { cart: data.cart ?? [] }
}

export const addCartItem = async (productId) => {
  const { data } = await axiosInstance.post('cart', { productId })
  return data
}

export const updateCartItem = async (productId, quantity) => {
  const { data } = await axiosInstance.patch('cart', { productId, quantity })
  return data
}

export const removeCartItem = async (productId) => {
  const { data } = await axiosInstance.delete('cart', { data: { productId } })
  return data
}

export const createProduct = async (product) => {
  const { data } = await axiosInstance.post('products', product)
  return data.product
}

export const createPaymentOrder = async (shippingAddress) => {
  const { data } = await axiosInstance.post('orders/create-payment-order', shippingAddress)
  return data
}

export const verifyPayment = async (paymentData) => {
  const { data } = await axiosInstance.post('orders/verify-payment', paymentData)
  return data
}

export const getOrders = async () => {
  const { data } = await axiosInstance.get('orders')
  return data
}

export const getOrderById = async (id) => {
  const { data } = await axiosInstance.get(`orders/${id}`)
  return data
}
