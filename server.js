import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import dashboardRouter from './routes/dashboard_router.js';
import apiRouter from './apis/dashboard/dashboard_api_router.js';
import frontEndRouter from './routes/frontend/frontend_router.js';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
app.use(express.static('public'));
app.use(express.json());
app.use(session({
  secret: 'kp2024',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  }
}));

//-------------------------------

app.use('/dashboard', dashboardRouter);
app.use('/api', apiRouter);
app.use('/', frontEndRouter);
app.use((req, res, next) => res.status(404).redirect('/404'));

app.set('view engine', 'ejs');

const PORT = process.env.PORT || 3000;
const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
};

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectToDb();
});

/* 
PORT=3000
MONGO_URI=mongodb+srv://itayakni:kick.pulse.c  s@cluster0.yl5rjk1.mongodb.net/kickpulse_2024?retryWrites=true&w=majority&appName=Cluster0
*/