import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '.env') })

import userRoutes from './routes/user.routes.js'
import productRoutes from './routes/product.routes.js'
import wishlistRoutes from './routes/wishlist.routes.js'
import cartRoutes from './routes/cart.routes.js'
import orderRoutes from './routes/order.routes.js'

const app = express()
const PORT = 8085
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(cookieParser())
mongoose.connect(process.env.dbUrl)
    .then(() => console.log('DB Connected'))
    .catch((error) => console.log(error))

app.use('/customers', userRoutes)
app.use('/products', productRoutes)
app.use('/wishlist', wishlistRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', orderRoutes)
app.listen(PORT, () => console.log(`Server started at ${PORT}`))
