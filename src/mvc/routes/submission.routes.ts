import { Router } from 'express';

import api from '../controllers/submission.controller';

const submissionRoute: Router = Router();

submissionRoute.post('/create-submission', api.createSubmission);
submissionRoute.get('/get-all-submission', api.getAllSubmissions);
submissionRoute.put('/update-submission/:id', api.updateSubmission);

export default submissionRoute;
