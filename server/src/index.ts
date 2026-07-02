import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import User from './models/User';
import authRoutes from './routes/auth';
import patientRoutes from './routes/patients';
import appointmentRoutes from './routes/appointments';
import medicalRecordRoutes from './routes/medicalRecords';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medical-records', medicalRecordRoutes);

if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const seedIfEmpty = async () => {
  const count = await User.countDocuments();
  if (count === 0) {
    await User.create([
      { name: 'Admin User', email: 'admin@clinicflow.com', password: 'admin123', role: 'admin' },
      { name: 'Dr. Sarah Chen', email: 'sarah@clinicflow.com', password: 'doctor123', role: 'doctor' },
      { name: 'Mike Johnson', email: 'mike@clinicflow.com', password: 'reception123', role: 'receptionist' },
    ]);
    console.log('Seed data created for empty database');
  }
};

connectDB().then(async () => {
  await seedIfEmpty();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

export default app;
