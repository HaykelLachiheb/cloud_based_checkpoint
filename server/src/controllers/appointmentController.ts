import { Request, Response } from 'express';
import Appointment from '../models/Appointment';
import { AuthRequest } from '../middleware/auth';

export const getAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    let query: any = {};
    if (status) query.status = status;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const total = await Appointment.countDocuments(query);
    const appointments = await Appointment.find(query)
      .populate('patient', 'firstName lastName phone')
      .populate('doctor', 'name email')
      .populate('createdBy', 'name')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      appointments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'firstName lastName phone email')
      .populate('doctor', 'name email')
      .populate('createdBy', 'name');

    if (!appointment) {
      res.status(404).json({ message: 'Appointment not found' });
      return;
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const appointment = await Appointment.create({
      ...req.body,
      createdBy: req.user!._id,
    });

    const populated = await appointment.populate([
      { path: 'patient', select: 'firstName lastName phone' },
      { path: 'doctor', select: 'name email' },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('patient', 'firstName lastName phone')
      .populate('doctor', 'name email');

    if (!appointment) {
      res.status(404).json({ message: 'Appointment not found' });
      return;
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      res.status(404).json({ message: 'Appointment not found' });
      return;
    }

    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
