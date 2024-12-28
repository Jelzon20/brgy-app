import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import residentRoutes from './routes/resident.route.js';
import documentRoutes from './routes/document.route.js';
import cookieParser from 'cookie-parser';


dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
  // NEW mongo_uri: mongodb+srv://solutionsharnael:solutionsharnael@abucay.fuogn.mongodb.net/?retryWrites=true&w=majority&appName=Abucay
    console.log("MongoDB is connected");}).catch((err) => {
    console.log(err);
  });
  

const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/resident', residentRoutes);
app.use('/api/document', documentRoutes);


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  })
});