import type { Request, Response } from 'express';
import Topics from '../models/topic.model';

const createTopic = async (req: Request, res: Response) => {
    try {
        const { topic, overAllStatus, subTopics, userId } = req.body;

        if (!userId || !topic) {
            return res.status(400).json({ error: 'userId and topic are required' });
        }

        let normalizedSubTopics: any[] = [];

        if (Array.isArray(subTopics)) {
            normalizedSubTopics = subTopics;
        } else if (subTopics && typeof subTopics === 'object') {
            normalizedSubTopics = [subTopics];
        }

        const existingTopic = await Topics.findOne({ topic, userId });

        if (existingTopic) {
            if (normalizedSubTopics.length > 0) {
                existingTopic.subTopics.push(...normalizedSubTopics);
            }

            if (overAllStatus) {
                existingTopic.overAllStatus = overAllStatus;
            }

            const updatedTopic = await existingTopic.save();

            return res.status(200).json({
                message: 'SubTopics added to existing topic',
                data: updatedTopic,
            });
        } else {
            const newTopic = await Topics.create({
                topic,
                overAllStatus,
                subTopics: normalizedSubTopics,
                userId,
            });

            return res.status(201).json({
                message: 'New topic created successfully',
                data: newTopic,
            });
        }
    } catch (error) {
        console.error('Create Topic Error:', error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

const getAllTopics = async (_req: Request, res: Response) => {
    try {
        const topics = await Topics.find();
        if (topics) {
            return res.status(200).json(topics);
        }
        return res.status(404).json({ error: 'No topics found' }); // return an error object
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Something went wrong' }); // return an error object
    }
};

 const updateSubTopicStatus = async (req: Request, res: Response) => {
    try {
      const { topicId, subTopicName, status } = req.body;
  
      if (!topicId || !subTopicName || !status) {
        return res.status(400).json({ error: 'topicId, subTopicName and status are required' });
      }
  
      const topic = await Topics.findById(topicId);
  
      if (!topic) {
        return res.status(404).json({ error: 'Topic not found' });
      }
  
      const subTopic = topic.subTopics.find(
        (sub: any) => sub.name.toLowerCase() === subTopicName.toLowerCase()
      );
  
      if (!subTopic) {
        return res.status(404).json({ error: 'SubTopic not found' });
      }
  
      subTopic.status = status;

      const allDone = topic.subTopics.every((sub: any) => sub.status === 'DONE');
            if (allDone) {
            topic.overAllStatus = 'DONE';
            } else {
            topic.overAllStatus = 'PENDING';
            }
            
      await topic.save();
  
      return res.status(200).json({
        message: 'SubTopic status updated successfully',
        data: topic,
      });
    } catch (error) {
      console.error('Update SubTopic Status Error:', error);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  };

export default {
    createTopic,
    getAllTopics,
    updateSubTopicStatus
};
