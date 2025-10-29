
import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import * as settingsService from '../../services/settingsService';
import { SETTING_KEYS, DEFAULT_SOCIAL_LINKS } from '../../constants';
import { SocialLink, Setting, SocialLinkStatus } from '../../types';

const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const [instituteInfo, setInstituteInfo] = useState<{
    email: string;
    phone: string;
    address: string;
  }>({ email: 'info@americanacademybarhi.com', phone: '+91 98765 43210', address: '123 Main St, Barhi, India' });
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);


  useEffect(() => {
    const fetchSettings = async () => {
      const settingsResponse = await settingsService.getSettings();
      if (settingsResponse.success && settingsResponse.data) {
        const settingsMap = new Map<string, string>();
        settingsResponse.data.forEach(s => settingsMap.set(s.key, s.value));

        setInstituteInfo({
          email: settingsMap.get(SETTING_KEYS.INSTITUTE_CONTACT_EMAIL) || instituteInfo.email,
          phone: settingsMap.get(SETTING_KEYS.INSTITUTE_CONTACT_PHONE) || instituteInfo.phone,
          address: settingsMap.get(SETTING_KEYS.INSTITUTE_ADDRESS) || instituteInfo.address,
        });
      }

      const socialResponse = await settingsService.getSocialLinks();
      if (socialResponse.success && socialResponse.data) {
        setSocialLinks(socialResponse.data.filter(link => link.status === SocialLinkStatus.ACTIVE));
      } else {
        setSocialLinks(DEFAULT_SOCIAL_LINKS.filter(link => link.status === SocialLinkStatus.ACTIVE) as SocialLink[]);
      }
    };
    fetchSettings();
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');
    setAlertMessage(null);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      console.log({ name, email, subject, message });
      // Here you would typically send data to a backend endpoint like /api/contact
      const response = { success: true, message: 'Your message has been sent successfully!' };

      if (response.success) {
        setSubmitStatus('success');
        setAlertMessage(response.message);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setSubmitStatus('error');
        setAlertMessage('Failed to send message. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setAlertMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-6 min-h-screen-minus-nav-footer">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Information */}
        <Card className="flex flex-col justify-start">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Get in Touch</h2>
          <p className="text-gray-700 mb-6">
            We'd love to hear from you! Whether you have questions about our courses,
            admissions, or anything else, feel free to reach out.
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex items-center">
              <i className="fas fa-envelope text-blue-600 text-xl mr-3"></i>
              <a href={`mailto:${instituteInfo.email}`} className="text-gray-700 hover:underline">{instituteInfo.email}</a>
            </div>
            <div className="flex items-center">
              <i className="fas fa-phone-alt text-blue-600 text-xl mr-3"></i>
              <a href={`tel:${instituteInfo.phone}`} className="text-gray-700 hover:underline">{instituteInfo.phone}</a>
            </div>
            <div className="flex items-start">
              <i className="fas fa-map-marker-alt text-blue-600 text-xl mr-3 mt-1"></i>
              <p className="text-gray-700">{instituteInfo.address}</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            {socialLinks.map(link => (
              <a key={link.platform} href={link.url} target="_blank" rel="noreferrer" aria-label={link.platform}>
                <i className={`${link.icon} text-3xl text-blue-600 hover:text-blue-800 transition-colors duration-200`}></i>
              </a>
            ))}
          </div>
        </Card>

        {/* Contact Form */}
        <Card>
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Send Us a Message</h2>
          {alertMessage && (
            <Alert
              type={submitStatus === 'success' ? 'success' : 'error'}
              message={alertMessage}
              onClose={() => setAlertMessage(null)}
              className="mb-4"
            />
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="name"
              label="Your Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              id="email"
              label="Your Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id="subject"
              label="Subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Your Message
              </label>
              <textarea
                id="message"
                rows={5}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <Button type="submit" className="w-full" loading={submitStatus === 'loading'} disabled={submitStatus === 'loading'}>
              Send Message
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ContactPage;
