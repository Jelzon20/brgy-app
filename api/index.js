import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();

mongoose.connect('mongodb+srv://harnaelsolutions:test123@abucay.szurd.mongodb.net/?retryWrites=true&w=majority&appName=Abucay').then(() => {
    console.log("MongoDB is connected");}).catch((err) => {
    console.log(err);
  });
  

const app = express();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


//   .connect(process.env.MONGO)