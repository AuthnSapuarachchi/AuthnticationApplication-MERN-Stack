import jwt from 'jsonwebtoken';
import userModel from '../model/usermodel.js';

const userAuth = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized. " }); 
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" }); 
        }
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" }); 
    }
};