import mongoose from 'mongoose'
import Customer from '../models/user.model.js'
import Product from '../models/product.model.js'

export const addToWishlist = async (req, res) => {
    const { productId } = req.body ?? {}

    if (!productId || !mongoose.isValidObjectId(productId)) {
        return res.status(400).json({ success: false, message: 'Invalid product ID.' })
    }

    try {
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' })
        }

        const customer = await Customer.findById(req.user._id)
        if (!customer) {
            return res.status(401).json({ success: false, message: 'Not authorized' })
        }

        customer.wishlist = customer.wishlist || []
        const alreadySaved = customer.wishlist.some((id) => id.toString() === productId)
        if (alreadySaved) {
            return res.status(409).json({ success: false, message: 'Product already exists in wishlist' })
        }

        customer.wishlist.push(product._id)
        await customer.save()

        return res.status(200).json({
            success: true,
            message: 'Product added to wishlist'
        })
    } catch (error) {
        console.error('Add to wishlist failed:', error)
        return res.status(500).json({ success: false, message: 'Unable to add product to wishlist.' })
    }
}

export const getWishlist = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user._id).populate({
            path: 'wishlist',
            select: 'name price category image stock _id',
        })

        if (!customer) {
            return res.status(401).json({ success: false, message: 'Not authorized' })
        }

        const wishlist = customer.wishlist || []

        return res.status(200).json({
            success: true,
            count: wishlist.length,
            wishlist,
        })
    } catch (error) {
        console.error('Get wishlist failed:', error)
        return res.status(500).json({ success: false, message: 'Unable to load wishlist.' })
    }
}

export const removeFromWishlist = async (req, res) => {
    const { productId } = req.body ?? {}

    if (!productId || !mongoose.isValidObjectId(productId)) {
        return res.status(400).json({ success: false, message: 'Invalid product ID.' })
    }

    try {
        const customer = await Customer.findById(req.user._id)
        if (!customer) {
            return res.status(401).json({ success: false, message: 'Not authorized' })
        }

        customer.wishlist = customer.wishlist || []
        const productIndex = customer.wishlist.findIndex((id) => id.toString() === productId)

        if (productIndex === -1) {
            return res.status(404).json({ success: false, message: 'Product is not in wishlist' })
        }

        customer.wishlist.splice(productIndex, 1)
        await customer.save()

        return res.status(200).json({
            success: true,
            message: 'Product removed from wishlist'
        })
    } catch (error) {
        console.error('Remove from wishlist failed:', error)
        return res.status(500).json({ success: false, message: 'Unable to remove product from wishlist.' })
    }
}
