
import React, { useEffect, useState } from 'react';
import * as studentService from '../../services/studentService';
import * as courseService from '../../services/courseService';
import { Attendance, Course, AttendanceStatus } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import Card from '../../components/Card';
import Alert from '../../components/Alert';

const StudentAttendancePage: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      setError(null);

      const [attendanceRes, coursesRes] = await Promise.all([
        studentService.getStudentAttendance(),
        courseService.getStudentEnrollments(), // To map course IDs to titles
      ]);

      if (attendanceRes.success && attendanceRes.data) {
        setAttendanceRecords(attendanceRes.data);
      } else {
        setError(attendanceRes.message || 'Failed to fetch attendance records.');
      }

      if (coursesRes.success && coursesRes.data) {
        setCourses(coursesRes.data);
      } else {
        console.error(coursesRes.message || 'Failed to fetch enrolled courses.');
      }

      setLoading(false);
    };

    fetchAttendance();
  }, []);

  const getCourseTitle = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : 'N/A';
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.PRESENT:
        return 'bg-green-100 text-green-800';
      case AttendanceStatus.ABSENT:
        return 'bg-red-100 text-red-800';
      case AttendanceStatus.LEAVE:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-6 min-h-screen-minus-nav-footer">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">My Attendance</h1>

      {error && <Alert type="error" message={error} className="mb-4" />}

      {attendanceRecords.length === 0 && !error ? (
        <p className="text-center text-gray-600 text-lg">No attendance records found.</p>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceRecords.map(record => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getCourseTitle(record.course_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StudentAttendancePage;
