// types/express/index.d.ts

import { UserModel } from '../mvc/models/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: UserModel;
    }
  }
}
