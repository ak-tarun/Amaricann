
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';
import * as adminService from '../../services/adminService';
import * as courseService from '../../services/courseService'; // Import course service
// Fix: Import paymentService
import * as paymentService from '../../services/paymentService';
import Button from '../../components/Button';
import { UserRole } from '../../types';
import { useAuth } from '../../components/AuthContext';

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    pendingPayments: 0,
    monthlyRevenue: '0',
    averageAttendance: '0%',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      setError(null);
      try {
        // These would typically be a single dashboard stats API endpoint
        // For demonstration, we'll use mock data or call individual services
        const studentsRes = await adminService.getAllStudents();
        const coursesRes = await courseService.getAllCourses(); // Correctly fetch all courses
        // Fix: Call getAllPayments from paymentService
        const paymentsRes = await paymentService.getAllPayments();

        // Simulate further data processing or call dedicated stats endpoint
        const mockStats = {
          totalStudents: studentsRes.success ? studentsRes.data?.length || 0 : 0,
          totalCourses: coursesRes.success ? coursesRes.data?.length || 0 : 0, // Use actual courses count
          totalEnrollments: (studentsRes.success && studentsRes.data) ? studentsRes.data.length * 1.5 : 0, // Mock
          pendingPayments: (paymentsRes.success && paymentsRes.data) ? paymentsRes.data.filter(p => p.status === 'pending').length : 0,
          monthlyRevenue: '₹' + (Math.random() * 100000).toFixed(2),
          averageAttendance: `${(Math.random() * 20 + 75).toFixed(0)}%`,
        };
        setStats(mockStats);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch dashboard statistics.');
      }
      setLoading(false);
    };

    fetchDashboardStats();
  }, []);

  const handleExport = async (reportType: string) => {
    setError(null);
    let response;
    switch (reportType) {
      case 'students':
        response = await adminService.exportStudentsReport();
        break;
      case 'attendance':
        response = await adminService.exportAttendanceReport();
        break;
      case 'payments':
        response = await adminService.exportPaymentsReport();
        break;
      default:
        setError('Unknown report type.');
        return;
    }

    if (response.success && response.data) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}-report-${new Date().toISOString()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } else {
      setError(response.message || `Failed to export ${reportType} report.`);
    }
  };


  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-6 min-h-screen-minus-nav-footer">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-4" />}

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Students" value={stats.totalStudents} icon="fas fa-users" color="bg-blue-500" />
        <StatCard title="Total Courses" value={stats.totalCourses} icon="fas fa-book" color="bg-green-500" />
        <StatCard title="Pending Payments" value={stats.pendingPayments} icon="fas fa-hourglass-half" color="bg-yellow-500" />
        <StatCard title="Monthly Revenue" value={stats.monthlyRevenue} icon="fas fa-dollar-sign" color="bg-indigo-500" />
        <StatCard title="Avg. Attendance" value={stats.averageAttendance} icon="fas fa-chart-line" color="bg-purple-500" />
        <StatCard title="Total Enrollments" value={stats.totalEnrollments} icon="fas fa-user-plus" color="bg-pink-500" />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Link to="/admin/students"><Button variant="secondary" className="w-full">Manage Students</Button></Link>
            <Link to="/admin/courses"><Button variant="secondary" className="w-full">Manage Courses</Button></Link>
            <Link to="/admin/payments"><Button variant="secondary" className="w-full">Manage Payments</Button></Link>
            <Link to="/admin/timetable"><Button variant="secondary" className="w-full">Manage Timetable</Button></Link>
            <Link to="/admin/attendance"><Button variant="secondary" className="w-full">Manage Attendance</Button></Link>
            <Link to="/admin/certificates"><Button variant="secondary" className="w-full">Manage Certificates</Button></Link>
            {user?.role === UserRole.SUPER_ADMIN && (
              <Link to="/admin/users"><Button variant="secondary" className="w-full">Manage Users</Button></Link>
            )}
            <Link to="/admin/settings"><Button variant="secondary" className="w-full">Settings</Button></Link>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Reports & Exports</h2>
          <div className="space-y-3">
            <Button onClick={() => handleExport('students')} variant="outline" className="w-full">
              <i className="fas fa-file-excel mr-2"></i> Export Students Report (CSV/XLSX)
            </Button>
            <Button onClick={() => handleExport('attendance')} variant="outline" className="w-full">
              <i className="fas fa-file-excel mr-2"></i> Export Attendance Report (CSV/XLSX)
            </Button>
            <Button onClick={() => handleExport('payments')} variant="outline" className="w-full">
              <i className="fas fa-file-excel mr-2"></i> Export Payments Report (CSV/XLSX)
            </Button>
          </div>
        </Card>
      </section>

      {/* Placeholder for charts or more detailed reports */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Enrollment Trends (Placeholder)</h2>
        <Card className="h-64 flex items-center justify-center text-gray-500">
          <p>Chart integration would go here (e.g., using Recharts or D3)</p>
        </Card>
      </section>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <Card className={`${color} text-white flex items-center p-5 transform transition duration-300 hover:scale-105 hover:shadow-xl`}>
    <div className="flex-shrink-0 mr-4">
      <i className={`${icon} text-4xl`}></i>
    </div>
    <div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  </Card>
);

export default AdminDashboardPage;
