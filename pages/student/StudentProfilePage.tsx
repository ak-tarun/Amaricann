
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import * as authService from '../../services/authService';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';

const StudentProfilePage: React.FC = () => {
  const { user, token, logout } = useAuth(); // Assuming useAuth provides a way to update local user state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || '');
      // Assuming user object might contain a profile_image_url
      // setProfileImageUrl(user.profile_image_url || 'https://picsum.photos/100/100');
      setProfileImageUrl('https://picsum.photos/100/100?random=profile'); // Placeholder
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!user) {
      setMessage("User not logged in.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    if (profileImage) {
      formData.append('profile_image', profileImage);
    }
    formData.append('_method', 'PUT'); // Laravel expects _method for PUT with FormData

    const response = await authService.updateProfile(formData);

    if (response.success) {
      setMessage(response.message || 'Profile updated successfully!');
      setMessageType('success');
      // Ideally, the AuthContext should have a function to update the user data
      // For now, we'll simulate by re-fetching or showing a message.
      // If the backend returns the updated user, you'd parse and update context.
      // Example: If AuthContext had setUser: setUser(response.data.user);
    } else {
      setMessage(response.message || 'Failed to update profile.');
      setMessageType('error');
    }
    setLoading(false);
  };

  if (!user) {
    return <LoadingSpinner />; // Or redirect to login
  }

  return (
    <div className="container mx-auto p-6 min-h-screen-minus-nav-footer">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">My Profile</h1>
      <Card className="max-w-xl mx-auto">
        {message && <Alert type={messageType} message={message} onClose={() => setMessage(null)} className="mb-4" />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-blue-400"
            />
            {/* File upload input for profile image */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setProfileImage(file || null);
                if (file) {
                  setProfileImageUrl(URL.createObjectURL(file));
                }
              }}
              className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            />
          </div>

          <Input
            id="name"
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
          <Input
            id="email"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <Input
            id="phone"
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
          />

          <Button type="submit" className="w-full" loading={loading} disabled={loading}>
            Update Profile
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default StudentProfilePage;
