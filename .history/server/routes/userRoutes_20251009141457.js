import express from 'express';
import userAuth from '../middleware/userAuth.js';
import roleAuth from '../middleware/roleAuth.js';
import { getUserData } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);

// Admin-only route example
userRouter.get('/admin-data', userAuth, roleAuth('admin'), (req, res) => {
    res.json({ 
        success: true, 
        message: "Admin data access granted",
        timestamp: new Date().toISOString() 
    });
});

// Multiple roles example (admin or moderator)
userRouter.get('/moderator-data', userAuth, roleAuth(['admin', 'moderator']), (req, res) => {
    res.json({ 
        success: true, 
        message: "Moderator data access granted",
        userRole: req.body.role,
        timestamp: new Date().toISOString() 
    });
});

export default userRouter;