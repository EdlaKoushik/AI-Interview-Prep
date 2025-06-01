import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import Login from './Pages/Login';
import Register from './Pages/Regiter';
import Dashboard from './Pages/Dashboard';
import Upgrade from './Pages/Upgrade';
import Settings from './Pages/Settings';
import InterviewCreationPage from './Pages/InterviewCreationPage';
import InterviewSessionPage from './Pages/InterviewSessionPage';
import FeedbackPage from './Pages/FeedbackPage';
import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';

export default function App() {
  const { isSignedIn, getToken } = useAuth ? useAuth() : { isSignedIn: false };
  const { user } = useUser ? useUser() : { user: null };
  const navigate = useNavigate ? useNavigate() : null;
  const location = useLocation ? useLocation() : { pathname: '/' };

  // Sync Clerk user to backend DB on sign in
  useEffect(() => {
    const syncUser = async () => {
      if (isSignedIn && user) {
        try {
          const token = await getToken();
          await axios.post(
            '/api/auth/login',
            {
              clerkUserId: user.id,
              email:
                user.primaryEmailAddress?.emailAddress ||
                user.emailAddresses?.[0]?.emailAddress ||
                '',
            },
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
        } catch (err) {
          // Optionally handle error
        }
      }
    };
    syncUser();
  }, [isSignedIn, user, getToken]);

  // Redirect to dashboard only if coming from signin/signup
  useEffect(() => {
    if (
      isSignedIn &&
      navigate &&
      (location.pathname === '/signin' || location.pathname === '/signup')
    ) {
      navigate('/dashboard');
    }
  }, [isSignedIn, navigate, location]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/upgrade" element={<Upgrade />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/create-interview" element={<InterviewCreationPage />} />
      <Route path="/interview-session/:id" element={<InterviewSessionPage />} />
      <Route path="/feedback/:id" element={<FeedbackPage />} />
      <Route path="/feedback" element={<FeedbackPage />} />
      {/* Add more routes here as needed */}
    </Routes>
  );
}