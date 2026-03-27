import React from 'react';
import { FiChevronDown } from 'react-icons/fi';

const InputField = ({ label, type, name, value, onChange, placeholder, icon: Icon, required, options, labelRight }) => {
  const isTextArea = type === 'textarea';

  return (
    <div className="flex flex-col gap-1.5 w-full mb-4">
      <div className="flex justify-between items-center">
        <label className="text-[11px] font-bold text-gray-800 tracking-tight uppercase">{label}</label>
        {labelRight && <div className="text-[10px] font-bold text-[#689c19] hover:underline cursor-pointer">{labelRight}</div>}
      </div>
      <div className={`flex rounded-lg bg-[#f4f7eb] focus-within:ring-2 focus-within:ring-[#8cc63f] overflow-hidden transition-all relative ${isTextArea ? 'min-h-25 items-start pt-4' : 'h-13 items-center'}`}>
        {Icon && (
          <div className={`pl-4 pr-3 flex items-center justify-center text-gray-400 pointer-events-none ${isTextArea ? 'mt-0.5' : ''}`}>
            <Icon size={18} />
          </div>
        )}
        
        {type === 'select' ? (
          <>
            <select
              name={name}
              value={value}
              onChange={onChange}
              required={required}
              className={`flex-1 py-3 outline-none bg-transparent w-full text-gray-600 text-sm font-medium appearance-none ${!Icon ? 'pl-4' : ''} pr-10 cursor-pointer`}
            >
              <option value="" disabled hidden>{placeholder || "Select an option"}</option>
              {options && options.map((opt) => (
                <option key={opt} value={opt} className="bg-white text-gray-800">
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
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`flex-1 outline-none bg-transparent w-full text-gray-600 text-sm font-medium ${!Icon ? 'pl-4' : ''} placeholder:text-gray-400 resize-none pr-4 min-h-22.5 pt-1`}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`flex-1 py-3 outline-none bg-transparent w-full text-gray-600 text-sm font-medium ${!Icon ? 'pl-4' : ''} placeholder:text-gray-400`}
          />
        )}
      </div>
    </div>
  );
};

export default InputField;
