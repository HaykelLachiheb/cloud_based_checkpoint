import dotenv from 'dotenv';
import connectDB from './config/db';
import User from './models/User';

dotenv.config();

const seed = async () => {
  await connectDB();

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@clinicflow.com',
    password: 'admin123',
    role: 'admin',
  });

  const doctor = await User.create({
    name: 'Dr. Sarah Chen',
    email: 'sarah@clinicflow.com',
    password: 'doctor123',
    role: 'doctor',
  });

  const receptionist = await User.create({
    name: 'Mike Johnson',
    email: 'mike@clinicflow.com',
    password: 'reception123',
    role: 'receptionist',
  });

  console.log('Seed data created:');
  console.log(`Admin: admin@clinicflow.com / admin123`);
  console.log(`Doctor: sarah@clinicflow.com / doctor123`);
  console.log(`Receptionist: mike@clinicflow.com / reception123`);

  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
