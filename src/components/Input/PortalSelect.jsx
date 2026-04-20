// ============================================================
// PortalSelect.jsx — Reusable dropdown select for modals
// Options list pass korle dynamic render kore.
// Icon support with FiChevronDown integration for consistent UI.
// ============================================================

import React from 'react';
import { FiChevronDown } from 'react-icons/fi';

const PortalSelect = React.memo(({ label, value, onChange, options, placeholder, id }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-[11px] font-black uppercase tracking-widest text-gray-400">
      {label}
    </label>
    <div className="relative group">
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full bg-[#f1f8e8] border-2 border-transparent focus:border-[#8cc63f]/40 focus:bg-white dark:focus:bg-gray-900 dark:bg-gray-800 rounded-2xl px-5 py-4 text-slate-800 dark:text-gray-100 font-bold appearance-none outline-none transition-all cursor-pointer shadow-sm text-sm"
      >
        <option value="" disabled hidden>{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#8cc63f]">
        <FiChevronDown size={18} strokeWidth={3} />
      </div>
    </div>
  </div>
));

export default PortalSelect;
