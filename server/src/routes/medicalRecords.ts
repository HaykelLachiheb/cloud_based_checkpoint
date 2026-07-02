import { Router } from 'express';
import {
  getRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
} from '../controllers/medicalRecordController';
import { protect } from '../middleware/auth';

const router = Router();

router.route('/')
  .get(protect, getRecords)
  .post(protect, createRecord);

router.route('/:id')
  .get(protect, getRecord)
  .put(protect, updateRecord)
  .delete(protect, deleteRecord);

export default router;
