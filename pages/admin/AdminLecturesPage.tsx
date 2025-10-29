
import React, { useEffect, useState } from 'react';
import * as courseService from '../../services/courseService';
import { Lecture, Course } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import AdminLectureForm from './AdminLectureForm';

const AdminLecturesPage: React.FC = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [courses, setCourses] = useState<Course[]>([]); // To map course IDs to names
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);

  useEffect(() => {
    fetchLecturesAndCourses();
  }, []);

  const fetchLecturesAndCourses = async () => {
    setLoading(true);
    setError(null);

    const [coursesRes, lecturesRes] = await Promise.all([
      courseService.getAllCourses(),
      // Assuming an API endpoint to get all lectures, or fetch by course
      // For now, we'll fetch all courses and then their lectures if needed,
      // or simulate a flat list of lectures for all courses.
      // A more robust backend would have `/admin/lectures` endpoint.
      // Mocking for now.
      Promise.resolve({ success: true, data: [] as Lecture[] }), // Replace with actual API call
    ]);

    if (coursesRes.success && coursesRes.data) {
      setCourses(coursesRes.data);
      // If no direct 'getAllLectures' endpoint, loop through courses and fetch.
      // This can be heavy, a dedicated `/admin/lectures` is better.
      const allLectures: Lecture[] = [];
      for (const course of coursesRes.data) {
        const courseLecturesRes = await courseService.getCourseLectures(course.id);
        if (courseLecturesRes.success && courseLecturesRes.data) {
            allLectures.push(...courseLecturesRes.data.map(l => ({...l, course_id: course.id})));
        }
      }
      setLectures(allLectures);

    } else {
      setError(coursesRes.message || 'Failed to fetch courses.');
    }

    setLoading(false);
  };

  const getCourseTitle = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : 'N/A';
  };

  const openAddModal = () => {
    setCurrentLecture(null);
    setIsModalOpen(true);
  };

  const openEditModal = (lecture: Lecture) => {
    setCurrentLecture(lecture);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: Lecture) => {
    setLoading(true);
    setMessage(null);
    setError(null);

    let response;
    if (currentLecture) {
      response = await courseService.updateLecture(currentLecture.id, data);
    } else {
      response = await courseService.createLecture(data);
    }

    if (response?.success) {
      setMessage(response.message || `Lecture ${currentLecture ? 'updated' : 'added'} successfully.`);
      setIsModalOpen(false);
      fetchLecturesAndCourses();
    } else {
      setError(response?.message || `Failed to ${currentLecture ? 'update' : 'add'} lecture.`);
    }
    setLoading(false);
  };

  const handleDelete = async (lectureId: number) => {
    if (!window.confirm('Are you sure you want to delete this lecture?')) return;
    setLoading(true);
    setMessage(null);
    setError(null);
    const response = await courseService.deleteLecture(lectureId);
    if (response.success) {
      setMessage(response.message || 'Lecture deleted successfully.');
      fetchLecturesAndCourses();
    } else {
      setError(response.message || 'Failed to delete lecture.');
    }
    setLoading(false);
  };

  if (loading && !lectures.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-6 min-h-screen-minus-nav-footer">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Lecture Management</h1>

      {message && <Alert type="success" message={message} onClose={() => setMessage(null)} className="mb-4" />}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-4" />}

      <div className="flex justify-end mb-6">
        <Button onClick={openAddModal}>
          <i className="fas fa-plus mr-2"></i>Add New Lecture
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Video URL
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preview
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lectures.length > 0 ? (
                lectures.map(lecture => (
                  <tr key={lecture.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getCourseTitle(lecture.course_id)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{lecture.title}</td>
                    <td className="px-6 py-4 text-sm text-blue-600 hover:underline">
                      <a href={lecture.video_url} target="_blank" rel="noopener noreferrer" className="truncate w-48 block">
                        {lecture.video_url}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{lecture.duration || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {lecture.is_preview ? <i className="fas fa-check-circle text-green-500"></i> : <i className="fas fa-times-circle text-red-500"></i>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button onClick={() => openEditModal(lecture)} variant="secondary" size="sm">
                          Edit
                        </Button>
                        <Button onClick={() => handleDelete(lecture.id)} variant="destructive" size="sm">
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No lectures found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentLecture ? 'Edit Lecture' : 'Add New Lecture'}>
        <AdminLectureForm
          lecture={currentLecture}
          courses={courses}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default AdminLecturesPage;
