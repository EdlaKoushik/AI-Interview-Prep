import React from 'react';
import { SignUp } from '@clerk/clerk-react';

const Register = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#f7f7fb] px-4">
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-[#6c47ff]">Create Your Account</h2>
      <SignUp routing="path" path="/signup" signInUrl="/signin" />
    </div>
  </div>
);

export default Register;
