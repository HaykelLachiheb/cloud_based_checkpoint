import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

interface MedicalRecord {
  _id: string;
  patient: { _id: string; firstName: string; lastName: string };
  doctor: { _id: string; name: string };
  diagnosis: string;
  prescription: string;
  notes?: string;
  createdAt: string;
}

interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
}

const emptyForm = {
  patient: '',
  diagnosis: '',
  prescription: '',
  notes: '',
};

export default function MedicalRecords() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [patientFilter, setPatientFilter] = useState('');

  const fetchRecords = async () => {
    const params: any = {};
    if (patientFilter) params.patientId = patientFilter;
    const res = await api.get('/medical-records', { params });
    setRecords(res.data);
  };

  useEffect(() => {
    fetchRecords();
    api.get('/patients?limit=200').then((res) => setPatients(res.data.patients));
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [patientFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/medical-records', form);
      toast.success('Medical record created');
      setShowForm(false);
      setForm(emptyForm);
      fetchRecords();
    } catch {
      toast.error('Failed to create record');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Record
        </button>
      </div>

      <div className="mb-4">
        <select
          value={patientFilter}
          onChange={(e) => setPatientFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
        >
          <option value="">All patients</option>
          {patients.map((p) => (
            <option key={p._id} value={p._id}>{p.firstName} {p.lastName}</option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-semibold mb-4">New Medical Record</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                <select required value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
                  <option value="">Select patient</option>
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>{p.firstName} {p.lastName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                <textarea required value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prescription</label>
                <textarea value={form.prescription} onChange={(e) => setForm({ ...form, prescription: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" rows={2} />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={submitting}
                  className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
                  {submitting ? 'Saving...' : 'Create Record'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {records.map((r) => (
          <div key={r._id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {r.patient?.firstName} {r.patient?.lastName}
                </h3>
                <p className="text-sm text-gray-500">
                  Dr. {r.doctor?.name} &middot; {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-700">Diagnosis:</span>
                <p className="text-sm text-gray-600 mt-0.5">{r.diagnosis}</p>
              </div>
              {r.prescription && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Prescription:</span>
                  <p className="text-sm text-gray-600 mt-0.5">{r.prescription}</p>
                </div>
              )}
              {r.notes && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Notes:</span>
                  <p className="text-sm text-gray-600 mt-0.5">{r.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
        {records.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No medical records found
          </div>
        )}
      </div>
    </div>
  );
}
