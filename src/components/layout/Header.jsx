// src/components/layout/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { userData } from "../../data/mockData";
import logo from "../../assets/Logo.png"; // Adjust path as needed
import api from "../../services/api";

// Bell Icon Component
const BellIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

// Header Variants:
// 'full' - Full header with credits, buy button, bell, profile (for main app)
// 'simple' - Just logo and profile (for onboarding/auth pages)
// 'minimal' - Just logo (for public pages)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Header = ({
  variant = "simple", // 'full', 'simple', 'minimal'
  onBuyCredits,
  onLogoClick,
  showGetCredits = false,
  userData = { avatar: "/images/avatar.png", name: "User" },
  className = "",
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [credits, setCredits] = useState(0);
  const profileRef = useRef(null);

  useEffect(() => {
    const fetchCredits = async () => {
      const res = await api.get(`${API_BASE_URL}/b2b/credits/balance`);
      setCredits(res.data.data.credits);
    };

    fetchCredits();
  }, []);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    setIsProfileOpen(false);
    await logout();
    navigate("/login");
  };

  // Handle logo click
  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      navigate("/dashboard");
    }
  };

  // Handle profile click
  const handleProfileClick = () => {
    setIsProfileOpen(false);
    navigate("/profile");
  };

  // Handle buy credits
  const handleBuyCreditsClick = () => {
    if (onBuyCredits) {
      onBuyCredits();
    }
  };

  // Render based on variant
  if (variant === "minimal") {
    return (
      <header
        className={`bg-gradient-to-b from-[#DFE3F5] to-[#DFE3F5] flex justify-between items-center px-4 py-2 h-[62px] flex-shrink-0 border-b border-[#DFE3F5] z-10 ${className}`}
      >
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleLogoClick}
        >
          <img
            src={logo}
            alt="AI Workforce"
            className="w-[148px] h-[46px] object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="148" height="46"><text x="10" y="30" font-size="16" font-weight="bold" fill="%231F2937">AI Workforce</text></svg>';
            }}
          />
        </div>
      </header>
    );
  }

  if (variant === "simple") {
    return (
      <header
        className={`bg-gradient-to-b from-[#DFE3F5] to-[#DFE3F5] flex justify-between items-center px-4 py-2 h-[62px] flex-shrink-0 border-b border-[#DFE3F5] z-10${className}`}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleLogoClick}
        >
          <img
            src={logo}
            alt="AI Workforce"
            className="w-[148px] h-[46px] object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="148" height="46"><text x="10" y="30" font-size="16" font-weight="bold" fill="%231F2937">AI Workforce</text></svg>';
            }}
          />
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="w-10 h-10 rounded-full overflow-hidden focus:outline-none"
          >
            <img
              src={userData.avatar}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect fill="%23E5E7EB" width="40" height="40" rx="20"/><text x="20" y="25" text-anchor="middle" fill="%236B7280" font-size="14">U</text></svg>';
              }}
            />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-40 bg-white rounded-xl shadow-lg border z-50">
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-t-xl"
                onClick={handleProfileClick}
              >
                Profile
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-b-xl"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
    );
  }

  // Full variant (for main app with credits)
  return (
    <header
      className={`bg-gradient-to-b from-[#DFE3F5] to-[#DFE3F5] flex justify-between items-center px-4 py-2 h-[62px] flex-shrink-0 border-b border-[#DFE3F5] z-10 ${className}`}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={handleLogoClick}
      >
        <img
          src={logo}
          alt=""
          className="w-[148px] h-[46px] object-contain"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="148" height="46"><text x="10" y="30" font-size="16" font-weight="bold" fill="%231F2937">AI Workforce</text></svg>';
          }}
        />
      </div>

      {/* Right side */}
      <div className="flex items-center h-[42px] gap-4">
        {/* Get Credits Link */}
        {(showGetCredits || credits <= 0) && (
          <button
            onClick={handleBuyCreditsClick}
            className="text-sm text-gray-600 hover:text-[#3C49F7] hover:font-bold hover:underline transition-colors cursor-pointer"
          >
            Get Credits now!
          </button>
        )}

        {/* Credits Display */}
        <div className="flex items-center bg-white rounded-full px-3 py-1.5 shadow-sm border border-gray-900">
          <span
            className={`text-[14px] font-semibold italic mr-3 ${credits <= 0 ? "text-red-500" : "text-gray-900"}`}
          >
            {credits} Credits
          </span>
          <button
            onClick={handleBuyCreditsClick}
            className="bg-gray-900 text-white text-[14px] px-2.5 py-1 rounded-full hover:bg-white hover:text-blue-700 transition-colors"
          >
            Buy Credits
          </button>
        </div>

        {/* Notification Bell */}
        <button className="bg-white rounded-full p-3 text-gray-500 hover:bg-gray-100 transition-all">
          <BellIcon />
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="w-10 h-10 rounded-full overflow-hidden focus:outline-none"
          >
            <img
              src={userData.avatar}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect fill="%23E5E7EB" width="40" height="40" rx="20"/><text x="20" y="25" text-anchor="middle" fill="%236B7280" font-size="14">U</text></svg>';
              }}
            />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-40 bg-white rounded-xl shadow-lg border z-50">
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-t-xl"
                onClick={handleProfileClick}
              >
                Profile
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-b-xl"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
