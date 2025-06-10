import mongoose from 'mongoose';

export default () => {
  const mongoString = process.env.DATABASE_URL;
  mongoose.set('strictQuery', false);
  mongoose.connect(mongoString, {}, (error: any) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Database Connected');
    }
  });
};
