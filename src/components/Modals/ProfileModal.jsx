// ============================================================
// ProfileModal.jsx — Student er profile edit korar modal
// Navbar theke avatar click korle ei modal khule.
// AuthContext theke current user data pre-fill hoy form e.
// Student name, phone, address, domain (interested in), gender edit korte parbe.
// Avatar upload optional — file select korle preview dekhano hoy.
// Save click hole multipart/form-data diye PATCH /users/profile call hoy.
// Success hole AuthContext er updateUser() call hoy — sob jagay instantly update hobe.
// Email readonly — backend theke verified, tai change kora jay na.
// ============================================================

import React, { useState, useEffect } from 'react';
import { FiX, FiUser, FiEdit2, FiCheckCircle, FiFileText, FiMapPin, FiMail, FiPhone, FiBookOpen, FiLoader } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { Logo, InputField, Button, Loader } from '../index';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const ProfileModal = ({ isOpen, onClose }) => {
    const { user, updateUser } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [previewPic, setPreviewPic] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);

    const [formData, setFormData] = useState({
        fullName: '',
        contactNumber: '',
        email: '',
        address: '',
        interestedIn: 'MERN',
        gender: 'Male'
    });

    // Populate data when user changes or modal opens
    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                fullName: user.name || '',
                contactNumber: user.contactNumber || '',
                email: user.email || '',
                address: user.address || '',
                interestedIn: user.domain === 'MERN' ? 'MERN' : user.domain === 'UI/UX' ? 'UI/UX' : 'Digital Marketing',
                gender: user.gender || 'Male'
            });
            setPreviewPic(user.avatar?.url || null);
        }
    }, [user, isOpen]);

    // Disable body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            // Cleanup on close
            return () => { document.body.style.overflow = 'unset'; };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewPic(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        document.getElementById('profile-pic-input').click();
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const domainMapping = {
                'MERN': 'MERN',
                'UI/UX': 'UI/UX',
                'Digital Marketing': 'DIGITAL MARKETING'
            };

            const data = new FormData();
            data.append('name', formData.fullName);
            data.append('contactNumber', formData.contactNumber);
            data.append('address', formData.address);
            data.append('gender', formData.gender);
            data.append('domain', domainMapping[formData.interestedIn] || formData.interestedIn);

            if (avatarFile) {
                data.append('avatar', avatarFile);
            }

            const response = await api.patch('/users/profile', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                updateUser(response.data.data);
                toast.success("Profile updated successfully!");
                onClose();
            }
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error(error.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-start justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto scroll-smooth py-10 lg:py-20">
            {/* Click Outside Handler */}
            <div className="fixed inset-0" onClick={onClose}></div>

            {/* Modal Card */}
            <div className="relative w-full max-w-[500px] bg-white dark:bg-gray-800 rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 mt-4 mb-4">

                {/* Header Section */}
                <div className="flex items-center justify-between p-6 pb-2">
                    <div className="flex items-center gap-3">

                        <h2 className="text-xl font-black text-slate-800 dark:text-gray-100">Scholar Workspace</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-slate-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-full transition-colors"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Body Area - No internal scrollbar, scrolls with backdrop */}
                <div className="px-6 pb-8">

                    {/* Avatar Block */}
                    <div className="flex flex-col items-center justify-center mt-4 mb-8">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full border-[3px] border-[#8cc63f]/30 p-1 bg-white dark:bg-gray-800 shadow-inner overflow-hidden flex items-center justify-center">
                                {previewPic ? (
                                    <img
                                        src={previewPic}
                                        className="w-full h-full rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        alt="Avatar"
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#8cc63f] to-[#5c8a14] flex items-center justify-center text-white text-2xl font-black">
                                        {formData.fullName ? formData.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'S'}
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                id="profile-pic-input"
                                className="hidden"
                                accept="image/*"
                                onChange={handleProfilePicChange}
                            />
                            <button
                                onClick={triggerFileInput}
                                className="absolute bottom-0 right-0 w-8 h-8 bg-[#8cc63f] border-2 border-white rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg z-10"
                                title="Upload from your device"
                            >
                                <FiEdit2 size={13} />
                            </button>
                        </div>

                        <div className="text-center mt-4 px-8">
                            <h3 className="text-[#5c8a14] text-[10px] font-black uppercase tracking-[0.15em] mb-2">
                                Scholar Profile
                            </h3>
                            <p className="text-[10px] font-bold text-red-500 leading-tight italic">
                                * Note: A profile picture is mandatory for participation and awards.
                            </p>
                        </div>
                    </div>

                    {/* Personal Info Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300">
                                <FiUser size={16} />
                                <h4 className="font-bold text-sm tracking-wide">Personal Info</h4>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <InputField
                                label="Full Name"
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                icon={FiUser}
                            />

                            <div className="flex flex-col sm:flex-row gap-4">
                                <InputField
                                    label="Interested In"
                                    type="select"
                                    name="interestedIn"
                                    value={formData.interestedIn}
                                    onChange={handleChange}
                                    icon={FiBookOpen}
                                    options={['MERN', 'UI/UX', 'Digital Marketing']}
                                    disabled={user?.role === 'admin'}
                                />

                                <div className="flex flex-col gap-1.5 w-full mb-4">
                                    <label className="text-[11px] font-bold text-gray-800 dark:text-gray-200 tracking-tight uppercase">Gender</label>
                                    <div className="flex items-center gap-4 bg-[#f4f7eb] dark:bg-gray-800/60 rounded-lg px-4 h-13">
                                        {['Male', 'Female', 'Other'].map(g => (
                                            <label key={g} className="flex items-center gap-1.5 cursor-pointer text-[12px] font-bold text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value={g}
                                                    checked={formData.gender === g}
                                                    onChange={() => setFormData(prev => ({ ...prev, gender: g }))}
                                                    className="w-3.5 h-3.5 text-[#8cc63f] focus:ring-[#8cc63f] accent-[#8cc63f] cursor-pointer"
                                                />
                                                {g[0]}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Details Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300">
                                <FiFileText size={16} />
                                <h4 className="font-bold text-sm tracking-wide">Contact Details</h4>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                    label="Contact Number"
                                    type="tel"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    placeholder="+91 98765 43210"
                                    icon={FiPhone}
                                />
                                <div className="flex flex-col gap-1.5 w-full mb-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[11px] font-bold text-gray-800 dark:text-gray-200 tracking-tight uppercase">Email Address</label>
                                        <span className="px-2 py-0.5 bg-[#8cc63f]/10 text-[#5c8a14] border border-[#8cc63f]/20 rounded-md text-[8px] font-black tracking-wider uppercase flex items-center gap-1">
                                            <FiCheckCircle size={10} /> Verified
                                        </span>
                                    </div>
                                    <div className="relative flex items-center h-[52px] rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 px-4">
                                        <span className="text-[12px] font-bold text-gray-400 dark:text-gray-300 select-none truncate">{formData.email}</span>
                                    </div>
                                </div>
                            </div>

                            <InputField
                                label="Home Address"
                                type="textarea"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter your address"
                                icon={FiMapPin}
                            />
                        </div>
                    </div>

                </div>

                {/* Footer Section */}
                <div className="bg-[#f8faf2] dark:bg-gray-900/80 px-6 py-6 flex items-center justify-end gap-6 shrink-0 relative z-20 shadow-[0_-10px_20px_rgba(240,244,230,0.5)] dark:shadow-[0_-10px_20px_rgba(15,23,42,0.5)] border-t border-gray-100/50 dark:border-gray-700/50">
                    <button
                        onClick={onClose}
                        className="text-[#5c8a14] dark:text-[#8cc63f] font-black text-xs uppercase tracking-widest hover:text-slate-800 dark:hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-gradient-to-r from-[#8cc63f] to-[#e6d013] hover:brightness-105 text-slate-900 dark:text-gray-100 rounded-xl px-8 py-3.5 font-black text-[11px] uppercase tracking-widest shadow-lg shadow-[#8cc63f]/30 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <>
                                <Loader size="xs" text={false} />
                                <span>Saving...</span>
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
