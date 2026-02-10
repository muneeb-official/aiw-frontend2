// src/pages/auth/SignUpPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import { useAuth } from '../../context/AuthContext';
import LogoIcon from '../../assets/Logo -.png';
import Success from '../../assets/icons/success.png'

// Success Icon Component
const SuccessIcon = () => (
  <div className="w-20 h-20 rounded-full bg-[#EEF2FF] flex items-center justify-center mx-auto mb-6">
    <img src={Success} alt="" className='w-10 h-10' />
  </div>
);

// Profile Created Success Screen
// Profile Created Success Screen (fallback)
const ProfileCreatedScreen = ({ onContinue }) => (
  <AuthLayout>
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <SuccessIcon />
      <h2 
        className="text-[32px] font-semibold text-gray-900 mb-3"
        style={{ fontFamily: 'DM Sans, sans-serif' }}
      >
        We have successfully created your profile.
      </h2>
      <p 
        className="text-gray-600 mb-8"
        style={{ fontFamily: 'DM Sans, sans-serif' }}
      >
        Please login to continue with plan selection.
      </p>
      <button
        onClick={onContinue}
        className="w-full max-w-[400px] h-12 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium rounded-full transition-all duration-200"
        style={{ fontFamily: 'DM Sans, sans-serif' }}
      >
        Continue to Login
      </button>
    </div>
  </AuthLayout>
);

// Eye icons
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

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// Logo component
// const Logo = () => (
//   <div className="flex items-center gap-3 mb-6">
//     <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <rect x="4" y="8" width="14" height="10" rx="2" stroke="#1F2937" strokeWidth="2" fill="none" />
//       <rect x="22" y="8" width="14" height="10" rx="2" stroke="#1F2937" strokeWidth="2" fill="none" />
//       <rect x="8" y="24" width="24" height="10" rx="2" stroke="#1F2937" strokeWidth="2" fill="none" />
//       <path d="M11 13H15M25 13H29M16 29H24" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" />
//       <circle cx="32" cy="6" r="4" fill="#4F46E5" />
//     </svg>
//     <div>
//       <h1 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'DM Sans, sans-serif' }}>
//         AI workforce
//       </h1>
//       <p className="text-sm text-gray-500" style={{ fontFamily: 'DM Sans, sans-serif' }}>
//         Create an AI employee
//       </p>
//     </div>
//   </div>
// );

// Country codes data
const countryCodes = [
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+92', country: 'PK', flag: '🇵🇰' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
];

// Location options
const locations = [
  'United Kingdom',
  'United States',
  'India',
  'Pakistan',
  'Australia',
  'Germany',
  'France',
  'China',
  'Japan',
  'United Arab Emirates',
  'Canada',
  'Singapore',
];

