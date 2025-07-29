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
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to AuthCodeLab",
            text: `Hello ${name},\n\nWelcome to AuthCodeLab! We're excited to have you on board. Your account has been successfully created with email id: ${email}.\n\nBest regards,\nAuthCodeLab Team`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333; text-align: center;">Welcome to AuthCodeLab!</h2>
                    <p>Hello <strong>${name}</strong>,</p>
                    <p>We're excited to have you on board! Your account has been successfully created.</p>
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Account Details:</strong></p>
                        <p>📧 Email: ${email}</p>
                        <p>📅 Registration Date: ${new Date().toLocaleDateString()}</p>
                    </div>
                    <p>Best regards,<br><strong>AuthCodeLab Team</strong></p>
                </div>
            `
        }

        try {
            await transporter.sendMail(mailOptions);
            console.log('Welcome email sent successfully to:', email);
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
            // Don't return error - user registration was successful, just email failed
        }

        return res.status(201).json({ success: true, message: "User registered successfully" });
    
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ success: false, message: "Server error" });
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

export const sendVerifyOtp = async (req, res) => { 
    try {
        const {userId} = req.body;

        console.log('Send OTP request received:', { userId, body: req.body });

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const user = await userModel.findById(userId);
        
        if (!user) {
            console.log('User not found with ID:', userId);
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        console.log('User found:', { email: user.email, isVerified: user.isAccountVerified });
        
        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "Account already verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        console.log('Generated OTP:', otp);

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
        await user.save();
        console.log('OTP saved to database successfully');

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP - AuthCodeLab",
            text: `Your OTP is ${otp}. Please verify your account using this OTP. This OTP will expire in 10 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333; text-align: center;">Account Verification</h2>
                    <p>Hello <strong>${user.name}</strong>,</p>
                    <p>Please use the following OTP to verify your account:</p>
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
                    </div>
                    <p><strong>⏰ This OTP will expire in 10 minutes.</strong></p>
                    <p>If you didn't request this verification, please ignore this email.</p>
                    <p>Best regards,<br><strong>AuthCodeLab Team</strong></p>
                </div>
            `
        };

        try {
            console.log('Attempting to send OTP email...');
            await transporter.sendMail(mailOptions);
            console.log('OTP email sent successfully to:', user.email);
            return res.status(200).json({ success: true, message: "Verification OTP sent successfully" });
        } catch (emailError) {
            console.error('Failed to send OTP email:', emailError);
            console.error('Email error details:', emailError.message);
            return res.status(500).json({ 
                success: false, 
                message: "Failed to send OTP email", 
                error: emailError.message 
            });
        }

    } catch (error) {
        console.error('Send OTP error:', error);
        console.error('Error stack:', error.stack);
        return res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message,
            details: "Check server logs for more details"
        });
    }
}

export const verifyEmail = async (req, res) => {

    const { userId, otp } = req.body;

    if(!userId || !otp) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const user = await userModel.findById(userId);

        if(!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if(user.verifyOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP expired" });
        }
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        
        await user.save();
        return res.status(200).json({ success: true, message: "Email verified successfully" });

    } catch (error) {
        return res.json({success: false, message: error.message});
    }

}

// Test email function to debug SMTP issues
export const testEmail = async (req, res) => {
    try {
        // Test transporter configuration
        await transporter.verify();
        console.log('SMTP server is ready to take our messages');

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: 'authn.sapuarachchi@gmail.com', // Send to your own email for testing
            subject: 'SMTP Test Email - AuthCodeLab',
            text: 'This is a test email to verify SMTP configuration is working correctly.',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">SMTP Test Email</h2>
                    <p>This is a test email to verify SMTP configuration is working correctly.</p>
                    <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
                    <p><strong>Status:</strong> ✅ SMTP Configuration Working</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info);
        
        return res.status(200).json({ 
            success: true, 
            message: 'Test email sent successfully',
            messageId: info.messageId,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('SMTP Error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'SMTP Error',
            error: error.message,
            details: error.response || 'No additional details',
            timestamp: new Date().toISOString()
        });
    }
};

// Test auth middleware
export const testAuth = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);
        
        return res.status(200).json({
            success: true,
            message: "Authentication working correctly",
            userId: userId,
            userEmail: user ? user.email : 'User not found',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Test auth error",
            error: error.message
        });
    }
};

//check user is authenticated
export const isAuthenticated = async(req, res, next) => {
    try {

    } catch (error) {
        res.
    }
}