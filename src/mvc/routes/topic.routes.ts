import { Router } from 'express';

import api from '../controllers/topic.controller';

const topicRoute: Router = Router();

topicRoute.post('/create-topic', api.createTopic);
topicRoute.get('/get-all-topic', api.getAllTopics);
topicRoute.put('/update-topic', api.updateSubTopicStatus);

export default topicRoute;
