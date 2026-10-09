import Customer from "../models/user.model.js";
import bcrypt from 'bcrypt'
import { genToken } from "../utils/generateTokens.js";

// COOKIE
const cookiesOption = {
    httpOnly:true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
}

//CUSTOMER REGISTRATION
export const registerUser = async (req, res) => {
    try {
        const { fullName, email, password, phone } = req.body

        if (!fullName || !email || !password || !phone) {
            return res.status(400).json({ message: "All fields Required" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password length should be greater than 6" })
        }

        const emailExists = await Customer.findOne({ email })

        if (emailExists) {
            return res.status(409).json({ message: "User Already Exists" })
        }

        const phoneExists = await Customer.findOne({ phone })

        if (phoneExists) {
            return res.status(409).json({ message: "Phone number Already Exists" })
        }

        //PASSWORD HASHING
        const hashedPassword = await bcrypt.hash(password, 10)

        const newCustomer = await Customer.create({
            fullName,
            email,
            password: hashedPassword,
            phone
        })

        // TOKEN -JWT
        const token = genToken(newCustomer._id)
        res.cookie("token", token, cookiesOption)

        const customerData = newCustomer.toObject()
        delete customerData.password

        res.status(201).json({
            success: true,
            message: "Customer Registered Succesfully",
            customer: customerData
        })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Errorr', error: error })
    }
}

//LOGIN CUSTOMER
export const loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(401).json({ message: "Invalid credentials" })
        }
        const customer = await Customer.findOne({ email })
        if (!customer) {
            return res.status(401).json({ message: "Invalid email" })
        }
        const passwordCheck = await bcrypt.compare(password, customer.password)

        if (!passwordCheck) {
            return res.status(401).json({ message: "Invalid password" })
        }

        const token = genToken(customer._id)
        res.cookie("token", token, cookiesOption)

        const customerData = customer.toObject()
        delete customerData.password

        res.status(200).json({
            "success": true,
            "message": "Login successful",
            "customer": customerData
        })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Errorr', error: error })
    }
}

//GET CUSTOMER
export const getCustomer = async (req,res)=>{
    const customerData = req.user.toObject()
    delete customerData.password
    res.status(200).json({
        message: "Customer Authenticated",
        customerData
    })
}

//CHANGE CUSTOMER PASSWORD
export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Old and new passwords are required" })
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password length should be greater than 6" })
        }

        const oldPasswordMatches = await bcrypt.compare(oldPassword, req.user.password)

        if (!oldPasswordMatches) {
            return res.status(401).json({ message: "Old password is incorrect" })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        req.user.password = hashedPassword
        await req.user.save()

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Errorr", error })
    }
}

//LOGOUT CUSTOMER
export const logoutCustomer = (req, res) => {
    res.clearCookie("token", cookiesOption)
    res.status(200).json({ success: true, message: "Logged out successfully" })
}
