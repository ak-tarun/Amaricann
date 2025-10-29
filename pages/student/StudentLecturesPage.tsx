
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as courseService from '../../services/courseService';
import { Course, Lecture } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import Button from '../../components/Button';

const StudentLecturesPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(true); // Simulate, in real app check actual payment status

  useEffect(() => {
    const fetchLectures = async () => {
      setLoading(true);
      setError(null);
      if (!courseId) {
        setError("Course ID is missing.");
        setLoading(false);
        return;
      }
      const id = parseInt(courseId);

      const courseRes = await courseService.getCourseById(id);
      if (courseRes.success && courseRes.data) {
        setCourse(courseRes.data);
      } else {
        setError(courseRes.message || 'Failed to fetch course details.');
        setLoading(false);
        return;
      }

      const lecturesRes = await courseService.getCourseLectures(id);
      if (lecturesRes.success && lecturesRes.data) {
        setLectures(lecturesRes.data);
      } else {
        setError(lecturesRes.message || 'Failed to fetch lectures.');
      }

      // Simulate payment verification:
      // In a real app, you would query backend if student has paid for this course.
      // For now, assume if they are viewing this page, they've passed an initial check or payment is pending.
      // For demonstration, let's assume it's always paid if they get here.
      // If not paid, set `setIsPaid(false);`
      setIsPaid(true);

      setLoading(false);
    };

    fetchLectures();
  }, [courseId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="container mx-auto p-6 min-h-screen-minus-nav-footer"><Alert type="error" message={error} /></div>;
  }

  if (!course) {
    return <div className="container mx-auto p-6 min-h-screen-minus-nav-footer"><Alert type="info" message="Course not found." /></div>;
  }

  return (
    <div className="container mx-auto p-6 min-h-screen-minus-nav-footer">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">{course.title} - Lectures</h1>

      {!isPaid ? (
        <Alert type="warning" message="Lectures are locked. Please complete your payment to access." className="mb-6" />
      ) : lectures.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No lectures available for this course yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lectures.map(lecture => (
            <Card key={lecture.id} className="flex flex-col">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{lecture.title}</h2>
              <p className="text-gray-700 text-sm mb-3">{lecture.description}</p>
              <div className="relative w-full aspect-video rounded-md overflow-hidden bg-gray-200">
                {isPaid ? (
                  <iframe
                    src={lecture.video_url.replace("watch?v=", "embed/")}
                    title={lecture.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                  ></iframe>
                ) : (
                  <div className="flex items-center justify-center h-full w-full text-gray-500">
                    <i className="fas fa-lock text-3xl mr-2"></i>
                    Video Locked
                  </div>
                )}
              </div>
              <p className="text-gray-500 text-sm mt-3">{lecture.duration}</p>
              {lecture.is_preview && <span className="mt-2 text-xs font-semibold text-blue-600">Preview Available</span>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentLecturesPage;
