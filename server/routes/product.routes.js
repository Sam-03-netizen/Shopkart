import express from 'express'
import { createProduct, getProductById, getProductCategories, getProducts } from '../controllers/product.controllers.js'
import { validateProductInput } from '../middlewares/productValidation.js'

const productRoutes = express.Router()

productRoutes.post('/', validateProductInput, createProduct)
productRoutes.get('/', getProducts)
productRoutes.get('/categories', getProductCategories)
productRoutes.get('/:id', getProductById)

export default productRoutes
