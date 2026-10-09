import express from 'express'
import { createPaymentOrder, getOrderById, getOrders, verifyPayment } from '../controllers/order.controllers.js'
import { isAuthenticated } from '../middlewares/authMiddleware.js'

const orderRoutes = express.Router()

orderRoutes.post('/create-payment-order', isAuthenticated, createPaymentOrder)
orderRoutes.post('/verify-payment', isAuthenticated, verifyPayment)
orderRoutes.get('/', isAuthenticated, getOrders)
orderRoutes.get('/:id', isAuthenticated, getOrderById)

export default orderRoutes
