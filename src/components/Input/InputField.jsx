import React from 'react';

const InputField = ({ label, type, name, value, onChange, placeholder, icon: Icon, required }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full mb-4">
      <label className="text-xs font-bold text-gray-800 tracking-wide">{label}</label>
      <div className="flex items-center rounded-lg bg-[#f4f7eb] focus-within:ring-2 focus-within:ring-[#8cc63f] overflow-hidden transition-all h-[52px]">
        {Icon && (
          <div className="pl-4 pr-3 flex items-center justify-center text-gray-400">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`flex-1 py-3 outline-none bg-transparent w-full text-gray-600 text-sm font-medium ${!Icon ? 'pl-4' : ''} placeholder:text-gray-400`}
        />
      </div>
    </div>
  );
};

export default InputField;
