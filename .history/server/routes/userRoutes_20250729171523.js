import express from 'express';
import userAuth from '../middleware/userAuth';

const userRouter = express.Router();

userRouter.get('/data', userAuth, get);