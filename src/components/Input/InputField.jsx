// ============================================================
// InputField.jsx — Shared input component with custom icons
// Label, Placeholder, Type, r Icon props handle kora hoy.
// Border status (success/error) dynamically apply kora jay.
// Focus states e glow effect build kora ache premium look er jonno.
// ============================================================

import React, { useState } from 'react';
import { FiChevronDown, FiEye, FiEyeOff } from 'react-icons/fi';

const InputField = React.memo(React.forwardRef(({ label, type, name, value, onChange, placeholder, icon: Icon, required, options, labelRight, onLabelRightClick, ...props }, ref) => {
  const isTextArea = type === 'textarea';
  const isPassword = type === 'password';
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1.5 w-full mb-4">
      <div className="flex justify-between items-center">
        <label className="text-[11px] font-bold text-gray-800 dark:text-gray-200 tracking-tight uppercase">{label}</label>
        {labelRight && <button type="button" onClick={onLabelRightClick} className="text-[10px] font-bold text-[#689c19] hover:underline cursor-pointer bg-transparent border-0 p-0">{labelRight}</button>}
      </div>
      <div className={`flex rounded-lg bg-[#f4f7eb] dark:bg-slate-900 focus-within:bg-white dark:focus-within:bg-gray-800 focus-within:ring-2 focus-within:ring-[#8cc63f] overflow-hidden transition-all relative ${isTextArea ? 'min-h-25 items-start pt-4' : 'h-13 items-center'}`}>
        {Icon && (
          <div className={`pl-4 pr-3 flex items-center justify-center text-gray-400 pointer-events-none ${isTextArea ? 'mt-0.5' : ''}`}>
            <Icon size={18} />
          </div>
        )}
        
        {type === 'select' ? (
          <>
            <select
              ref={ref}
              name={name}
              value={value}
              onChange={onChange}
              required={required}
              className={`flex-1 py-3 outline-none bg-transparent w-full text-gray-600 dark:text-gray-200 focus:text-black dark:focus:text-gray-100 text-base sm:text-sm font-medium appearance-none ${!Icon ? 'pl-4' : ''} pr-10 cursor-pointer`}
            >
              <option value="" disabled hidden>{placeholder || "Select an option"}</option>
              {options && options.map((opt) => (
                <option key={opt} value={opt} className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                  {opt}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <FiChevronDown size={18} />
            </div>
          </>
        ) : isTextArea ? (
          <textarea
            ref={ref}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`flex-1 outline-none bg-transparent w-full text-gray-600 dark:text-gray-200 focus:text-black dark:focus:text-gray-100 text-base sm:text-sm font-medium ${!Icon ? 'pl-4' : ''} placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none pr-4 min-h-22.5 pt-1`}
          />
        ) : (
          <div className="flex-1 flex items-center pr-4 relative">
            <input
              ref={ref}
              type={isPassword ? (showPassword ? 'text' : 'password') : type}
              name={name}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              required={required}
              className={`flex-1 py-3 outline-none bg-transparent w-full text-gray-600 dark:text-gray-200 focus:text-black dark:focus:text-gray-100 text-base sm:text-sm font-medium ${!Icon ? 'pl-4' : ''} placeholder:text-gray-400 dark:placeholder:text-gray-500`}
              {...props}
            />
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-[#8cc63f] transition-colors focus:outline-none cursor-pointer"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}));

export default InputField;
