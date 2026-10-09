import express from 'express'
import { addToWishlist, getWishlist, removeFromWishlist } from '../controllers/wishlist.controllers.js'
import { isAuthenticated } from '../middlewares/authMiddleware.js'

const wishlistRoutes = express.Router()

wishlistRoutes.post('/', isAuthenticated, addToWishlist)
wishlistRoutes.get('/', isAuthenticated, getWishlist)
wishlistRoutes.delete('/', isAuthenticated, removeFromWishlist)

export default wishlistRoutes
