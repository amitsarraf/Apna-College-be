import mongoose, { Schema, Document } from 'mongoose';

interface IVideoAnswer {
  question: string;
  videoUrl: string;
}

interface ISubmission extends Document {
  title: string;
  description: string;
  questions: string[];
  videoAnswers: IVideoAnswer[];
  candidateId: mongoose.Types.ObjectId;
  reviewedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  review?: 'PENDING' | 'REVIEWED';
  score: number
  comments: string
  interviewId: mongoose.Types.ObjectId;
}

const VideoAnswerSchema: Schema<IVideoAnswer> = new Schema({
  question: { type: String, required: true },
  videoUrl: { type: String, required: true },
});

const SubmissionSchema: Schema<ISubmission> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    review: {
      type: String,
      enum: ['PENDING', 'REVIEWED'],
      default: 'PENDING',
    },
    videoAnswers: {
      type: [VideoAnswerSchema],
      default: [],
    },
    questions: {
      type: [String],
      required: true,
      default: [],
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    score: {
      type: Number,
    },
    comments: {
      type: String,
      trim: true
    },
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    interviewId: {
      type: Schema.Types.ObjectId,
      ref: 'Interview',
      required: true,
    }
  },
  { timestamps: true }
);

const Submission = mongoose.model<ISubmission>('Submission', SubmissionSchema);
export default Submission;
