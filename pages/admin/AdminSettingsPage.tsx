import React from 'react';
import Card from '../../components/Card';

const AdminSettingsPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 min-h-screen-minus-nav-footer">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Institute Settings</h1>
      <Card>
        <p className="text-gray-700">This page allows administrators to configure various institute settings.</p>
        <p className="mt-4 text-gray-600">Functionality to be implemented: General settings (name, logo, contact), UPI/Payment gateway settings, Social links, Privacy policy editing.</p>
      </Card>
    </div>
  );
};

export default AdminSettingsPage;