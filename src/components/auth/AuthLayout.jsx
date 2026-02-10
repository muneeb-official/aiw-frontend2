// src/components/auth/AuthLayout.jsx
import React from 'react';
import AI_ROBOT_IMAGE from "../../assets/ai-robot-login.png";
import BG from "../../assets/Background.png";

// AI Robot image - you can replace this with your actual image path


const AuthLayout = ({ children }) => {
  return (
    //  
    <div className="relative min-h-screen overflow-hidden flex">
        <img src={BG} className='absolute'/> 
        {/* Fallback gradient overlay in case image doesn't load */}
        {/* <div className="absolute inset-0 bg-gradient-to-br from-[#C5CCD4]/50 to-[#9CA3AF]/50 pointer-events-none" /> */}
      {/* Left Side - Form */}
      <div className="relative w-full lg:w-1/2 flex items-center justify-center bg-white  rounded m-3 px-6 py-12">
        <div className="w-full max-w-[480px]">
          {children}
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-[#C5CCD4]  m-3 rounded relative overflow-hidden">
        <img
          src={AI_ROBOT_IMAGE}
          alt="AI Workforce"
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={(e) => {
            // Fallback gradient if image fails to load
            e.target.style.display = 'none';
            e.target.parentElement.style.background = 'linear-gradient(135deg, #C5CCD4 0%, #9CA3AF 100%)';
          }}
        />
      </div>
    </div>
  );
};

export default AuthLayout;