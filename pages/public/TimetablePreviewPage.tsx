
import React, { useEffect, useState } from 'react';
import * as adminService from '../../services/adminService';
import { TimetableEntry, Course } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import * as courseService from '../../services/courseService';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TimetablePreviewPage: React.FC = () => {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
        // If course fetching fails, it's not critical for timetable display, but log error
        console.error(coursesRes.message || 'Failed to fetch courses for timetable mapping.');
      }

      setLoading(false);
    };

    fetchTimetableAndCourses();
  }, []);

  const getCourseTitle = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : 'Unknown Course';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="container mx-auto p-6 min-h-screen-minus-nav-footer"><Alert type="error" message={error} /></div>;
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
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Class Timetable</h1>
      <p className="text-center text-lg text-gray-700 mb-10">
        Check out our weekly class schedule. For personalized timetables, please log in to your student dashboard.
      </p>

      {timetable.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No timetable entries available at the moment.</p>
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
    </div>
  );
};

export default TimetablePreviewPage;
