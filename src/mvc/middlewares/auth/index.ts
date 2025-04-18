import type { NextFunction, Request, Response } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import User, { UserModel } from '../../models/user.model'; 

export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization as string;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, async (err, decoded: any) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden', err });
      }

      const userData = decoded?.data?.email;
      if (!userData) {
        return res.status(404).json({ message: 'User data not found' });
      }

      const user = await User.findOne({
        $or: [{ email: userData }],
      });

      if (!user) {
        return res.status(403).json({ message: 'User not found' });
      }

      req.body.currentUserId = user._id;
      (req as Request & { user: UserModel }).user = user;

      next();
    });
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    }
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
