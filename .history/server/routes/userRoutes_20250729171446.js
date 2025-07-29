import express from 'express';

const userRouter = express.Router();

userRouter.get('/data', (req, res) => {
    res.json({ message: "User profile data" });
});