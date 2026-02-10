// src/pages/auth/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import LOGO from '../../assets/Logo -.png';
import { useAuth } from '../../context/AuthContext';

// Eye icons for password visibility toggle
const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Email validation
  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Enter correct email';
    return '';
  };

  // Password validation
  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Error Password';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitError('');

    // Validate on change if field was touched
    if (touched[name]) {
      if (name === 'email') {
        setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
      } else if (name === 'password') {
        setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    if (name === 'email') {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    } else if (name === 'password') {
      setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    }
  };

// In LoginPage.jsx, replace your handleSubmit function with this:

const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate all fields
  const emailError = validateEmail(formData.email);
  const passwordError = validatePassword(formData.password);

  setErrors({ email: emailError, password: passwordError });
  setTouched({ email: true, password: true });

  if (emailError || passwordError) return;

  try {
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      console.log('Login success:', {
        hasSubscription: result.hasSubscription,
        serviceIds: result.serviceIds,
        userId: result.user?.id
      });
      
      // Step 1: Check if user has subscription
      if (!result.hasSubscription) {
        // No subscription - go to choose plan
        navigate('/choose-plan');
        return;
      }
      
      // Step 2: User has subscription - check if onboarding is complete
      const userId = result.user?.id;
      // Match the key used in OnboardingPage.jsx: `onboarding_${userId}`
      const onboardingComplete = localStorage.getItem(`onboarding_${userId}`);
      
      if (onboardingComplete === 'true') {
        // Fully onboarded user - go to dashboard
        navigate('/dashboard');
      } else {
        // Has subscription but hasn't completed onboarding - go to integration hub
        navigate('/integration-hub');
      }
    } else {
      setSubmitError(result.error || 'Login failed. Please try again.');
    }
  } catch (err) {
    console.error('Login error:', err);
    setSubmitError('An unexpected error occurred. Please try again.');
  }
};
  const getInputClassName = (fieldName) => {
    const hasError = touched[fieldName] && errors[fieldName];
    return `w-full h-12 px-4 border rounded-lg outline-none transition-all duration-200
      ${hasError 
        ? 'border-red-500 text-red-500 placeholder-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
        : 'border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
      }`;
  };

  return (
    <AuthLayout>
      <img src={LOGO} className='w-56 h-16'/>

      <h2 
        className="text-[32px] font-medium text-gray-900 mb-8"
        style={{ fontFamily: 'DM Sans, sans-serif' }}
      >
        Sign in to your account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="user@example.com"
            className={getInputClassName('email')}
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          />
          {touched.email && errors.email && (
            <p className="mt-1.5 text-sm text-red-500" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter Password"
              className={`${getInputClassName('password')} pr-12`}
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {touched.password && errors.password && (
            <p className="mt-1.5 text-sm text-red-500" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              {errors.password}
            </p>
          )}
        </div>

        {/* Submit Error */}
        {submitError && (
          <p className="text-sm text-red-500 text-center" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {submitError}
          </p>
        )}

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium rounded-full
            transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Login'
          )}
        </button>

        {/* Sign Up Link */}
        <p className="text-center text-gray-600" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          Don't have an account?{' '}
          <Link 
            to="/signup" 
            className="text-[#4F46E5] hover:text-[#4338CA] font-medium transition-colors"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;