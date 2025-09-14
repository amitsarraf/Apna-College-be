import mongoose, { Schema, Document } from 'mongoose';

interface IInterview extends Document {
  title: string;
  description: string;
  questions: string[];
  attemptedBy:  mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId; 
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema: Schema<IInterview> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    questions: {
      type: [String], 
      required: true,
      default: [],
    },
     attemptedBy: {
      type: [Schema.Types.ObjectId], 
      default: [],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
  },
  { timestamps: true } 
);

const Interview = mongoose.model<IInterview>('Interview', InterviewSchema);
export default Interview
