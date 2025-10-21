'use client';

import { useState } from 'react';
import FeedbackForm from './FeedbackForm';
import FeedbackList from './FeedbackList';

export default function FeedbackPanel() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-4">
      <FeedbackForm onSubmitted={() => setRefreshKey((k) => k + 1)} />
      <FeedbackList refreshKey={refreshKey} />
    </div>
  );
}
