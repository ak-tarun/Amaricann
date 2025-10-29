import React, { useState, useEffect } from 'react';
import { TimetableEntry, Course } from '../../types';
import Input from '../../components/Input';
import Button from '../../components/Button';

interface AdminTimetableFormProps {
  entry?: TimetableEntry | null;
  courses: Course[];
  onSubmit: (data: Omit<TimetableEntry, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  loading: boolean;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const AdminTimetableForm: React.FC<AdminTimetableFormProps> = ({ entry, courses, onSubmit, onCancel, loading }) => {
  const [courseId, setCourseId] = useState<number | ''>('');
  const [dayOfWeek, setDayOfWeek] = useState(daysOfWeek[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  useEffect(() => {
    if (entry) {
      setCourseId(entry.course_id);
      setDayOfWeek(entry.day_of_week);
      setStartTime(entry.start_time);
      setEndTime(entry.end_time);
    } else {
      setCourseId('');
      setDayOfWeek(daysOfWeek[0]);
      setStartTime('09:00');
      setEndTime('10:00');
    }
  }, [entry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) {
      alert('Please select a course.');
      return;
    }
    onSubmit({
      course_id: Number(courseId),
      day_of_week: dayOfWeek,
      start_time: startTime,
      end_time: endTime,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="courseSelect" className="block text-sm font-medium text-gray-700 mb-1">
          Select Course
        </label>
        <select
          id="courseSelect"
          value={courseId}
          onChange={(e) => setCourseId(Number(e.target.value))}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
          disabled={loading}
        >
          <option value="">-- Select a Course --</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700 mb-1">
          Day of Week
        </label>
        <select
          id="dayOfWeek"
          value={dayOfWeek}
          onChange={(e) => setDayOfWeek(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
          disabled={loading}
        >
          {daysOfWeek.map(day => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>

      <Input
        id="startTime"
        label="Start Time"
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        required
        disabled={loading}
      />
      <Input
        id="endTime"
        label="End Time"
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        required
        disabled={loading}
      />

      <div className="flex justify-end space-x-2 mt-6">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading} disabled={loading}>
          {entry ? 'Update Entry' : 'Add Entry'}
        </Button>
      </div>
    </form>
  );
};

export default AdminTimetableForm;