import React from 'react';

import {Logo} from '@/components/commons/logo/Logo';
import {checkServiceHealth} from '@/utils/healthCheck';

const OuterSpinner: React.FC = () => (
  <svg
    className="absolute top-0 left-0 h-[1100px] w-[1100px] -translate-x-1/2 -translate-y-1/3 animate-[spin_5s_linear_infinite]"
    viewBox="0 0 100 100"
    fill="none"
    stroke="white"
    strokeWidth="8"
  >
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#141414" />
        <stop offset="100%" stopColor="#252525" />
      </linearGradient>
    </defs>

    <circle
      cx="50"
      cy="50"
      r="40"
      stroke="url(#grad1)"
      strokeOpacity="1"
      strokeDasharray="120 60"
      strokeDashoffset="15"
      fill="none"
      strokeLinecap="butt"
    />
  </svg>
);

const InnerSpinner: React.FC = () => (
  <svg
    className="absolute top-0 left-0 h-[540px] w-[540px] -translate-x-1/2 -translate-y-1/6 rotate-90 animate-[spin_3s_linear_infinite]"
    viewBox="0 0 50 50"
    fill="none"
    strokeWidth="6"
  >
    <defs>
      <linearGradient id="grad2" x1="80%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#141414" />
        <stop offset="80%" stopColor="#252525" />
      </linearGradient>
    </defs>

    <circle
      cx="25"
      cy="25"
      r="20"
      stroke="url(#grad2)"
      strokeOpacity="1"
      strokeDasharray="120 60"
      strokeDashoffset="20"
      fill="none"
      strokeLinecap="butt"
    />
  </svg>
);

const LoadingBar: React.FC = () => (
  <div className="mt-3 h-2 w-32 overflow-hidden rounded-full bg-gray-600">
    <div
      className="h-2 rounded-full bg-white"
      style={{
        width: 0,
        animation: 'growWidth 5s forwards',
      }}
    />
    <style>
      {`
        @keyframes growWidth {
          0% { width: 0; }
          100% { width: 100%; }
        }
      `}
    </style>
  </div>
);

export const SplashScreen = () => {
  checkServiceHealth();

  return (
    <div className="relative flex h-screen flex-col items-center justify-center overflow-hidden bg-[#141414] text-white select-none">
      <div className="fixed top-0 left-0 origin-top-left">
        <OuterSpinner />
        <InnerSpinner />
      </div>

      <div className="z-10 flex flex-col items-center space-y-2">
        <Logo />

        <div className="self-end pr-2 text-xs text-gray-400">v 1.0</div>

        <LoadingBar />
      </div>
    </div>
  );
};
