import jwt from 'jsonwebtoken';
import userModel from '../model/usermodel.js';

const userAuth = async (req, res, next) => {
    const {token} = req.cookies;

    if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized. Login Again" }); 
    }

    try {
        jwt.verif
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" }); 
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" }); 
    }
};