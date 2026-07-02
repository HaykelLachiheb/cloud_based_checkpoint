import { Request, Response } from 'express';
import Patient from '../models/Patient';
import { AuthRequest } from '../middleware/auth';

export const getPatients = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;

    let query: any = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Patient.countDocuments(query);
    const patients = await Patient.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      patients,
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

export const getPatient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('createdBy', 'name');

    if (!patient) {
      res.status(404).json({ message: 'Patient not found' });
      return;
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createPatient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const patient = await Patient.create({
      ...req.body,
      createdBy: req.user!._id,
    });

    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updatePatient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!patient) {
      res.status(404).json({ message: 'Patient not found' });
      return;
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deletePatient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      res.status(404).json({ message: 'Patient not found' });
      return;
    }

    res.json({ message: 'Patient deleted' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
