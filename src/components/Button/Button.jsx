// ============================================================
// Button.jsx — Reusable premium button component
// Variant based styling ache (primary, secondary, outline, ghost).
// Size props (sm, md, lg) handle kore width r padding.
// Loading state e spinner animation + disabled state show kore.
// Hover r Active micro-animations implement kora ache scaling effect diye.
// ============================================================

import React from 'react';

const Button = ({ text, onClick, variant = 'primary', disabled, type = 'button', icon: Icon, className = "", isLoading = false, loadingText = "Loading..." }) => {
  const baseStyle = "flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full";
  
  const variants = {
    primary: "font-bold px-6 py-[14px] rounded-xl bg-gradient-to-r from-[#8cc63f] to-[#fbc111] hover:from-[#7eb036] hover:to-[#e0ad0c] text-white tracking-wide text-[15px] shadow-sm active:scale-95",
    secondary: "font-bold px-6 py-[14px] rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 dark:text-gray-200 shadow-sm active:scale-95",
    danger: "font-bold px-6 py-[14px] rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-sm active:scale-95",
    portalSubmit: `px-12 py-5 rounded-full font-black text-[14px] uppercase tracking-widest shadow-2xl active:scale-95 overflow-hidden group ${
      isLoading 
        ? 'bg-gray-300 text-gray-500 !opacity-100' 
        : 'bg-gradient-to-r from-[#fbc111] to-[#8cc63f] hover:from-[#8cc63f] hover:to-[#fbc111] text-white shadow-xl shadow-[#8cc63f]/30 hover:shadow-[#fbc111]/40 hover:-translate-y-1'
    }`
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${className} relative`}
    >
      {variant === 'portalSubmit' && !isLoading && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
      )}
      
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-[3px] border-transparent border-t-[#8cc63f] border-b-[#fbc111] rounded-full animate-spin" />
          {loadingText}
        </>
      ) : (
        <>
          {text}
          {Icon && <Icon size={18} strokeWidth={variant === 'portalSubmit' ? 2.5 : 2} />}
        </>
      )}
    </button>
  );
};

export default Button;
