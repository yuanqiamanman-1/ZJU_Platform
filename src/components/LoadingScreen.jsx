import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl">
      <div className="relative h-20 w-20">
        <div className="absolute inset-0 rounded-full border border-white/10" />
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 border-r-purple-500 animate-spin"
          style={{ animationDuration: '1.1s' }}
        />
        <div
          className="absolute inset-3 rounded-full border-2 border-transparent border-b-cyan-400 border-l-fuchsia-500 animate-spin"
          style={{ animationDuration: '1.6s', animationDirection: 'reverse' }}
        />
        <div className="absolute inset-[42%] rounded-full bg-white/90 animate-pulse" />
      </div>
      
      <p className="mt-6 text-white/55 text-xs font-semibold tracking-[0.28em] uppercase animate-pulse">
        Loading
      </p>
    </div>
  );
};

export default LoadingScreen;
