import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import cors from 'cors';
dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// API versioning for forward compatibility.
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);

// Scalability note:
// As traffic grows, consider Redis for caching hot reads,
// Docker for consistent deployments, and splitting auth/tasks
// into separate services.

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});

