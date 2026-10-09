import { normalizeProductCategory } from '../models/productCategories.js'

const isSecureImageUrl = (value) => {
    try {
        const url = new URL(value)
        return url.protocol === 'https:' && Boolean(url.hostname)
    } catch {
        return false
    }
}

export const validateProductInput = (req, res, next) => {
    const { name, description, price, category, image, stock } = req.body ?? {}
    const numericPrice = Number(price)
    const numericStock = Number(stock)
    const validPrice = (typeof price === 'number' || (typeof price === 'string' && price.trim())) &&
        Number.isFinite(numericPrice) && numericPrice > 0
    const validStock = (typeof stock === 'number' || (typeof stock === 'string' && stock.trim())) &&
        Number.isInteger(numericStock) && numericStock >= 0

    if (
        typeof name !== 'string' || !name.trim() ||
        typeof description !== 'string' || !description.trim() ||
        !validPrice ||
        !normalizeProductCategory(category) ||
        !validStock ||
        typeof image !== 'string' || !isSecureImageUrl(image.trim())
    ) {
        return res.status(400).json({
            success: false,
            message: 'Provide a name, description, positive price, supported category, valid HTTPS image URL, and non-negative integer stock.',
        })
    }

    next()
}
