import { Router } from 'express';

import api from '../controllers/auth.controller';

const authRoute: Router = Router();

authRoute.post('/register', api.register);
authRoute.post('/login', api.login);

export default authRoute;
