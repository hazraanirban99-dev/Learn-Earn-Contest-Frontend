// ============================================================
// PortalInput.jsx — Specialized input for Admin Modals
// Compact design with borderless-like focused states.
// Direct prop mapping for clean value binding in Edit Modals.
// ============================================================

import React from 'react';

const PortalInput = React.memo(({ label, id, value, onChange, placeholder, icon: Icon, subNote, type = 'text', rightElement, borderColor }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label htmlFor={id} className="text-[11px] font-black uppercase tracking-widest text-gray-400">
        {label}
      </label>
    )}
    <div className="relative group">
      <div className={`flex items-center bg-[#f1f8e8] border-2 ${borderColor || 'border-transparent focus-within:border-[#8cc63f]/40'} focus-within:bg-white rounded-2xl transition-all shadow-sm overflow-hidden`}>
        {Icon && (
          <div className="pl-4 pr-2 text-gray-400 pointer-events-none shrink-0">
            <Icon size={17} />
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`flex-1 py-4 outline-none bg-transparent text-slate-800 font-bold text-sm placeholder-gray-300 ${!Icon ? 'px-5' : 'pr-4'}`}
        />
        {rightElement && <div className="pr-3 shrink-0">{rightElement}</div>}
      </div>
    </div>
    {subNote && (
      <p className="text-[10px] text-[#fbc111] font-bold mt-1.5 px-1 flex items-center gap-1 uppercase tracking-wider">
        📌 {subNote}
      </p>
    )}
  </div>
));

export default PortalInput;
