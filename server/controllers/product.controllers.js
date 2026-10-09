import mongoose from 'mongoose'
import Product from '../models/product.model.js'
import { PRODUCT_CATEGORIES, normalizeProductCategory } from '../models/productCategories.js'

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const createProduct = async (req, res) => {
    const { name, description, price, category, image, stock } = req.body ?? {}
    const numericPrice = Number(price)
    const numericStock = Number(stock)

    try {
        const product = await Product.create({
            name: name.trim(),
            description: description.trim(),
            price: numericPrice,
            category: normalizeProductCategory(category),
            image: image.trim(),
            stock: numericStock,
        })
        return res.status(201).json({ success: true, product })
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ success: false, message: error.message })
        }
        console.error('Product creation failed:', error.message)
        return res.status(500).json({ success: false, message: 'Unable to save the product.' })
    }
}

export const getProducts = async (req, res) => {
    try {
        const { search = '', category = '', sort } = req.query
        // Keep old test or malformed categories out of the customer facing catalog.
        const filter = { category: { $in: PRODUCT_CATEGORIES } }

        if (typeof search === 'string' && search.trim()) {
            const searchPattern = { $regex: escapeRegex(search.trim()), $options: 'i' }
            filter.$or = [
                { name: searchPattern },
                { description: searchPattern },
            ]
        }
        if (typeof category === 'string' && category.trim()) {
            const normalizedCategory = normalizeProductCategory(category)
            if (!normalizedCategory) {
                return res.status(200).json({ success: true, count: 0, products: [] })
            }
            filter.category = normalizedCategory
        }

        const sortOrder = sort === 'price_asc'
            ? { price: 1 }
            : sort === 'price_desc'
                ? { price: -1 }
                : { createdAt: -1 }
        const products = await Product.find(filter).sort(sortOrder)
        return res.status(200).json({ success: true, count: products.length, products })
    } catch {
        return res.status(500).json({ success: false, message: 'Unable to load products.' })
    }
}

export const getProductCategories = async (_req, res) => {
    return res.status(200).json({ success: true, categories: PRODUCT_CATEGORIES })
}

export const getProductById = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ success: false, message: 'Invalid product ID.' })
    }

    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' })
        }
        return res.status(200).json({ success: true, product })
    } catch {
        return res.status(500).json({ success: false, message: 'Unable to load product.' })
    }
}
