import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import { generateToken, AuthRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken((user._id as mongoose.Types.ObjectId).toString(), user.role),
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken((user._id as mongoose.Types.ObjectId).toString(), user.role),
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({
    _id: req.user!._id,
    name: req.user!.name,
    email: req.user!.email,
    role: req.user!.role,
  });
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
