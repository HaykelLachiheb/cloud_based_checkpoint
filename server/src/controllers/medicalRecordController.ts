import { Response } from 'express';
import MedicalRecord from '../models/MedicalRecord';
import { AuthRequest } from '../middleware/auth';

export const getRecords = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { patientId } = req.query;
    let query: any = {};
    if (patientId) query.patient = patientId;

    const records = await MedicalRecord.find(query)
      .populate('patient', 'firstName lastName')
      .populate('doctor', 'name')
      .populate('appointment', 'date timeSlot reason')
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('patient', 'firstName lastName')
      .populate('doctor', 'name')
      .populate('appointment', 'date timeSlot');

    if (!record) {
      res.status(404).json({ message: 'Record not found' });
      return;
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const record = await MedicalRecord.create({
      ...req.body,
      doctor: req.user!._id,
    });

    const populated = await record.populate([
      { path: 'patient', select: 'firstName lastName' },
      { path: 'doctor', select: 'name' },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const record = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('patient', 'firstName lastName')
      .populate('doctor', 'name');

    if (!record) {
      res.status(404).json({ message: 'Record not found' });
      return;
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const record = await MedicalRecord.findByIdAndDelete(req.params.id);

    if (!record) {
      res.status(404).json({ message: 'Record not found' });
      return;
    }

    res.json({ message: 'Record deleted' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
