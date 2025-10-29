
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Fix: Import Link from react-router-dom
import { Link } from 'react-router-dom';
import { Course, Lecture } from '../../types';
import * as courseService from '../../services/courseService';
import { useAuth } from '../../components/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Alert from '../../components/Alert';

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState<'not_enrolled' | 'enrolled' | 'paid'>('not_enrolled'); // Simplified for frontend

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      setError(null);
      if (!id) {
        setError("Course ID is missing.");
        setLoading(false);
        return;
      }
      const courseId = parseInt(id);

      const courseResponse = await courseService.getCourseById(courseId);
      if (courseResponse.success && courseResponse.data) {
        setCourse(courseResponse.data);
      } else {
        setError(courseResponse.message || 'Failed to fetch course details.');
        setLoading(false);
        return;
      }

      const lecturesResponse = await courseService.getCourseLectures(courseId);
      if (lecturesResponse.success && lecturesResponse.data) {
        setLectures(lecturesResponse.data);
      } else {
        setError(lecturesResponse.message || 'Failed to fetch lectures.');
      }

      // Simulate enrollment status
      if (isAuthenticated && user?.role === 'student') {
        const enrollmentsResponse = await courseService.getStudentEnrollments();
        if (enrollmentsResponse.success && enrollmentsResponse.data) {
          const isEnrolled = enrollmentsResponse.data.some(c => c.id === courseId);
          // Further check for payment if needed
          if (isEnrolled) {
            setEnrollmentStatus('enrolled'); // Assuming enrolled means paid for simplicity here
          }
        }
      }

      setLoading(false);
    };

    fetchCourseDetails();
  }, [id, isAuthenticated, user]); // eslint-disable-next-line react-hooks/exhaustive-deps

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!course || user?.role !== 'student') return;

    // In a real app, this would initiate a payment flow.
    // For now, we simulate direct enrollment for simplicity.
    const response = await courseService.enrollInCourse(course.id);
    if (response.success) {
      alert('Enrollment initiated! Please proceed to payment.');
      setEnrollmentStatus('enrolled'); // Or 'pending_payment'
      navigate('/student/payments'); // Redirect to student payment page
    } else {
      setError(response.message || 'Failed to enroll in course.');
    }
  };


  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="container mx-auto p-6 min-h-screen-minus-nav-footer"><Alert type="error" message={error} /></div>;
  }

  if (!course) {
    return <div className="container mx-auto p-6 min-h-screen-minus-nav-footer"><Alert type="info" message="Course not found." /></div>;
  }

  const previewLectures = lectures.filter(lecture => lecture.is_preview);
  const hasPreview = previewLectures.length > 0;

  return (
    <div className="container mx-auto p-6 min-h-screen-minus-nav-footer">
      <Card className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              src={course.image || `https://picsum.photos/600/400?random=${course.id}`}
              alt={course.title}
              className="w-full h-64 object-cover rounded-lg shadow-md mb-4"
            />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
            <p className="text-xl text-blue-600 font-semibold mb-4">Fee: ₹{course.fee}</p>
            <p className="text-gray-700 text-lg mb-4">{course.description}</p>
            <p className="text-gray-600 text-md mb-2"><strong>Duration:</strong> {course.duration}</p>
            <p className="text-gray-600 text-md mb-4"><strong>Teacher:</strong> John Doe (Placeholder)</p>

            {isAuthenticated && user?.role === 'student' && enrollmentStatus === 'enrolled' ? (
              <Button disabled className="w-full bg-green-500 hover:bg-green-600">
                Enrolled & Paid <i className="fas fa-check ml-2"></i>
              </Button>
            ) : (
              <Button onClick={handleEnroll} className="w-full" disabled={user?.role !== 'student' && isAuthenticated}>
                {user?.role !== 'student' && isAuthenticated ? 'Only students can enroll' : 'Enroll Now'}
              </Button>
            )}
            {!isAuthenticated && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                <Link to="/login" className="text-blue-600 hover:underline">Login</Link> or <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link> to enroll.
              </p>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Syllabus</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Module 1: Introduction to Programming</li>
              <li>Module 2: Data Structures & Algorithms</li>
              <li>Module 3: Web Development Fundamentals</li>
              <li>Module 4: Advanced Topics & Projects</li>
              {/* More detailed syllabus items would come from API */}
            </ul>

            {hasPreview && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Preview Lectures</h2>
                {previewLectures.map(lecture => (
                  <div key={lecture.id} className="mb-4 bg-gray-50 p-4 rounded-md shadow-sm">
                    <h3 className="text-xl font-semibold mb-2">{lecture.title}</h3>
                    <p className="text-gray-700 text-sm mb-2">{lecture.description}</p>
                    <div className="relative w-full aspect-video rounded-md overflow-hidden">
                      <iframe
                        src={lecture.video_url.replace("watch?v=", "embed/")}
                        title={lecture.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute top-0 left-0 w-full h-full"
                      ></iframe>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CourseDetailPage;
