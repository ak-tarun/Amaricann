
import React, { useEffect, useState } from 'react';
import * as adminService from '../../services/adminService';
import * as courseService from '../../services/courseService';
import { Certificate, User, Course } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';

const AdminCertificatesPage: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | ''>('');
  const [selectedCourseId, setSelectedCourseId] = useState<number | ''>('');

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const [certsRes, studentsRes, coursesRes] = await Promise.all([
      adminService.getCertificates(),
      adminService.getAllStudents(),
      courseService.getAllCourses(),
    ]);

    if (certsRes.success && certsRes.data) {
      setCertificates(certsRes.data);
    } else {
      setError(certsRes.message || 'Failed to fetch certificates.');
    }

    if (studentsRes.success && studentsRes.data) {
      setStudents(studentsRes.data.filter(u => u.role === 'student'));
    } else {
      setError(studentsRes.message || 'Failed to fetch students.');
    }

    if (coursesRes.success && coursesRes.data) {
      setCourses(coursesRes.data);
    } else {
      setError(coursesRes.message || 'Failed to fetch courses.');
    }

    setLoading(false);
  };

  const getStudentName = (userId: number) => {
    const student = students.find(s => s.id === userId);
    return student ? student.name : 'N/A';
  };

  const getCourseTitle = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : 'N/A';
  };

  const handleGenerateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    if (!selectedStudentId || !selectedCourseId) {
      setError('Please select a student and a course.');
      return;
    }

    setLoading(true);
    const response = await adminService.generateCertificate(Number(selectedStudentId), Number(selectedCourseId));
    if (response.success) {
      setMessage(response.message || 'Certificate generated successfully!');
      setIsModalOpen(false);
      setSelectedStudentId('');
      setSelectedCourseId('');
      fetchData(); // Refresh list
    } else {
      setError(response.message || 'Failed to generate certificate.');
    }
    setLoading(false);
  };

  const handleDownloadCertificate = (pdfUrl: string, certNo: string) => {
    // In a real app, you might fetch the PDF from the URL.
    // For now, simulate opening it or a download.
    window.open(pdfUrl, '_blank');
  };

  if (loading && (!certificates.length || !students.length || !courses.length)) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-6 min-h-screen-minus-nav-footer">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Certificate Management</h1>

      {message && <Alert type="success" message={message} onClose={() => setMessage(null)} className="mb-4" />}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-4" />}

      <div className="flex justify-end mb-6">
        <Button onClick={() => setIsModalOpen(true)}>
          <i className="fas fa-plus mr-2"></i>Generate New Certificate
        </Button>
      </div>

      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Issued Certificates</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Certificate No.
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issued On
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {certificates.length > 0 ? (
                certificates.map(cert => (
                  <tr key={cert.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getStudentName(cert.user_id)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{getCourseTitle(cert.course_id)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cert.cert_no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(cert.issued_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button onClick={() => handleDownloadCertificate(cert.pdf_url, cert.cert_no)} variant="secondary" size="sm">
                          <i className="fas fa-download mr-2"></i>Download
                        </Button>
                        <a
                          href={`/certificate-verify/${cert.cert_no}`} // Example QR verification URL
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-50 text-blue-700 hover:bg-blue-100 focus:ring-blue-500"
                        >
                          Verify QR
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No certificates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Generate New Certificate">
        <form onSubmit={handleGenerateCertificate} className="space-y-4">
          <div>
            <label htmlFor="studentSelect" className="block text-sm font-medium text-gray-700 mb-1">
              Select Student
            </label>
            <select
              id="studentSelect"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(Number(e.target.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
              disabled={loading}
            >
              <option value="">-- Select a Student --</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="courseSelect" className="block text-sm font-medium text-gray-700 mb-1">
              Select Course
            </label>
            <select
              id="courseSelect"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(Number(e.target.value))}
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
          <Button type="submit" className="w-full" loading={loading} disabled={loading}>
            Generate Certificate
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCertificatesPage;
