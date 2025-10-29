
import React, { useEffect, useState } from 'react';
import * as courseService from '../../services/courseService';
import { Course } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import AdminCourseForm from './AdminCourseForm';

const AdminCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    const response = await courseService.getAllCourses();
    if (response.success && response.data) {
      setCourses(response.data);
    } else {
      setError(response.message || 'Failed to fetch courses.');
    }
    setLoading(false);
  };

  const openAddModal = () => {
    setCurrentCourse(null);
    setIsModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setCurrentCourse(course);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData: FormData) => {
    setLoading(true);
    setMessage(null);
    setError(null);

    let response;
    if (currentCourse) {
      response = await courseService.updateCourse(currentCourse.id, formData);
    } else {
      response = await courseService.createCourse(formData);
    }

    if (response?.success) {
      setMessage(response.message || `Course ${currentCourse ? 'updated' : 'added'} successfully.`);
      setIsModalOpen(false);
      fetchCourses();
    } else {
      setError(response?.message || `Failed to ${currentCourse ? 'update' : 'add'} course.`);
    }
    setLoading(false);
  };

  const handleDelete = async (courseId: number) => {
    if (!window.confirm('Are you sure you want to delete this course and its associated lectures/enrollments?')) return;
    setLoading(true);
    setMessage(null);
    setError(null);
    const response = await courseService.deleteCourse(courseId);
    if (response.success) {
      setMessage(response.message || 'Course deleted successfully.');
      fetchCourses();
    } else {
      setError(response.message || 'Failed to delete course.');
    }
    setLoading(false);
  };

  if (loading && !courses.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-6 min-h-screen-minus-nav-footer">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Course Management</h1>

      {message && <Alert type="success" message={message} onClose={() => setMessage(null)} className="mb-4" />}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-4" />}

      <div className="flex justify-end mb-6">
        <Button onClick={openAddModal}>
          <i className="fas fa-plus mr-2"></i>Add New Course
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.length > 0 ? (
                courses.map(course => (
                  <tr key={course.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <img src={course.image || `https://picsum.photos/50/50?random=${course.id}`} alt={course.title} className="w-10 h-10 rounded-full object-cover" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">₹{course.fee}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{course.duration}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button onClick={() => openEditModal(course)} variant="secondary" size="sm">
                          Edit
                        </Button>
                        <Button onClick={() => handleDelete(course.id)} variant="destructive" size="sm">
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No courses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentCourse ? 'Edit Course' : 'Add New Course'}>
        <AdminCourseForm
          course={currentCourse}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default AdminCoursesPage;
