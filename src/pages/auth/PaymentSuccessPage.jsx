// src/pages/auth/PaymentSuccessPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { useSubscription } from '../../services/SubscriptionContext';
import backgroundImage from '../../assets/Background.png';

// Success Checkmark Icon
const SuccessIcon = () => (
  <div className="w-20 h-20 bg-[#10B981] rounded-full flex items-center justify-center mx-auto mb-6">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </div>
);

// Loading Animation
const LoadingDots = () => (
  <div className="flex justify-center gap-2">
    <div className="w-2 h-2 rounded-full bg-gray-900 animate-bounce" style={{ animationDelay: '0ms' }} />
    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }} />
    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }} />
  </div>
);

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useSubscription();
  
  const [isProcessing, setIsProcessing] = useState(true);
  const [countdown, setCountdown] = useState(5);

  // Get session_id from URL (Stripe sends this back)
  const sessionId = searchParams.get('session_id');

useEffect(() => {
  clearCart();
  
  // Get current user email from token or context
  const userEmail = localStorage.getItem('user_email'); // You need to store this on login
  
//   if (userEmail) {
//     localStorage.setItem(`plan_selected_${userEmail}`, 'true');
//   }
  
  const processingTimer = setTimeout(() => {
    setIsProcessing(false);
  }, 2000);

  return () => clearTimeout(processingTimer);
}, [clearCart]);

  useEffect(() => {
    if (!isProcessing) {
      // Start countdown after processing is done
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            // Redirect to Integration Hub (next step in flow)
            navigate('/integration-hub');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [isProcessing, navigate]);

  // Processing State
  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Great! We received your payment
          </h2>
          <p className="text-gray-500 mb-6" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Please wait for a moment.
          </p>
          <LoadingDots />
        </div>
      </div>
    );
  }

  // Success State
  return (
    <div 
      className="min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Header variant="simple" />

      <main className="w-full bg-white mt-6">
        <div className="max-w-2xl mx-auto px-6 py-16 mt-6 text-center">
          <SuccessIcon />
          
          <h1 
            className="text-3xl font-semibold text-gray-900 mb-4"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 mb-2">
            Thank you for your subscription. Let's set up your account.
          </p>
          
          {sessionId && (
            <p className="text-gray-400 text-sm mb-8">
              Transaction ID: {sessionId.substring(0, 20)}...
            </p>
          )}

          <div className="bg-[#F0FDF4] border border-[#10B981] rounded-xl p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Next Steps</h3>
            <ul className="text-left text-gray-600 space-y-2">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Connect your integrations
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Complete onboarding questions
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Start using your AI agents
              </li>
            </ul>
          </div>

          <p className="text-gray-500 text-sm mb-4">
            Redirecting to setup in {countdown} seconds...
          </p>

          <div className="flex justify-center">
            <button
              onClick={() => navigate('/integration-hub')}
              className="px-6 py-3 bg-[#4F46E5] text-white font-medium rounded-xl hover:bg-[#4338CA] transition-colors"
            >
              Continue to Next Step
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentSuccessPage;