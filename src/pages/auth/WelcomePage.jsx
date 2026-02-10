// src/pages/auth/WelcomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Step4Image from '../../assets/step-4.png'

// Logo Component
// const Logo = () => (
//   <div className="flex items-center gap-3">
//     {/* Replace with: <img src="/images/logo.png" alt="AI Workforce" className="h-8" /> */}
//     <img 
//       src="/images/logo.png" 
//       alt="AI Workforce" 
//       className="h-10"
//       onError={(e) => {
//         e.target.onerror = null;
//         e.target.parentElement.innerHTML = `
//           <div class="flex items-center gap-2">
//             <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
//               <span class="text-indigo-600 font-bold text-sm">AI</span>
//             </div>
//             <div>
//               <p class="text-sm font-semibold text-gray-900">AI workforce</p>
//               <p class="text-xs text-gray-500">Create an AI employee</p>
//             </div>
//           </div>
//         `;
//       }}
//     />
//   </div>
// );

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/dashboard');
  };

  return (
    <div className="h-full overflow-hidden">
      {/* Header */}
      <Header variant="simple" />

      {/* Main Content */}
      <main className="flex gap-10 min-h-[90vh]">
        {/* Left Side - Content */}
        <div className="w-full bg-white lg:w-[40%] px-8 lg:px-16 py-12 flex flex-col justify-center">
          <h1 
            className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Your dedicated Account Manager will be in touch shortly.
          </h1>

          <p className="text-gray-600 mb-6 leading-relaxed">
            We're currently warming up 2 email inboxes for your outbound agents to protect deliverability. This takes up to{' '}
            <span className="text-[#4F46E5] font-medium">14 days</span>{' '}
            and ensures emails land in inboxes —{' '}
            <span className="font-semibold text-gray-900">not spam.</span>
          </p>

          {/* Info Box */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="font-medium text-gray-900 mb-2">Once complete:</p>
            <ul className="space-y-1 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                You can send upto 120 emails/day (combined)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                Full outbound capacity unlocked
              </li>
            </ul>
          </div>

          <p className="text-gray-900 font-semibold mb-2">
            You may use your primary email in the meantime, limited to 10 emails/day to keep your account healthy.
          </p>

          <p className="text-gray-500 mb-8">
            We'll notify you as soon as everything is ready.
          </p>

          {/* Start Button */}
          <button
            onClick={handleStart}
            className="w-fit px-8 py-3 bg-[#4F46E5] text-white font-medium rounded-lg hover:bg-[#4338CA] transition-colors"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Start
          </button>
        </div>

        {/* Right Side - Blue Panel with Illustration */}
        <div className="hidden lg:flex w-[60%] h-[80%] items-center justify-center px-4 py-8">
            
            {/* Illustration - Replace with actual image */}
            <div className="flex justify-center">
              <img 
                src={Step4Image} 
                alt="Welcome" 
                className="w-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect fill="%234338CA" width="300" height="300" rx="20"/><text x="150" y="150" text-anchor="middle" fill="white" font-size="14">Add illustration: /images/welcome-illustration.png</text></svg>';
                }}
              />
            </div>
          
        </div>
      </main>
    </div>
  );
};

export default WelcomePage;