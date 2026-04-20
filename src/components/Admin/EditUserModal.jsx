// ============================================================
// EditUserModal.jsx — ManageUsers page e "Edit" click korle khule
// Admin user er name, domain, email, phone, registration date edit korte parbe.
// formData state e current user data pre-fill hoy (prop theke)
// Save click korle UserContext er updateUser() callback theke update hoy.
// Ekhane avatar camera button ache kintu currently functional na (UI only).
// ============================================================

import React, { useState } from 'react';
import { FiX, FiCheckCircle, FiCalendar, FiShield, FiEdit3, FiCamera } from 'react-icons/fi';

const EditUserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...user });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-800 w-full max-w-[700px] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative animate-in zoom-in-95 duration-300 max-h-[95vh] md:max-h-[85vh] overflow-y-auto">
        
        {/* Left Sidebar Info */}
        <div className="bg-[#f2f7e7] dark:bg-gray-900/50 w-full md:w-[260px] p-8 flex flex-col justify-between hidden md:flex shrink-0 border-r border-transparent dark:border-gray-800">
          <div>
            <div className="bg-white dark:bg-gray-800 w-10 h-10 rounded-xl flex items-center justify-center text-[#8cc63f] mb-6 shadow-sm border border-gray-100/50">
              <FiEdit3 size={20} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-gray-100 tracking-tight leading-none mb-4">Edit Profile</h3>
            <p className="text-sm font-bold text-gray-500/80 dark:text-gray-400 leading-relaxed max-w-[200px]">
              "Refining the details of our future innovators."
            </p>
          </div>

          <div className="flex items-center gap-2 text-[#8cc63f] font-black text-xs tracking-widest uppercase">
            <FiShield size={14} />
            <span>Admin Authorized</span>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-5 sm:p-8 md:p-10 relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-slate-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 rounded-full transition-all"
          >
            <FiX size={18} />
          </button>

          {/* User Preview Header */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100 dark:border-gray-700">
            <div className="relative">
              <img src={formData.avatar} alt="Avatar" className="w-16 h-16 rounded-2xl object-cover shadow-sm mb-1" />
              <button className="absolute -bottom-2 -right-2 bg-[#8cc63f] text-white p-1.5 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform">
                 <FiCamera size={12} />
              </button>
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-900 dark:text-gray-100 tracking-tight">{formData.name}</h4>
              <p className="text-xs text-gray-500 font-bold">Member since {formData.registrationDate.split('/')[2] || '2023'}</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-8">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Scholar Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name} 
                onChange={handleChange}
                className="w-full bg-[#f8faea]/50 dark:bg-gray-800 border border-[#e8efe0] dark:border-gray-700 px-4 py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8cc63f]/20 focus:border-[#8cc63f] transition-all"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Domain Discipline</label>
              <div className="relative">
                <select 
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  className="w-full bg-[#f8faea]/50 dark:bg-gray-800 border border-[#e8efe0] dark:border-gray-700 px-4 py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8cc63f]/20 focus:border-[#8cc63f] transition-all appearance-none pr-10"
                >
                  <option value="UI/UX Design" className="bg-white text-slate-900 dark:bg-gray-800 dark:text-gray-100">UI/UX Design</option>
                  <option value="Development" className="bg-white text-slate-900 dark:bg-gray-800 dark:text-gray-100">Development</option>
                  <option value="Marketing" className="bg-white text-slate-900 dark:bg-gray-800 dark:text-gray-100">Marketing</option>
                  <option value="Strategy" className="bg-white text-slate-900 dark:bg-gray-800 dark:text-gray-100">Strategy</option>
                </select>
                <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email} 
                onChange={handleChange}
                className="w-full bg-[#f8faea]/50 dark:bg-gray-800 border border-[#e8efe0] dark:border-gray-700 px-4 py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8cc63f]/20 focus:border-[#8cc63f] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Phone Number</label>
              <input 
                type="text" 
                name="phone"
                value={formData.phone} 
                onChange={handleChange}
                className="w-full bg-[#f8faea]/50 dark:bg-gray-800 border border-[#e8efe0] dark:border-gray-700 px-4 py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8cc63f]/20 focus:border-[#8cc63f] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Registration Date</label>
              <div className="relative">
                 <input 
                  type="text" 
                  name="registrationDate"
                  value={formData.registrationDate} 
                  onChange={handleChange}
                  className="w-full bg-[#f8faea]/50 dark:bg-gray-800 border border-[#e8efe0] dark:border-gray-700 px-4 py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8cc63f]/20 focus:border-[#8cc63f] transition-all pr-10"
                />
                <FiCalendar className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 mt-8">
             {/* Mobile Admin Authorize inside bottom right for small screens if needed, but left sidebar handles it for MD */}
            <button 
              onClick={onClose}
              className="px-6 py-3 sm:py-3.5 text-sm font-bold text-gray-600 hover:text-slate-900 dark:text-gray-100 transition-colors w-full sm:w-auto text-center"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="bg-[#5c8a14] hover:bg-[#4d7310] text-white px-6 py-3 sm:py-3.5 rounded-xl text-sm font-bold tracking-wide flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-[#8cc63f]/20 w-full sm:w-auto"
            >
              <span>Save Changes</span>
              <FiCheckCircle size={16} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
