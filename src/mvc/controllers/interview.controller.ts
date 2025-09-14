import { Request, Response } from 'express';
import Interview from '../models/interview.model';
import User from '../models/user.model';
import Submission from '../models/submission.model';
import mongoose from 'mongoose';

const createInterview = async (req: Request, res: Response) => {
  try {
    const { title, description, questions, createdBy } = req.body;

    if (!createdBy || !title) {
      return res.status(400).json({ error: 'createdBy and title are required' });
    }

    const user = await User.findById(createdBy);
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only Admins can create interviews' });
    }

    let normalizedQuestions: string[] = [];
    if (Array.isArray(questions)) {
      normalizedQuestions = questions;
    } else if (questions && typeof questions === 'string') {
      normalizedQuestions = [questions];
    }

    const newInterview = await Interview.create({
      title,
      description,
      questions: normalizedQuestions,
      createdBy,
    });

    return res.status(201).json({
      message: 'Interview created successfully',
      data: newInterview,
    });
  } catch (error) {
    console.error('Create Interview Error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const getAllInterviews = async (_req: Request, res: Response) => {
  try {
    const interviews = await Interview.find().sort({ createdAt: -1 });;
    return res.status(200).json({ data: interviews });
  } catch (error) {
    console.error('Get All Interviews Error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const getInterviewById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const interview = await Interview.findById(id).populate('createdBy', 'name role');

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    return res.status(200).json({ data: interview });
  } catch (error) {
    console.error('Get Interview By ID Error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const updateInterview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, questions, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only Admins can update interviews' });
    }

    const interview = await Interview.findById(id);
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    if (title) interview.title = title;
    if (description) interview.description = description;
    if (questions) {
      if (Array.isArray(questions)) {
        interview.questions = questions;
      } else if (typeof questions === 'string') {
        interview.questions = [questions];
      }
    }

    const updatedInterview = await interview.save();
    return res.status(200).json({ message: 'Interview updated', data: updatedInterview });
  } catch (error) {
    console.error('Update Interview Error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const deleteInterview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.body.currentUserId;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    const user = await User.findById(userId);
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only Admins can delete interviews' });
    }
    const interview = await Interview.findById(id);
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const submissionDeleteResult = await Submission.deleteMany({
        interviewId: id
      }).session(session);

      const deletedInterview = await Interview.findByIdAndDelete(id).session(session);

      await session.commitTransaction();

      return res.status(200).json({
        message: 'Interview and related submissions deleted successfully',
        deletedInterview: deletedInterview,
        deletedSubmissionsCount: submissionDeleteResult.deletedCount
      });

    } catch (transactionError) {
      await session.abortTransaction();
      throw transactionError;
    } finally {
      session.endSession();
    }

  } catch (error) {
    console.error('Delete Interview Error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

export default {
  createInterview,
  getAllInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
};
