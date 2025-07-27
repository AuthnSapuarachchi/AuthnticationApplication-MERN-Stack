import jwt from 'jsonwebtoken';
import userModel from '../model/usermodel.js';

const userAuth = async (req, res, next) => {
    const {token} = req.cookies;

    if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized. Login Again" }); 
    }

    try {
        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
        if (tokenDecoded.id) {
            req.body.userId = tokenDecoded.id; 
        } else {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        next();

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" }); 
    }
};