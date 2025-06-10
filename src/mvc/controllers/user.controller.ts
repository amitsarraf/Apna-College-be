import type { Request, Response } from 'express';
import User, { UserModel } from '../models/user.model';

const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password -otp');
    if (users) {
      return res.status(200).json(users);
    }
    return res.status(404).json({ error: 'No users found' }); // return an error object
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong' }); // return an error object
  }
};

const getCurrentUser = async (req: Request & { user?: UserModel }, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await User.findById(req.user._id).select('-password -OneTimePassword -verifyToken -verifyTokenExpiry');

    if (user) {
      return res.status(200).json(user);
    }
    return res.status(404).json({ error: 'User not found' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const {
    firstName,
    lastName,
    email,
  } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { userId },
      {
        firstName,
        lastName,
        email,
      },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ success: true, data: updatedUser });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

export default {
  getAllUsers,
  getCurrentUser,
  updateUser,
};
