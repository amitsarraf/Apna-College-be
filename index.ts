import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { verifyJWT } from './src/mvc/middlewares/auth';
import authRoute from './src/mvc/routes/auth.routes';
import userRoute from './src/mvc/routes/user.routes';
import mongoose from 'mongoose';
import interviewRoute from './src/mvc/routes/interview.routes';
import submissionRoute from './src/mvc/routes/submission.routes';


dotenv.config();
const PORT = 4000

const app: Express = express();

// Configure CORS with specific options
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply CORS middleware before any routes
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', authRoute);
app.use('/api', verifyJWT, userRoute);
app.use('/api', verifyJWT, interviewRoute);
app.use('/api', verifyJWT, submissionRoute);


mongoose.set('strictQuery', false);

const mongoURI = process.env.DATABASE_URL;

mongoose.connect(mongoURI as string);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection failed'));
db.once('open', async () => {
  console.log('Database conencted successfully!');
});

app.get('/', (req, res) => {
  res.send('Server is calling ');
});

app.all('*', (req, res) => {
  res.status(404).send({
    error: true,
    code: 404,
    msg: 'Api Not Found',
  });
});

app.listen(PORT, () => {
  console.log(`⚡️ [server]: Server is running at http://localhost:${PORT}`);
});
export default app;

