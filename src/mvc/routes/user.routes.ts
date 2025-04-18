import { Router } from 'express';

import api from '../controllers/user.controller';

const userRoute: Router = Router();

userRoute.get('/getalluser', api.getAllUsers);
userRoute.get('/getCurrentUser', api.getCurrentUser);
userRoute.put('/update/:userId', api.updateUser);

export default userRoute;
