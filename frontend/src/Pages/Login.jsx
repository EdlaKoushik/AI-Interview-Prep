import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const Login = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#f7f7fb] px-4">
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-[#6c47ff]">Sign In to AI Interview Prep</h2>
      <SignIn routing="path" path="/signin" signUpUrl="/signup" />
    </div>
  </div>
);

export default Login;
