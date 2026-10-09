import jwt from 'jsonwebtoken'
import Customer from '../models/user.model.js'

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies?.token
        if (!token) {
            return res.status(401).json({ message: 'Not Authorized' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const customer = await Customer.findById(decoded.userId)
        if (!customer) {
            return res.status(401).json({ message: 'Invalid or expired token' })
        }

        req.user = customer
        next()
    } catch {
        return res.status(401).json({ message: 'Invalid or expired token' })
    }
}
