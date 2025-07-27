import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../model/usermodel.js';
import transporter from '../config/nodemailer.js';


export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({ name, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        //sending welcome email
        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to AuthCodeLab",
            text: `Hello ${name},\n\nWelcome to AuthCodeLab! We're excited to have you on 
            board. Your account has been successfully created with email id : ${email}.\n\nBest regards,\nAuthCodeLab Team`
        }

        await transporter.sendMail(mailOptions);

        return res.status(201).json({ success: true, message: "User registered successfully" });
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ success: true, message: "Login successful" });
        
    } catch (error) {   
       return res.status(500).json({ success: false, message: "Server error" }); 
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict'
        });
        return res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

export const sendVerificationEmail = async (req, res) => { 
    try {
        const {userId} = req.body;

        const user = await userModel.findById(userId);
        if (user.isAccountVerified) {
            return res.status(200).json({ success: false, message: "Account already verified" });
        }

        Math.floor( Math.random() * 900000;

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });

    }
}
