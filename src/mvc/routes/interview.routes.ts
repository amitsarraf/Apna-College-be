import { Router } from 'express';

import api from '../controllers/interview.controller';

const interviewRoute: Router = Router();

interviewRoute.post('/create-interview', api.createInterview);
interviewRoute.get('/get-all-interviews', api.getAllInterviews);
interviewRoute.put('/update-interview/:id', api.updateInterview);
interviewRoute.delete('/delete-interview/:id', api.deleteInterview);
interviewRoute.get('/get-interview/:id', api.getInterviewById);

export default interviewRoute;
