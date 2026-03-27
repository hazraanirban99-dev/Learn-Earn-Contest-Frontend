import React from 'react';

const Button = ({ text, onClick, variant = 'primary', disabled, type = 'button', icon: Icon, className = "" }) => {
  const baseStyle = "flex items-center justify-center gap-2 cursor-pointer font-bold px-6 py-[14px] rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed w-full";
  
  const variants = {
    primary: "bg-gradient-to-r from-[#8cc63f] to-[#fbc111] hover:from-[#7eb036] hover:to-[#e0ad0c] text-white tracking-wide text-[15px]",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
    danger: "bg-red-500 hover:bg-red-600 text-white"
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`}
    >
      {text}
      {Icon && <Icon size={18} />}
    </button>
  );
};

export default Button;
