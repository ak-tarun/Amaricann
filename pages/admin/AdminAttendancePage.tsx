
import React, { useEffect, useState } from 'react';
import * as adminService from '../../services/adminService';
import * as courseService from '../../services/courseService';
import { Attendance, Course, User, AttendanceStatus, UserRole } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';

const AdminAttendancePage: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [filterCourseId, setFilterCourseId] = useState<string>('');
  const [filterDate, setFilterDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [isMarkAttendanceModalOpen, setIsMarkAttendanceModalOpen] = useState(false);
  const [attendanceFormData, setAttendanceFormData] = useState<{
    course_id: number | '';
    date: string;
    studentAttendances: { user_id: number; status: AttendanceStatus }[];
  }>({
    course_id: '',
    date: new Date().toISOString().split('T')[0],
    studentAttendances: [],
  });

  useEffect(() => {
    fetchInitialData();
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (filterDate) {
      fetchAttendanceRecords(filterCourseId ? parseInt(filterCourseId) : undefined, filterDate);
    }
  }, [filterCourseId, filterDate]);

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    const [studentsRes, coursesRes] = await Promise.all([
      adminService.getAllStudents(),
      courseService.getAllCourses(),
    ]);

    if (studentsRes.success && studentsRes.data) {
      setStudents(studentsRes.data.filter(u => u.role === UserRole.STUDENT));
    } else {
      setError(studentsRes.message || 'Failed to fetch students.');
    }
    if (coursesRes.success && coursesRes.data) {
      setCourses(coursesRes.data);
    } else {
      setError(coursesRes.message || 'Failed to fetch courses.');
    }
    setLoading(false);
  };

  const fetchAttendanceRecords = async (courseId?: number, date?: string) => {
    setLoading(true);
    setError(null);
    const response = await adminService.getAttendanceRecords(courseId, date);
    if (response.success && response.data) {
      setAttendanceRecords(response.data);
    } else {
      setError(response.message || 'Failed to fetch attendance records.');
    }
    setLoading(false);
  };

  const getCourseTitle = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : 'N/A';
  };

  const getStudentName = (userId: number) => {
    const student = students.find(s => s.id === userId);
    return student ? student.name : 'N/A';
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

  const openMarkAttendanceModal = () => {
    if (!filterCourseId || !filterDate) {
      setError('Please select a course and date to mark attendance.');
      return;
    }
    // Initialize form data with students
    const initialStudentAttendances = students.map(student => ({
      user_id: student.id,
      status: AttendanceStatus.PRESENT, // Default to present
    }));

    setAttendanceFormData({
      course_id: parseInt(filterCourseId),
      date: filterDate,
      studentAttendances: initialStudentAttendances,
    });
    setIsMarkAttendanceModalOpen(true);
  };

  const handleAttendanceFormChange = (userId: number, status: AttendanceStatus) => {
    setAttendanceFormData(prev => ({
      ...prev,
      studentAttendances: prev.studentAttendances.map(sa =>
        sa.user_id === userId ? { ...sa, status } : sa
      ),
    }));
  };

  const handleMarkAttendanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    if (!attendanceFormData.course_id || !attendanceFormData.date) {
      setError('Course and date are required.');
      setLoading(false);
      return;
    }

    // Convert array of student attendances to individual markAttendance calls
    // Or, if backend supports batch, send as a single payload
    const batchPromises = attendanceFormData.studentAttendances.map(sa =>
      adminService.markAttendance({
        course_id: Number(attendanceFormData.course_id),
        date: attendanceFormData.date,
        user_id: sa.user_id,
        status: sa.status,
      })
    );

    const results = await Promise.all(batchPromises);
    const hasErrors = results.some(res => !res.success);

    if (hasErrors) {
      setError('Some attendance records failed to update.');
    } else {
      setMessage('Attendance marked successfully!');
      setIsMarkAttendanceModalOpen(false);
      fetchAttendanceRecords(Number(filterCourseId), filterDate);
    }
    setLoading(false);
  };

  if (loading && (!students.length || !courses.length)) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-6 min-h-screen-minus-nav-footer">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Attendance Management</h1>

      {message && <Alert type="success" message={message} onClose={() => setMessage(null)} className="mb-4" />}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-4" />}

      <Card className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Filter & Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
          <div className="col-span-1">
            <label htmlFor="filterCourse" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Course
            </label>
            <select
              id="filterCourse"
              value={filterCourseId}
              onChange={(e) => setFilterCourseId(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
          <Input
            id="filterDate"
            label="Filter by Date"
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          <div className="col-span-1">
            <Button onClick={openMarkAttendanceModal} className="w-full">
              <i className="fas fa-clipboard-check mr-2"></i> Mark Attendance for Selected
            </Button>
          </div>
        </div>
        <Button onClick={() => adminService.exportAttendanceReport().then(res => {
          if (res.success && res.data) {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `attendance_report_${filterDate}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
          } else {
            setError(res.message || 'Failed to export attendance report.');
          }
        })} variant="outline" className="w-full mt-4 md:mt-0">
          <i className="fas fa-file-excel mr-2"></i> Export Report
        </Button>
      </Card>


      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Attendance Records</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceRecords.length > 0 ? (
                attendanceRecords.map(record => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getStudentName(record.user_id)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{getCourseTitle(record.course_id)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {/*
                      <Button onClick={() => handleEditAttendance(record)} variant="secondary" size="sm">
                        Edit
                      </Button>
                      */}
                      <select
                        value={record.status}
                        onChange={async (e) => {
                            setLoading(true);
                            const res = await adminService.updateAttendance(record.id, { status: e.target.value as AttendanceStatus });
                            if (res.success) {
                                setMessage("Attendance updated.");
                                fetchAttendanceRecords(Number(filterCourseId), filterDate);
                            } else {
                                setError(res.message || "Failed to update attendance.");
                            }
                            setLoading(false);
                        }}
                        className="px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        {Object.values(AttendanceStatus).map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No attendance records found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isMarkAttendanceModalOpen} onClose={() => setIsMarkAttendanceModalOpen(false)} title="Mark Attendance">
        <form onSubmit={handleMarkAttendanceSubmit}>
          <div className="mb-4">
            <label htmlFor="markCourse" className="block text-sm font-medium text-gray-700 mb-1">
              Course
            </label>
            <select
              id="markCourse"
              value={attendanceFormData.course_id}
              onChange={(e) => setAttendanceFormData(prev => ({ ...prev, course_id: parseInt(e.target.value) }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
              disabled={!!filterCourseId}
            >
              <option value="">Select Course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
          <Input
            id="markDate"
            label="Date"
            type="date"
            value={attendanceFormData.date}
            onChange={(e) => setAttendanceFormData(prev => ({ ...prev, date: e.target.value }))}
            required
            disabled={!!filterDate}
          />

          <h3 className="text-lg font-bold text-gray-800 mt-6 mb-4">Student List</h3>
          <div className="max-h-60 overflow-y-auto border rounded-md p-3">
            {students.length > 0 ? (
              students.map(student => (
                <div key={student.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <span className="text-gray-900 font-medium">{student.name}</span>
                  <select
                    value={attendanceFormData.studentAttendances.find(sa => sa.user_id === student.id)?.status || AttendanceStatus.PRESENT}
                    onChange={(e) => handleAttendanceFormChange(student.id, e.target.value as AttendanceStatus)}
                    className="px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    {Object.values(AttendanceStatus).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No students to mark attendance for.</p>
            )}
          </div>
          <Button type="submit" className="w-full mt-6" loading={loading} disabled={loading}>
            Save Attendance
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminAttendancePage;
