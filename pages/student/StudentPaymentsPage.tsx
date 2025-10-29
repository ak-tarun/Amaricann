
import React, { useEffect, useState } from 'react';
import * as paymentService from '../../services/paymentService';
import * as settingsService from '../../services/settingsService';
import * as courseService from '../../services/courseService';
import { Payment, PaymentMethod, PaymentStatus, Course, Setting } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import Input from '../../components/Input';
import FileUploadInput from '../../components/FileUploadInput';
import { SETTING_KEYS, UPI_QR_PLACEHOLDER } from '../../constants';
import Modal from '../../components/Modal';

const StudentPaymentsPage: React.FC = () => {
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [upiSettings, setUpiSettings] = useState<{ id: string; qrCodeUrl: string }>({ id: 'UPI_ID_PLACEHOLDER', qrCodeUrl: UPI_QR_PLACEHOLDER });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [upiTxnId, setUpiTxnId] = useState('');
  const [upiScreenshot, setUpiScreenshot] = useState<File | null>(null);
  const [upiPaymentAmount, setUpiPaymentAmount] = useState<number | ''>('');


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const [paymentsRes, coursesRes, settingsRes] = await Promise.all([
        paymentService.getStudentPaymentHistory(),
        courseService.getStudentEnrollments(), // or getAllCourses() if payment for any course is possible
        settingsService.getSettings(),
      ]);

      if (paymentsRes.success && paymentsRes.data) {
        setPaymentHistory(paymentsRes.data);
      } else {
        setError(paymentsRes.message || 'Failed to fetch payment history.');
      }

      if (coursesRes.success && coursesRes.data) {
        setCourses(coursesRes.data);
      } else {
        console.error(coursesRes.message || 'Failed to fetch courses.');
      }

      if (settingsRes.success && settingsRes.data) {
        const upiId = settingsRes.data.find((s: Setting) => s.key === SETTING_KEYS.UPI_ID)?.value;
        const upiQr = settingsRes.data.find((s: Setting) => s.key === SETTING_KEYS.UPI_QR_CODE_URL)?.value;
        if (upiId) setUpiSettings(prev => ({ ...prev, id: upiId }));
        if (upiQr) setUpiSettings(prev => ({ ...prev, qrCodeUrl: upiQr }));
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleUpiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!selectedCourseId || !upiTxnId || !upiScreenshot || upiPaymentAmount === '') {
      setError('Please fill all fields and upload a screenshot.');
      return;
    }

    setLoading(true);
    const response = await paymentService.submitManualUpiPayment(selectedCourseId, Number(upiPaymentAmount), upiTxnId, upiScreenshot);
    if (response.success) {
      setMessage('UPI payment submitted successfully for verification!');
      setIsUpiModalOpen(false);
      setUpiTxnId('');
      setUpiScreenshot(null);
      setUpiPaymentAmount('');
      // Refresh history
      const refreshRes = await paymentService.getStudentPaymentHistory();
      if (refreshRes.success && refreshRes.data) {
        setPaymentHistory(refreshRes.data);
      }
    } else {
      setError(response.message || 'Failed to submit UPI payment.');
    }
    setLoading(false);
  };

  const handleGatewayPayment = (courseId: number, amount: number) => {
    setMessage(null);
    setError(null);
    // In a real application, this would redirect to a payment gateway
    // or initiate a payment process via a backend endpoint.
    // Example: window.location.href = `/api/payments/gateway-redirect?course_id=${courseId}&amount=${amount}`;
    alert(`Initiating payment gateway for Course ID: ${courseId}, Amount: ₹${amount}. (This is a placeholder)`);
    setMessage('Redirecting to payment gateway (simulated)...');
  };

  const openUpiModal = (courseId: number, courseFee: number) => {
    setSelectedCourseId(courseId);
    setUpiPaymentAmount(courseFee);
    setIsUpiModalOpen(true);
    setError(null);
    setMessage(null);
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-6 min-h-screen-minus-nav-footer">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">My Payments</h1>

      {message && <Alert type="success" message={message} onClose={() => setMessage(null)} className="mb-4" />}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-4" />}

      {/* Pending Payments / Courses to Pay For */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Pending Payments</h2>
      <Card className="mb-8 p-4">
        {courses.length === 0 ? (
          <p className="text-gray-600">No courses available for payment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map(course => (
              <div key={course.id} className="border p-4 rounded-md shadow-sm bg-gray-50 flex flex-col sm:flex-row items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                  <p className="text-gray-700">Fee: ₹{course.fee}</p>
                </div>
                <div className="flex space-x-2 mt-3 sm:mt-0">
                  <Button onClick={() => openUpiModal(course.id, course.fee)} size="sm">
                    Pay with UPI
                  </Button>
                  <Button onClick={() => handleGatewayPayment(course.id, course.fee)} variant="secondary" size="sm">
                    Pay with Gateway
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Payment History */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Payment History</h2>
      <Card>
        {paymentHistory.length === 0 ? (
          <p className="text-gray-600">No payment records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentHistory.map(payment => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {courses.find(c => c.id === payment.course_id)?.title || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">₹{payment.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{payment.method.toUpperCase()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{payment.txn_id || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${payment.status === PaymentStatus.COMPLETED || payment.status === PaymentStatus.VERIFIED ? 'bg-green-100 text-green-800' :
                        payment.status === PaymentStatus.PENDING ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`
                      }>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(payment.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* UPI Payment Modal */}
      <Modal isOpen={isUpiModalOpen} onClose={() => setIsUpiModalOpen(false)} title="Complete UPI Payment">
        <p className="mb-4 text-gray-700">
          To pay for {courses.find(c => c.id === selectedCourseId)?.title || 'Selected Course'} (₹{upiPaymentAmount}),
          please scan the QR code or use the UPI ID below. After payment, upload the screenshot and transaction ID.
        </p>
        <div className="flex flex-col items-center mb-6">
          <img src={upiSettings.qrCodeUrl} alt="UPI QR Code" className="w-48 h-48 mb-4 border rounded-lg" />
          <p className="text-lg font-semibold text-gray-900">UPI ID: {upiSettings.id}</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-4" />}

        <form onSubmit={handleUpiSubmit}>
          <Input
            id="upiPaymentAmount"
            label="Amount Paid"
            type="number"
            value={upiPaymentAmount}
            onChange={(e) => setUpiPaymentAmount(Number(e.target.value))}
            required
            disabled // Amount typically set by course fee
          />
          <Input
            id="upiTxnId"
            label="UPI Transaction ID"
            type="text"
            value={upiTxnId}
            onChange={(e) => setUpiTxnId(e.target.value)}
            placeholder="e.g., T240325123456789"
            required
          />
          <FileUploadInput
            id="upiScreenshot"
            label="Upload Payment Screenshot"
            accept="image/*"
            onFileChange={setUpiScreenshot}
            error={error?.includes('screenshot') ? error : undefined}
          />
          <Button type="submit" className="w-full mt-4" loading={loading} disabled={loading}>
            Submit UPI Payment Proof
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default StudentPaymentsPage;
