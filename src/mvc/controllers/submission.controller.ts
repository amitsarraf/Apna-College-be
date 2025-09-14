import { Request, Response } from 'express';
import Submission from '../models/submission.model';
import User from '../models/user.model';
import Interview from '../models/interview.model';

const createSubmission = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      questions,
      candidateId,
      reviewedBy,
      videoAnswers,
      score,
      comments,
      interviewId
    } = req.body;

    if (!title || !candidateId) {
      return res.status(400).json({ error: 'title and candidateId are required' });
    }

    const candidate = await User.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    let reviewer = null;
    if (reviewedBy) {
      reviewer = await User.findById(reviewedBy);
      if (!reviewer) {
        return res.status(404).json({ error: 'Reviewer not found' });
      }
    }

    let normalizedQuestions: string[] = [];
    if (Array.isArray(questions)) {
      normalizedQuestions = questions;
    } else if (questions && typeof questions === 'string') {
      normalizedQuestions = [questions];
    }

    let normalizedVideoAnswers: any[] = [];
    if (Array.isArray(videoAnswers)) {
      normalizedVideoAnswers = videoAnswers;
    }

    const newSubmission = await Submission.create({
      title,
      description,
      questions: normalizedQuestions,
      videoAnswers: normalizedVideoAnswers,
      candidateId,
      reviewedBy: reviewer?._id || null,
      score: score || 0,
      comments: comments || '',
      review: reviewedBy ? 'REVIEWED' : 'PENDING',
      interviewId
    });

    await Interview.findByIdAndUpdate(
      interviewId,
      { $addToSet: { attemptedBy: candidateId } }, 
      { new: true } 
    );

    return res.status(201).json({
      message: 'Submission created successfully',
      data: newSubmission,
    });
  } catch (error) {
    console.error('Create Submission Error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const getAllSubmissions = async (_req: Request, res: Response) => {
  try {
    const submission = await Submission.find().sort({ createdAt: -1 });;
    return res.status(200).json({ data: submission });
  } catch (error) {
    console.error('Get All submission Error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}

const updateSubmission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; 
    const {
      score,
      comments,
      reviewedBy,
      review 
    } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Submission ID is required' });
    }

    const existingSubmission = await Submission.findById(id);
    if (!existingSubmission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const updateData: any = {};

    if (score !== undefined) {
      if (typeof score !== 'number' || score < 0) {
        return res.status(400).json({ error: 'Score must be a positive number' });
      }
      updateData.score = score;
    }

    if (comments !== undefined) {
      updateData.comments = comments;
    }

    if (review !== undefined) {
      const validStatuses = ['PENDING', 'REVIEWED', 'IN_PROGRESS'];
      if (!validStatuses.includes(review)) {
        return res.status(400).json({ 
          error: 'Invalid review status. Must be one of: PENDING, REVIEWED, IN_PROGRESS' 
        });
      }
      updateData.review = review;
    }

    if (reviewedBy !== undefined) {
      if (reviewedBy === null) {
        updateData.reviewedBy = null;
      } else {
        const reviewer = await User.findById(reviewedBy);
        if (!reviewer) {
          return res.status(404).json({ error: 'Reviewer not found' });
        }
        updateData.reviewedBy = reviewedBy;
        
        if (review === undefined) {
          updateData.review = 'REVIEWED';
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ 
        error: 'At least one field (score, comments, reviewedBy, review) must be provided' 
      });
    }

    updateData.updatedAt = new Date();

    const updatedSubmission = await Submission.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    )

    return res.status(200).json({
      message: 'Submission updated successfully',
      data: updatedSubmission,
    });

  } catch (error) {
    console.error('Update Submission Error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.message 
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    return res.status(500).json({ error: 'Something went wrong' });
  }
};

export default {
  createSubmission,
  getAllSubmissions,
  updateSubmission,
};
