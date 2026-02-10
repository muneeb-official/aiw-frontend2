// src/pages/auth/PaymentCancelPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import backgroundImage from '../../assets/Background.png';

// Cancel Icon
const CancelIcon = () => (
  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  </div>
);

const PaymentCancelPage = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Header variant="simple" />

      <main className="w-full bg-white mt-6">
        <div className="max-w-2xl mx-auto px-6 py-16 mt-6 text-center">
          <CancelIcon />
          
          <h1 
            className="text-3xl font-semibold text-gray-900 mb-4"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Payment Cancelled
          </h1>
          
          <p className="text-gray-600 mb-8">
            Your payment was not processed. Don't worry, your cart is still saved.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Need help?</h3>
            <p className="text-gray-600 text-sm mb-4">
              If you experienced any issues during checkout, our support team is here to help.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a 
                href="mailto:support@aiworkforce.com" 
                className="text-[#4F46E5] hover:underline"
              >
                support@aiworkforce.com
              </a>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/cart')}
              className="px-6 py-3 bg-[#4F46E5] text-white font-medium rounded-xl hover:bg-[#4338CA] transition-colors"
            >
              Return to Cart
            </button>
            <button
              onClick={() => navigate('/choose-plan')}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Change Plan
            </button>
          </div>

          <p className="text-gray-400 text-sm mt-8">
            Your selected plan will remain in your cart until you complete the purchase or clear it.
          </p>
        </div>
      </main>
    </div>
  );
};

export default PaymentCancelPage;