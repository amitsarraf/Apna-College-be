import * as bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
//import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/user.model';
import { getAccessToken, getRefreshToken } from '../../helpers/getToken';



const register = async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    email,
    password,
  } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "Password can't be shorter than 8 characters" });
  }

  try {
    const userExists = await User.findOne({ email: new RegExp(email, 'i') });
    if (userExists) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    return res.status(201).json({
      //accestoken,
      //refreshtoken,
      message: 'User registered successfully',
      userId: savedUser._id,
    });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password, remember } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ error: 'Oops! Invalid Email Address. Please double-check your email address and try again.' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Invalid Credentials' });
    }
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(400).json({ error: 'Invalid Credentials' });
    }
    const accessToken = getAccessToken(user?.email, remember ? '1d' : '6h');
    const refreshToken = getRefreshToken(user?.email);
    return res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default {
  register,
  login,
};
