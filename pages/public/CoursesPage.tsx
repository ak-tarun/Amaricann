
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../../types';
import * as courseService from '../../services/courseService';
import LoadingSpinner from '../../components/LoadingSpinner';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
// Fix: Import Button component
import Button from '../../components/Button';

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    fetchCourses();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-6 min-h-screen-minus-nav-footer">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Courses</h1>

      {error && <Alert type="error" message={error} className="mb-4" />}

      {courses.length === 0 && !error ? (
        <p className="text-center text-gray-600 text-lg">No courses available at the moment. Please check back later!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map(course => (
            <Card key={course.id} className="transform transition duration-300 hover:scale-105 hover:shadow-xl flex flex-col">
              <img
                src={course.image || `https://picsum.photos/400/250?random=${course.id}`}
                alt={course.title}
                className="w-full h-48 object-cover rounded-t-lg mb-4"
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h2>
              <p className="text-gray-700 text-sm mb-4 line-clamp-3 flex-grow">{course.description}</p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <span className="text-blue-600 font-semibold text-lg">₹{course.fee}</span>
                <span className="text-gray-500 text-sm">{course.duration}</span>
              </div>
              <Link to={`/courses/${course.id}`} className="mt-4 block w-full">
                <Button className="w-full">View Details</Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
