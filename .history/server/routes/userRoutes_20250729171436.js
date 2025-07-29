import express from 'express';

const userRouter = express.Router();

userRouter.get('/profile', (req, res) => {
    res.json({ message: "User profile data" });
});