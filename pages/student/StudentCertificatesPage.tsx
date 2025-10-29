
import React, { useEffect, useState } from 'react';
import * as studentService from '../../services/studentService';
import * as courseService from '../../services/courseService';
import { Certificate, Course } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import Button from '../../components/Button';

const StudentCertificatesPage: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      setLoading(true);
      setError(null);

      const [certsRes, coursesRes] = await Promise.all([
        studentService.getStudentCertificates(),
        courseService.getAllCourses(), // Needed to map course IDs to titles
      ]);

      if (certsRes.success && certsRes.data) {
        setCertificates(certsRes.data);
      } else {
        setError(certsRes.message || 'Failed to fetch certificates.');
      }

      if (coursesRes.success && coursesRes.data) {
        setCourses(coursesRes.data);
      } else {
        console.error(coursesRes.message || 'Failed to fetch courses for certificate mapping.');
      }

      setLoading(false);
    };

    fetchCertificates();
  }, []);

  const getCourseTitle = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : 'N/A';
  };

  const handleDownloadCertificate = (pdfUrl: string, certNo: string) => {
    // In a real app, you might fetch the PDF from the URL.
    // For now, simulate opening it or a download.
    window.open(pdfUrl, '_blank');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="container mx-auto p-6 min-h-screen-minus-nav-footer"><Alert type="error" message={error} /></div>;
  }

  return (
    <div className="container mx-auto p-6 min-h-screen-minus-nav-footer">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">My Certificates</h1>

      {certificates.length === 0 && !error ? (
        <p className="text-center text-gray-600 text-lg">No certificates available yet. Complete a course to earn one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map(cert => (
            <Card key={cert.id} className="flex flex-col">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{getCourseTitle(cert.course_id)}</h2>
              <p className="text-gray-700 text-sm mb-2">Certificate No: <span className="font-semibold">{cert.cert_no}</span></p>
              <p className="text-gray-700 text-sm mb-4">Issued On: {new Date(cert.issued_at).toLocaleDateString()}</p>
              <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                <Button onClick={() => handleDownloadCertificate(cert.pdf_url, cert.cert_no)} size="sm">
                  <i className="fas fa-download mr-2"></i>Download PDF
                </Button>
                {/* Placeholder for QR verification link */}
                <a
                  href={`/certificate-verify/${cert.cert_no}`} // Example QR verification URL
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Verify <i className="fas fa-qrcode ml-1"></i>
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCertificatesPage;
