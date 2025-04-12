import React from 'react';

export default function CatSprite({ isActive = false, say, think,collision }) {
  return (
    <div className="relative">
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        className={`${isActive ? 'ring-2 ring-blue-500' : ''} ${
          collision ? 'animate-pulse ring-2 ring-red-500' : ''
        }`}      >
        {/* Cat body */}
        <circle cx="50" cy="60" r="30" fill="#FFAB19" stroke="#000" strokeWidth="2" />
        {/* Cat head */}
        <circle cx="50" cy="30" r="20" fill="#FFAB19" stroke="#000" strokeWidth="2" />
        {/* Eyes */}
        <circle cx="40" cy="25" r="3" fill="#000" />
        <circle cx="60" cy="25" r="3" fill="#000" />
        {/* Ears */}
        <path d="M35,15 L45,25 L30,25 Z" fill="#FFAB19" stroke="#000" strokeWidth="2" />
        <path d="M65,15 L55,25 L70,25 Z" fill="#FFAB19" stroke="#000" strokeWidth="2" />
        {/* Mouth */}
        <path d="M45,35 Q50,40 55,35" stroke="#000" strokeWidth="2" fill="none" />
      </svg>
      
      {say && (
    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs shadow-md whitespace-nowrap">
      {say}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-white"></div>
    </div>
  )}
  
  {think && (
    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs shadow-md whitespace-nowrap">
      {think}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-white"></div>
    </div>
  )}
    </div>
  );
}