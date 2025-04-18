import type { Document } from 'mongoose';
import mongoose, { Schema, Types } from 'mongoose';

export interface ISubTopic {
  name?: string;
  leetCodeLink?: string;
  youTubeLink?: string;
  articleLink?: string;
  level?: 'EASY' | 'MEDIUM' | 'HARD';
  status?: 'DONE' | 'PENDING';
}

export interface ITopic {
  topic?: string;
  overAllStatus?: 'DONE' | 'PENDING';
  subTopics?: ISubTopic[];
  userId: string; 
}

export interface TopicModel extends ITopic, Document {}

const SubTopicSchema = new Schema<ISubTopic>(
  {
    name: { type: String },
    leetCodeLink: { type: String },
    youTubeLink: { type: String },
    articleLink: { type: String },
    level: {
      type: String,
      enum: ['EASY', 'MEDIUM', 'HARD'],
    },
    status: {
      type: String,
      enum: ['DONE', 'PENDING'],
    },
  },
  { _id: false }
);

const TopicSchema = new Schema<ITopic>(
  {
    topic: { type: String },
    overAllStatus: { type: String, enum: ['DONE', 'PENDING'] },
    subTopics: [SubTopicSchema],
    userId: { type: String, ref: 'user', required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Topics = mongoose.model<TopicModel>('topics', TopicSchema);

export default Topics;