const SignUpPage = () => {
  const navigate = useNavigate();
  const { signUp, login, loading } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    organisation: '',
    location: '',
    email: '',
    countryCode: '+44',
    phone: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Validation functions
  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
        return !value.trim() ? 'First name is required' : '';
      case 'lastName':
        return !value.trim() ? 'Last name is required' : '';
      case 'organisation':
        return !value.trim() ? 'Organisation name is required' : '';
      case 'location':
        return !value ? 'Location is required' : '';
      case 'email':
        if (!value) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Enter correct email' : '';
      case 'phone':
        if (!value) return 'Phone number is required';
        const phoneRegex = /^[0-9\s]{8,15}$/;
        return !phoneRegex.test(value.replace(/\s/g, '')) ? 'Enter valid phone number' : '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitError('');

    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleLocationSelect = (location) => {
    setFormData((prev) => ({ ...prev, location }));
    setShowLocationDropdown(false);
    if (touched.location) {
      setErrors((prev) => ({ ...prev, location: validateField('location', location) }));
    }
  };

  const handleCountryCodeSelect = (code) => {
    setFormData((prev) => ({ ...prev, countryCode: code }));
    setShowCountryDropdown(false);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate all fields
  const newErrors = {};
  Object.keys(formData).forEach((key) => {
    if (key !== 'countryCode') {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    }
  });

  setErrors(newErrors);
  setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

  if (Object.keys(newErrors).length > 0) return;

  try {
    setSubmitError('');
    
    const result = await signUp(formData);
    console.log('SignUp result:', result);
    
    if (result.success) {
      // Store organization_id and user_id from signup response
      if (result.organization_id) {
        localStorage.setItem('organization_id', result.organization_id);
      }
      if (result.user_id) {
        localStorage.setItem('user_id', result.user_id);
      }
      
      // Auto-login after signup
      const loginResult = await login(formData.email, formData.password);
      
      if (loginResult.success) {
        // Also store from login result if available
        if (loginResult.organization_id) {
          localStorage.setItem('organization_id', loginResult.organization_id);
        }
        if (loginResult.user_id) {
          localStorage.setItem('user_id', loginResult.user_id);
        }
        
        // New user - backend returns service_ids: null
        // So hasSubscription will be false → go to choose plan
        navigate('/choose-plan');
      } else {
        setShowSuccess(true);
      }
    } else {
      setSubmitError(result.error || 'Sign up failed. Please try again.');
    }
  } catch (err) {
    console.error('SignUp error:', err);
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

 if (showSuccess) {
  return (
    <ProfileCreatedScreen 
      onContinue={() => navigate('/choose')} 
    />
  );
}

  return (
    <AuthLayout>
      <img src={LogoIcon} alt="" className='w-56 h-16' />

      <h2 
        className="text-[32px] font-medium text-gray-900 mb-2"
        style={{ fontFamily: 'DM Sans, sans-serif' }}
      >
        Welcome to AI Workforce
      </h2>
      <p className="text-gray-600 mb-6" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        Get started – it's free. No credit card needed.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name & Last Name Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter Name"
              className={getInputClassName('firstName')}
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            />
            {touched.firstName && errors.firstName && (
              <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter Name"
              className={getInputClassName('lastName')}
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            />
            {touched.lastName && errors.lastName && (
              <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Organisation & Location Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Organisation Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="organisation"
              value={formData.organisation}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter Organisation Name"
              className={getInputClassName('organisation')}
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            />
            {touched.organisation && errors.organisation && (
              <p className="mt-1 text-sm text-red-500">{errors.organisation}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-900 mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Location <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              onBlur={() => setTimeout(() => setShowLocationDropdown(false), 200)}
              className={`${getInputClassName('location')} flex items-center justify-between text-left`}
            >
              <span className={formData.location ? 'text-gray-900' : 'text-gray-400'}>
                {formData.location || '-- Select Location --'}
              </span>
              <ChevronDownIcon />
            </button>
            {showLocationDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {locations.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => handleLocationSelect(loc)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-900"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
            {touched.location && errors.location && (
              <p className="mt-1 text-sm text-red-500">{errors.location}</p>
            )}
          </div>
        </div>

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
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Phone Number Field */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            {/* Country Code Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                onBlur={() => setTimeout(() => setShowCountryDropdown(false), 200)}
                className="h-12 px-3 border border-r-0 border-gray-300 rounded-l-lg bg-white flex items-center gap-1 hover:bg-gray-50 min-w-[80px]"
              >
                <span className="text-gray-900" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {formData.countryCode}
                </span>
                <ChevronDownIcon />
              </button>
              {showCountryDropdown && (
                <div className="absolute z-10 w-32 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {countryCodes.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => handleCountryCodeSelect(item.code)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                    >
                      <span>{item.flag}</span>
                      <span className="text-gray-900" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        {item.code}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Phone Input */}
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="00000 00000"
              className={`flex-1 h-12 px-4 border border-gray-300 rounded-r-lg outline-none transition-all duration-200
                ${touched.phone && errors.phone 
                  ? 'border-red-500 text-red-500 placeholder-red-400' 
                  : 'text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                }`}
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            />
          </div>
          {touched.phone && errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
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
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        {/* Submit Error */}
        {submitError && (
          <p className="text-sm text-red-500 text-center">{submitError}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium rounded-full
            transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center mt-6"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Submit'
          )}
        </button>

        {/* Login Link */}
        <p className="text-center text-gray-600" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="text-[#4F46E5] hover:text-[#4338CA] font-medium transition-colors"
          >
            Log In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignUpPage;