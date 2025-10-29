import React, { useState, useEffect } from 'react';
import { Course } from '../../types';
import Input from '../../components/Input';
import Button from '../../components/Button';
import FileUploadInput from '../../components/FileUploadInput';

interface AdminCourseFormProps {
  course?: Course | null;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
  loading: boolean;
}

const AdminCourseForm: React.FC<AdminCourseFormProps> = ({ course, onSubmit, onCancel, loading }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fee, setFee] = useState<number | ''>('');
  const [duration, setDuration] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setDescription(course.description);
      setFee(course.fee);
      setDuration(course.duration);
      setCurrentImageUrl(course.image);
    } else {
      setTitle('');
      setDescription('');
      setFee('');
      setDuration('');
      setImageFile(null);
      setCurrentImageUrl(undefined);
    }
  }, [course]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('fee', String(fee));
    formData.append('duration', duration);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="title"
        label="Course Title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        disabled={loading}
      />
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          disabled={loading}
        ></textarea>
      </div>
      <Input
        id="fee"
        label="Course Fee (₹)"
        type="number"
        value={fee}
        onChange={(e) => setFee(Number(e.target.value))}
        required
        disabled={loading}
        min="0"
      />
      <Input
        id="duration"
        label="Course Duration (e.g., 3 months, 60 hours)"
        type="text"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        required
        disabled={loading}
      />
      <FileUploadInput
        id="courseImage"
        label="Course Cover Image"
        accept="image/*"
        onFileChange={setImageFile}
        currentFileUrl={currentImageUrl}
      />

      <div className="flex justify-end space-x-2 mt-6">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading} disabled={loading}>
          {course ? 'Update Course' : 'Add Course'}
        </Button>
      </div>
    </form>
  );
};

export default AdminCourseForm;