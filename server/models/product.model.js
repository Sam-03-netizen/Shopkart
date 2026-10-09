import mongoose from 'mongoose'
import { PRODUCT_CATEGORIES } from './productCategories.js'

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0.01 },
    category: { type: String, required: true, trim: true, enum: PRODUCT_CATEGORIES },
    image: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (value) => {
                try {
                    return new URL(value).protocol === 'https:'
                } catch {
                    return false
                }
            },
            message: 'Product image must be a secure URL.',
        },
    },
    stock: { type: Number, required: true, min: 0, validate: Number.isInteger },
}, { timestamps: { createdAt: true, updatedAt: false } })

const Product = mongoose.model('Product', productSchema)

export default Product
