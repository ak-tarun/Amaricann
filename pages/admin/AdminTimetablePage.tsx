
import React, { useEffect, useState } from 'react';
import * as adminService from '../../services/adminService';
import * as courseService from '../../services/courseService';
import { TimetableEntry, Course } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import AdminTimetableForm from './AdminTimetableForm';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const AdminTimetablePage: React.FC = () => {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<TimetableEntry | null>(null);

  useEffect(() => {
    fetchTimetableAndCourses();
  }, []);

  const fetchTimetableAndCourses = async () => {
    setLoading(true);
    setError(null);

    const [timetableRes, coursesRes] = await Promise.all([
      adminService.getTimetable(),
      courseService.getAllCourses(),
    ]);

    if (timetableRes.success && timetableRes.data) {
      setTimetable(timetableRes.data);
    } else {
      setError(timetableRes.message || 'Failed to fetch timetable.');
    }

    if (coursesRes.success && coursesRes.data) {
      setCourses(coursesRes.data);
    } else {
      setError(coursesRes.message || 'Failed to fetch courses for timetable mapping.');
    }

    setLoading(false);
  };

  const getCourseTitle = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : 'Unknown Course';
  };

  const openAddModal = () => {
    setCurrentEntry(null);
    setIsModalOpen(true);
  };

  const openEditModal = (entry: TimetableEntry) => {
    setCurrentEntry(entry);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: Omit<TimetableEntry, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setMessage(null);
    setError(null);

    let response;
    if (currentEntry) {
      response = await adminService.updateTimetableEntry(currentEntry.id, data);
    } else {
      response = await adminService.createTimetableEntry(data);
    }

    if (response?.success) {
      setMessage(response.message || `Timetable entry ${currentEntry ? 'updated' : 'added'} successfully.`);
      setIsModalOpen(false);
      fetchTimetableAndCourses();
    } else {
      setError(response?.message || `Failed to ${currentEntry ? 'update' : 'add'} timetable entry.`);
    }
    setLoading(false);
  };

  const handleDelete = async (entryId: number) => {
    if (!window.confirm('Are you sure you want to delete this timetable entry?')) return;
    setLoading(true);
    setMessage(null);
    setError(null);
    const response = await adminService.deleteTimetableEntry(entryId);
    if (response.success) {
      setMessage(response.message || 'Timetable entry deleted successfully.');
      fetchTimetableAndCourses();
    } else {
      setError(response.message || 'Failed to delete timetable entry.');
    }
    setLoading(false);
  };

  if (loading && (!timetable.length || !courses.length)) {
    return <LoadingSpinner />;
  }

  const sortedTimetable = timetable.sort((a, b) => {
    const dayA = daysOfWeek.indexOf(a.day_of_week);
    const dayB = daysOfWeek.indexOf(b.day_of_week);
    if (dayA !== dayB) return dayA - dayB;
    return a.start_time.localeCompare(b.start_time);
  });

  const timetableByDay: { [key: string]: TimetableEntry[] } = {};
  daysOfWeek.forEach(day => (timetableByDay[day] = []));
  sortedTimetable.forEach(entry => {
    if (timetableByDay[entry.day_of_week]) {
      timetableByDay[entry.day_of_week].push(entry);
    }
  });

  return (
    <div className="container mx-auto p-6 min-h-screen-minus-nav-footer">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Timetable Management</h1>

      {message && <Alert type="success" message={message} onClose={() => setMessage(null)} className="mb-4" />}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-4" />}

      <div className="flex justify-end mb-6">
        <Button onClick={openAddModal}>
          <i className="fas fa-plus mr-2"></i>Add New Entry
        </Button>
      </div>

      {timetable.length === 0 && !loading ? (
        <p className="text-center text-gray-600 text-lg">No timetable entries available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {daysOfWeek.map(day => (
            <Card key={day} className="flex flex-col">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">{day}</h2>
              {timetableByDay[day] && timetableByDay[day].length > 0 ? (
                <ul className="space-y-4">
                  {timetableByDay[day].map(entry => (
                    <li key={entry.id} className="border-b pb-2 last:border-b-0 last:pb-0">
                      <p className="font-semibold text-gray-900 text-lg">{getCourseTitle(entry.course_id)}</p>
                      <p className="text-gray-700 text-sm">
                        {entry.start_time} - {entry.end_time}
                      </p>
                      <div className="flex space-x-2 mt-2">
                        <Button onClick={() => openEditModal(entry)} variant="secondary" size="sm">
                          Edit
                        </Button>
                        <Button onClick={() => handleDelete(entry.id)} variant="destructive" size="sm">
                          Delete
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No classes scheduled.</p>
              )}
            </Card>
          ))}
        </div>
      )}


      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentEntry ? 'Edit Timetable Entry' : 'Add New Timetable Entry'}>
        <AdminTimetableForm
          entry={currentEntry}
          courses={courses}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default AdminTimetablePage;
