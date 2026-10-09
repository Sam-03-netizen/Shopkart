import dotenv from 'dotenv'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import Razorpay from 'razorpay'

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env') })

const keyId = process.env.RAZORPAY_KEY_ID?.trim()
const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim()

const razorpay = keyId && keySecret
  ? new Razorpay({ key_id: keyId, key_secret: keySecret })
  : null

export default razorpay
