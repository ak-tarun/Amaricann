
import React, { useEffect, useState } from 'react';
import * as settingsService from '../../services/settingsService';
import { PrivacyPolicy } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';
import RichTextDisplay from '../../components/RichTextDisplay';
import Card from '../../components/Card';

const PrivacyPolicyPage: React.FC = () => {
  const [policy, setPolicy] = useState<PrivacyPolicy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      setLoading(true);
      setError(null);
      const response = await settingsService.getPrivacyPolicy();
      if (response.success && response.data) {
        setPolicy(response.data);
      } else {
        setError(response.message || 'Failed to load privacy policy.');
      }
      setLoading(false);
    };

    fetchPrivacyPolicy();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="container mx-auto p-6 min-h-screen-minus-nav-footer"><Alert type="error" message={error} /></div>;
  }

  if (!policy) {
    return <div className="container mx-auto p-6 min-h-screen-minus-nav-footer"><Alert type="info" message="Privacy policy not found." /></div>;
  }

  return (
    <div className="container mx-auto p-6 min-h-screen-minus-nav-footer">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Privacy Policy</h1>
      <Card>
        <div className="text-gray-800 leading-relaxed">
          <RichTextDisplay content={policy.content} />
          <p className="mt-8 text-sm text-gray-500">
            Last Updated: {new Date(policy.updated_at).toLocaleDateString()}
            {policy.updater_name && ` by ${policy.updater_name}`}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PrivacyPolicyPage;
