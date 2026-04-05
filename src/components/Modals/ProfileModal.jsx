import React, { useState, useEffect } from 'react';
import { FiX, FiUser, FiEdit2, FiCheckCircle, FiFileText, FiMapPin, FiMail, FiPhone, FiBookOpen, FiLoader } from 'react-icons/fi';
import { Logo, InputField, Button } from '../index';

const ProfileModal = ({ isOpen, onClose }) => {
    const [isSaving, setIsSaving] = useState(false);
    const [profilePic, setProfilePic] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=f8faf2");

    // Mock User Data for form
    const [formData, setFormData] = useState({
        fullName: 'Alexander Desun',
        username: 'scholar_alex',
        contactNumber: '+1 (555) 000-8266',
        email: 'alexander@desun.academy',
        address: '',
        interestedIn: 'Web Development',
        gender: 'Male'
    });

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
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        document.getElementById('profile-pic-input').click();
    };

    const handleSave = async () => {
        setIsSaving(true);

        // =========================================================================
        // 🚀 BACKEND API INTEGRATION: UPDATE PROFILE (SIMULATED)
        // =========================================================================
        /*
        try {
            const profileData = { ...formData, profilePic };
            const response = await fetch('http://YOUR_BACKEND_URL/api/v1/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(profileData)
            });

            if (response.ok) {
                alert("Profile updated successfully!");
                onClose();
            } else {
                alert("Failed to update profile.");
            }
        } catch (error) {
            console.error("API Error:", error);
            alert("Something went wrong with the server.");
        } finally {
            setIsSaving(false);
        }
        */

        // MOCK BEHAVIOR (DELETE THIS WHEN API IS READY):
        setTimeout(() => {
            setIsSaving(false);
            alert("✅ Success! Your profile information has been saved to the backend.\n\nNote: This is a simulated backend response for your review.");
            onClose(); // Optional: Close modal on success
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-start justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto scroll-smooth py-10 lg:py-20">
            {/* Click Outside Handler */}
            <div className="fixed inset-0" onClick={onClose}></div>

            {/* Modal Card */}
            <div className="relative w-full max-w-[500px] bg-white rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 mt-4 mb-4">

                {/* Header Section */}
                <div className="flex items-center justify-between p-6 pb-2">
                    <div className="flex items-center gap-3">

                        <h2 className="text-xl font-black text-slate-800">Scholar Workspace</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-slate-800 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Body Area - No internal scrollbar, scrolls with backdrop */}
                <div className="px-6 pb-8">

                    {/* Avatar Block */}
                    <div className="flex flex-col items-center justify-center mt-4 mb-8">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full border-[3px] border-[#8cc63f]/30 p-1 bg-white shadow-inner overflow-hidden">
                                <img
                                    src={profilePic}
                                    className="w-full h-full rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    alt="Avatar"
                                />
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
                            <div className="flex items-center gap-2 text-slate-700">
                                <FiUser size={16} />
                                <h4 className="font-bold text-sm tracking-wide">Personal Info</h4>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                    label="Full Name"
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                    icon={FiUser}
                                />

                                <div className="flex flex-col gap-1.5 w-full mb-4">
                                    <label className="text-[11px] font-bold text-gray-800 tracking-tight uppercase">Username</label>
                                    <div className="relative flex items-center h-[52px] rounded-lg bg-gray-50 border border-gray-100 px-4">
                                        <span className="text-sm font-medium text-gray-400 select-none">{formData.username}</span>
                                        <span className="absolute right-3 px-2 py-1 bg-[#8cc63f]/10 text-[#5c8a14] border border-[#8cc63f]/20 rounded-md text-[8px] font-black tracking-wider uppercase flex items-center gap-1">
                                            <FiCheckCircle size={10} /> Verified
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <InputField
                                    label="Interested In"
                                    type="select"
                                    name="interestedIn"
                                    value={formData.interestedIn}
                                    onChange={handleChange}
                                    icon={FiBookOpen}
                                    options={['Web Development', 'UI/UX', 'Digital Marketing']}
                                />

                                <div className="flex flex-col gap-1.5 w-full mb-4">
                                    <label className="text-[11px] font-bold text-gray-800 tracking-tight uppercase">Gender</label>
                                    <div className="flex items-center gap-4 bg-[#f4f7eb] rounded-lg px-4 h-13">
                                        {['Male', 'Female', 'Other'].map(g => (
                                            <label key={g} className="flex items-center gap-1.5 cursor-pointer text-[12px] font-bold text-slate-600 hover:text-slate-900 transition-colors">
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
                            <div className="flex items-center gap-2 text-slate-700">
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
                                    placeholder="+1 (555) 000-8266"
                                    icon={FiPhone}
                                />
                                <InputField
                                    label="Email Address"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="alexander@desun.academy"
                                    icon={FiMail}
                                />
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
                <div className="bg-[#f8faf2] px-6 py-6 flex items-center justify-end gap-6 shrink-0 relative z-20 shadow-[0_-10px_20px_rgba(240,244,230,0.5)]">
                    <button
                        onClick={onClose}
                        className="text-[#5c8a14] font-black text-xs uppercase tracking-widest hover:text-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-gradient-to-r from-[#8cc63f] to-[#e6d013] hover:brightness-105 text-slate-900 rounded-xl px-8 py-3.5 font-black text-[11px] uppercase tracking-widest shadow-lg shadow-[#8cc63f]/30 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <>
                                <FiLoader className="animate-spin" size={14} />
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
