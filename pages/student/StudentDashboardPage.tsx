
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import Card from '../../components/Card';

const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <p className="text-center text-gray-600 mt-10">Please log in to view your dashboard.</p>;
  }

  return (
    <div className="container mx-auto p-6 min-h-screen-minus-nav-footer">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Welcome, {user.name}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="text-center bg-blue-500 text-white transform transition duration-300 hover:scale-105 hover:shadow-lg">
          <i className="fas fa-book-open text-5xl mb-4"></i>
          <h2 className="text-2xl font-semibold mb-2">My Courses</h2>
          <p className="text-lg">View your enrolled courses and lectures.</p>
          <Link to="/student/courses" className="block mt-4 text-sm font-medium hover:underline">
            Go to Courses
          </Link>
        </Card>
        <Card className="text-center bg-green-500 text-white transform transition duration-300 hover:scale-105 hover:shadow-lg">
          <i className="fas fa-wallet text-5xl mb-4"></i>
          <h2 className="text-2xl font-semibold mb-2">My Payments</h2>
          <p className="text-lg">Manage fees and view transaction history.</p>
          <Link to="/student/payments" className="block mt-4 text-sm font-medium hover:underline">
            Go to Payments
          </Link>
        </Card>
        <Card className="text-center bg-purple-500 text-white transform transition duration-300 hover:scale-105 hover:shadow-lg">
          <i className="fas fa-calendar-alt text-5xl mb-4"></i>
          <h2 className="text-2xl font-semibold mb-2">My Timetable</h2>
          <p className="text-lg">Check your class schedule.</p>
          <Link to="/student/timetable" className="block mt-4 text-sm font-medium hover:underline">
            Go to Timetable
          </Link>
        </Card>
        <Card className="text-center bg-yellow-500 text-white transform transition duration-300 hover:scale-105 hover:shadow-lg">
          <i className="fas fa-clipboard-list text-5xl mb-4"></i>
          <h2 className="text-2xl font-semibold mb-2">My Attendance</h2>
          <p className="text-lg">Review your attendance records.</p>
          <Link to="/student/attendance" className="block mt-4 text-sm font-medium hover:underline">
            Go to Attendance
          </Link>
        </Card>
        <Card className="text-center bg-red-500 text-white transform transition duration-300 hover:scale-105 hover:shadow-lg">
          <i className="fas fa-certificate text-5xl mb-4"></i>
          <h2 className="text-2xl font-semibold mb-2">My Certificates</h2>
          <p className="text-lg">Download your course completion certificates.</p>
          <Link to="/student/certificates" className="block mt-4 text-sm font-medium hover:underline">
            Go to Certificates
          </Link>
        </Card>
        <Card className="text-center bg-indigo-500 text-white transform transition duration-300 hover:scale-105 hover:shadow-lg">
          <i className="fas fa-user-circle text-5xl mb-4"></i>
          <h2 className="text-2xl font-semibold mb-2">Profile</h2>
          <p className="text-lg">Manage your personal information.</p>
          <Link to="/student/profile" className="block mt-4 text-sm font-medium hover:underline">
            Edit Profile
          </Link>
        </Card>
      </div>

      <section className="mt-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Announcements</h2>
        <Card>
          <p className="text-gray-700">No new announcements at this time.</p>
        </Card>
      </section>
    </div>
  );
};

export default StudentDashboardPage;
