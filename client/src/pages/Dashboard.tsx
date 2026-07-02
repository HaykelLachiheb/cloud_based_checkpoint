import { useState, useEffect } from 'react';
import { Users, Calendar, ClipboardList, Activity } from 'lucide-react';
import api from '../api';
import { StatCard } from '../components/StatCard';

interface DashboardStats {
  totalPatients: number;
  totalAppointments: number;
  todayAppointments: number;
  totalRecords: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    totalRecords: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [patientsRes, appointmentsRes, recordsRes] = await Promise.all([
          api.get('/patients?limit=1'),
          api.get('/appointments?limit=1'),
          api.get('/medical-records'),
        ]);

        const today = new Date().toISOString().split('T')[0];
        const todayRes = await api.get(`/appointments?startDate=${today}&endDate=${today}`);

        setStats({
          totalPatients: patientsRes.data.pagination.total,
          totalAppointments: appointmentsRes.data.pagination.total,
          todayAppointments: todayRes.data.pagination.total,
          totalRecords: recordsRes.data.length,
        });
      } catch {
        // handle error silently
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon={<Users className="h-6 w-6 text-blue-600" />}
          color="bg-blue-100"
        />
        <StatCard
          title="Total Appointments"
          value={stats.totalAppointments}
          icon={<Calendar className="h-6 w-6 text-purple-600" />}
          color="bg-purple-100"
        />
        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          icon={<Activity className="h-6 w-6 text-green-600" />}
          color="bg-green-100"
        />
        <StatCard
          title="Medical Records"
          value={stats.totalRecords}
          icon={<ClipboardList className="h-6 w-6 text-orange-600" />}
          color="bg-orange-100"
        />
      </div>
    </div>
  );
}
