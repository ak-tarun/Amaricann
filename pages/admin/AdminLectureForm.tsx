import React, { useState, useEffect } from 'react';
import { Lecture, Course } from '../../types';
import Input from '../../components/Input';
import Button from '../../components/Button';

interface AdminLectureFormProps {
  lecture?: Lecture | null;
  courses: Course[];
  onSubmit: (data: Omit<Lecture, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  loading: boolean;
}

const AdminLectureForm: React.FC<AdminLectureFormProps> = ({ lecture, courses, onSubmit, onCancel, loading }) => {
  const [courseId, setCourseId] = useState<number | ''>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (lecture) {
      setCourseId(lecture.course_id);
      setTitle(lecture.title);
      setDescription(lecture.description || '');
      setVideoUrl(lecture.video_url);
      setDuration(lecture.duration || '');
      setIsPreview(lecture.is_preview);
    } else {
      setCourseId('');
      setTitle('');
      setDescription('');
      setVideoUrl('');
      setDuration('');
      setIsPreview(false);
    }
  }, [lecture]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) {
      alert('Please select a course.');
      return;
    }
    onSubmit({
      course_id: Number(courseId),
      title,
      description: description || undefined,
      video_url: videoUrl,
      duration: duration || undefined,
      is_preview: isPreview,
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

      <Input
        id="title"
        label="Lecture Title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        disabled={loading}
      />
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description (Optional)
        </label>
        <textarea
          id="description"
          rows={3}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        ></textarea>
      </div>
      <Input
        id="videoUrl"
        label="Video URL (YouTube, Vimeo, etc.)"
        type="url"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        required
        disabled={loading}
      />
      <Input
        id="duration"
        label="Duration (e.g., 30 min, 1 hour)"
        type="text"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        disabled={loading}
      />
      <div className="flex items-center">
        <input
          id="isPreview"
          type="checkbox"
          checked={isPreview}
          onChange={(e) => setIsPreview(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          disabled={loading}
        />
        <label htmlFor="isPreview" className="ml-2 block text-sm text-gray-900">
          Is Preview Lecture
        </label>
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading} disabled={loading}>
          {lecture ? 'Update Lecture' : 'Add Lecture'}
        </Button>
      </div>
    </form>
  );
};

export default AdminLectureForm;