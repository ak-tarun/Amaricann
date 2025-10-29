import React from 'react';
import Card from '../../components/Card';

const AdminUsersPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 min-h-screen-minus-nav-footer">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">User Management (Super Admin)</h1>
      <Card>
        <p className="text-gray-700">This page is for Super Admins to manage all users (including other staff/admins).</p>
        <p className="mt-4 text-gray-600">Functionality to be implemented: List users, Add/Edit/Delete users, Change roles.</p>
      </Card>
    </div>
  );
};

export default AdminUsersPage;