import React from 'react';

const Loader = ({ fullPage = false, text = "Syncing Scholastic Data..." }) => {
  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative">
        {/* Outer Glow */}
        <div className="absolute inset-0 rounded-full bg-[#8cc63f]/20 blur-xl animate-pulse" />
        
        {/* Main Spinner */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 border-[4px] border-gray-100/50 rounded-full" />
        <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 border-[4px] border-transparent border-t-[#8cc63f] border-r-[#fbc111] rounded-full animate-spin shadow-lg" />
        
        {/* Inner static circle or another small pulse */}
        <div className="absolute inset-4 rounded-full bg-gray-50/ dark:bg-gray-800/ border border-gray-100 dark:border-gray-700 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#8cc63f] animate-ping" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.3em] text-slate-800 dark:text-gray-100 animate-pulse">
          {text}
        </span>
        <div className="flex gap-1.5">
           <div className="w-1.5 h-1.5 rounded-full bg-[#8cc63f] animate-bounce [animation-delay:-0.3s]" />
           <div className="w-1.5 h-1.5 rounded-full bg-[#fbc111] animate-bounce [animation-delay:-0.15s]" />
           <div className="w-1.5 h-1.5 rounded-full bg-[#8cc63f] animate-bounce" />
        </div>
      </div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white/ dark:bg-gray-800/ backdrop-blur-xl flex items-center justify-center">
        {loaderContent}
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center p-12">
      {loaderContent}
    </div>
  );
};

export default Loader;
