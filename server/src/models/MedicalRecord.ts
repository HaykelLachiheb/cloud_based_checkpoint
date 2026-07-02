import mongoose, { Document, Schema } from 'mongoose';

export interface IMedicalRecord extends Document {
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  appointment?: mongoose.Types.ObjectId;
  diagnosis: string;
  prescription: string;
  notes?: string;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}

const medicalRecordSchema = new Schema<IMedicalRecord>(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient is required'],
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Doctor is required'],
    },
    appointment: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    diagnosis: {
      type: String,
      required: [true, 'Diagnosis is required'],
    },
    prescription: {
      type: String,
      default: '',
    },
    notes: { type: String },
    attachments: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model<IMedicalRecord>('MedicalRecord', medicalRecordSchema);
