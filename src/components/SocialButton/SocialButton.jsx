// ============================================================
// SocialButton.jsx — Circular social media link buttons
// Icon selection logic dynamically handle kore (GitHub, LinkedIn, Twitter).
// Premium hover styles with background shifts.
// ============================================================

import React from 'react';

const SocialButton = ({ text, onClick, icon: Icon, iconColor = "" }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-1 items-center justify-center gap-2 border border-gray-200/80 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:bg-gray-800 transition-all font-semibold text-gray-800 dark:text-gray-200 text-sm active:scale-95 shadow-sm"
    >
      {Icon && <Icon size={18} className={iconColor} />}
      {text}
    </button>
  );
};

export default SocialButton;
