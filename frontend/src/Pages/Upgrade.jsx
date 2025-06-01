import React, { useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import SubscriptionPlan from '../components/SubscriptionPlan';

const Upgrade = () => {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [currentPlan, setCurrentPlan] = useState('Free'); // TODO: fetch from backend
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!isSignedIn || !user) return;
    setLoading(true);
    try {
      const token = await getToken();
      const res = await axios.post('/api/stripe/create-checkout-session', {
        clerkUserId: user.id,
        email: user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || '',
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        alert('Failed to start checkout.');
      }
    } catch (err) {
      alert('Stripe error: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#f7f7fb] px-4 pt-20">
      <h2 className="text-3xl font-bold text-[#6c47ff] mb-8">Choose Your Plan</h2>
      <SubscriptionPlan currentPlan={currentPlan} onUpgrade={handleUpgrade} />
      {loading && <div className="mt-4 text-[#6c47ff]">Redirecting to payment...</div>}
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg text-center mt-8">
        <h3 className="font-semibold text-lg mb-2">Billing History</h3>
        <div className="border-t border-gray-200 pt-3 mt-2">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <i className="fa-solid fa-file-invoice"></i> Invoice #2590
            <span className="ml-2">Free Trial</span>
            <span className="ml-2">May 1, 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
