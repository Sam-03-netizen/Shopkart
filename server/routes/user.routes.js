import express from 'express'
import {
    changePassword,
    getCustomer,
    loginCustomer,
    logoutCustomer,
    registerUser,
} from '../controllers/user.controllers.js'
import { isAuthenticated } from '../middlewares/authMiddleware.js'

const userRoutes = express.Router()

userRoutes.post('/register', registerUser)
userRoutes.post('/login', loginCustomer)
userRoutes.post('/logout', isAuthenticated, logoutCustomer)
userRoutes.get('/me', isAuthenticated, getCustomer)
userRoutes.patch('/change-password', isAuthenticated, changePassword)

export default userRoutes
