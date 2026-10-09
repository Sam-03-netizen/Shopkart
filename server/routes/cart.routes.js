import express from 'express'
import { addToCart, getCart, removeFromCart, updateCartItem } from '../controllers/cart.controllers.js'
import { isAuthenticated } from '../middlewares/authMiddleware.js'

const cartRoutes = express.Router()

cartRoutes.post('/', isAuthenticated, addToCart)
cartRoutes.get('/', isAuthenticated, getCart)
cartRoutes.patch('/', isAuthenticated, updateCartItem)
cartRoutes.delete('/', isAuthenticated, removeFromCart)

export default cartRoutes
