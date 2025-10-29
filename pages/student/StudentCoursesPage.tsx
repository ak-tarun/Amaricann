
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../../types';
import * as courseService from '../../services/courseService';
import LoadingSpinner from '../../components/LoadingSpinner';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import Button from '../../components/Button';

const StudentCoursesPage: React.FC = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      setLoading(true);
      setError(null);
      const response = await courseService.getStudentEnrollments();
      if (response.success && response.data) {
        setEnrolledCourses(response.data);
      } else {
        setError(response.message || 'Failed to fetch enrolled courses.');
      }
      setLoading(false);
    };

    fetchEnrolledCourses();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-6 min-h-screen-minus-nav-footer">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">My Enrolled Courses</h1>

      {error && <Alert type="error" message={error} className="mb-4" />}

      {enrolledCourses.length === 0 && !error ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <p className="text-gray-600 text-lg mb-4">You are not enrolled in any courses yet.</p>
          <Link to="/courses">
            <Button>Browse All Courses</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map(course => (
            <Card key={course.id} className="flex flex-col transform transition duration-300 hover:scale-105 hover:shadow-xl">
              <img
                src={course.image || `https://picsum.photos/400/250?random=${course.id}`}
                alt={course.title}
                className="w-full h-40 object-cover rounded-t-lg mb-4"
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h2>
              <p className="text-gray-700 text-sm mb-4 line-clamp-3 flex-grow">{course.description}</p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <span className="text-blue-600 font-semibold text-lg">Fee: ₹{course.fee}</span>
                <span className="text-gray-500 text-sm">Duration: {course.duration}</span>
              </div>
              <Link to={`/student/courses/${course.id}/lectures`} className="mt-4 block w-full">
                <Button className="w-full">View Lectures</Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCoursesPage;
