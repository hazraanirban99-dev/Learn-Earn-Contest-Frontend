import React, { useState } from 'react';
import { FiX, FiUser, FiEdit2, FiEye, FiEyeOff, FiCheckCircle, FiFileText } from 'react-icons/fi';
import { Logo } from '../index'; // Ensure generic Logo works or just text

const ProfileModal = ({ isOpen, onClose }) => {
    const [showPassword, setShowPassword] = useState(false);

    // Mock User Data for form
    const [formData, setFormData] = useState({
        fullName: 'Alexander Desun',
        username: 'scholar_alex',
        password: 'password123',
        contactNumber: '+1 (555) 000-8266',
        email: 'alexander@desun.academy',
        address: ''
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            {/* Click Outside Handler */}
            <div className="fixed inset-0" onClick={onClose}></div>

            {/* Modal Card */}
            <div className="relative w-full max-w-[500px] bg-white rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 mt-10 mb-10">
                
                {/* Header Section */}
                <div className="flex items-center justify-between p-6 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                           {/* Quick mock crest or Logo */}
                           <span className="text-xs font-black">D</span>
                        </div>
                        <h2 className="text-xl font-black text-slate-800">Scholar Workspace</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-slate-800 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Body Area (Scrollable if needed) */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-8">
                    
                    {/* Avatar Block */}
                    <div className="flex flex-col items-center justify-center mt-4 mb-10">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full border-[3px] border-[#8cc63f]/30 p-1 bg-white">
                                <img 
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=f8faf2" 
                                    className="w-full h-full rounded-full object-cover"
                                    alt="Avatar"
                                />
                            </div>
                            <button className="absolute bottom-0 right-0 w-7 h-7 bg-[#8cc63f] border-2 border-white rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md">
                                <FiEdit2 size={12} />
                            </button>
                        </div>
                        <h3 className="text-[#5c8a14] text-[10px] font-black uppercase tracking-[0.15em] mt-4">
                            Scholar Profile
                        </h3>
                    </div>

                    {/* Personal Info Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-slate-700">
                                <FiUser size={16} />
                                <h4 className="font-bold text-sm tracking-wide">Personal Info</h4>
                            </div>
                            <button className="text-gray-400 hover:text-[#8cc63f] transition-colors"><FiEdit2 size={14}/></button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-[10px] font-bold text-gray-500 mb-1.5 ml-1">Full Name</label>
                                    <input 
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full bg-[#f8faf2] rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#8cc63f]/30 transition-all border border-transparent hover:border-gray-100"
                                    />
                                </div>
                                <div className="flex-1 relative">
                                    <label className="block text-[10px] font-bold text-gray-500 mb-1.5 ml-1">Username</label>
                                    <div className="relative flex items-center">
                                        <input 
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="w-full bg-[#f8faf2] rounded-xl px-4 py-3 pr-20 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#8cc63f]/30 transition-all border border-transparent hover:border-gray-100"
                                        />
                                        <span className="absolute right-3 px-2 py-1 bg-[#8cc63f]/20 text-[#5c8a14] rounded-md text-[8px] font-black tracking-wider uppercase flex items-center gap-1">
                                            <FiCheckCircle size={10} /> Verified
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 ml-1">Password</label>
                                <div className="relative flex items-center">
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-[#f8faf2] rounded-xl px-4 py-3 text-sm font-black text-slate-800 outline-none focus:ring-2 focus:ring-[#8cc63f]/30 transition-all border border-transparent hover:border-gray-100 tracking-widest placeholder:tracking-normal"
                                        placeholder="Enter password"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 text-gray-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Details Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-slate-700">
                                <FiFileText size={16} />
                                <h4 className="font-bold text-sm tracking-wide">Contact Details</h4>
                            </div>
                            <button className="text-gray-400 hover:text-[#8cc63f] transition-colors"><FiEdit2 size={14}/></button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-[10px] font-bold text-gray-500 mb-1.5 ml-1">Contact Number</label>
                                    <input 
                                        type="tel"
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={handleChange}
                                        className="w-full bg-[#f8faf2] rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#8cc63f]/30 transition-all border border-transparent hover:border-gray-100"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-[10px] font-bold text-gray-500 mb-1.5 ml-1">Email Address</label>
                                    <input 
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-[#f8faf2] rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#8cc63f]/30 transition-all border border-transparent hover:border-gray-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 ml-1">Home Address</label>
                                <input 
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full bg-[#f8faf2] rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#8cc63f]/30 transition-all border border-transparent hover:border-gray-100"
                                    placeholder="Enter your address"
                                />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Section (Light Green bg) */}
                <div className="bg-[#f8faf2] px-6 py-6 flex items-center justify-end gap-6 shrink-0 relative z-20 shadow-[0_-10px_20px_rgba(248,250,242,1)]">
                    <button 
                        onClick={onClose}
                        className="text-[#5c8a14] font-black text-xs uppercase tracking-widest hover:text-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        className="bg-gradient-to-r from-[#8cc63f] to-[#e6d013] hover:brightness-105 text-slate-900 rounded-xl px-8 py-3.5 font-black text-[11px] uppercase tracking-widest shadow-lg shadow-[#8cc63f]/30 transition-all active:scale-95"
                    >
                        Save Changes
                    </button>
                </div>
            </div>

            <style jsx="true">{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #ecf0e6; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default ProfileModal;
