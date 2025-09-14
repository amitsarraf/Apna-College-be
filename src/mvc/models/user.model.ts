import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import Counter from './counter.model';
export interface IUser {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

const generateUserId = async (): Promise<string> => {
  const counter = await Counter.findOneAndUpdate({ id: 'userId' }, { $inc: { seq: 1 } }, { new: true, upsert: true });

  const seqNumber = counter?.seq.toString().padStart(4, '0');
  return `USER-${seqNumber}`;
};

export interface UserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      unique: true,
    },

    role:{
      type: String,
      enum: ["ADMIN" , "CANDIDATE"]
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },

  {
    versionKey: false,
    timestamps: true,
  },
);

UserSchema.pre<UserModel>('save', async function (next) {
  if (!this.userId) {
    this.userId = await generateUserId();
  }
  next();
});

const User = mongoose.model<UserModel>('user', UserSchema);
export default User;
