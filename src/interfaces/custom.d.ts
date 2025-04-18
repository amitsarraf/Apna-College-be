import { Request } from 'express';
import { UserModel } from '../mvc/models/user.model'; 

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserModel;
  }
}
