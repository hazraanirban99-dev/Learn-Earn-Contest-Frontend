// ============================================================
// SubmitContestModal.jsx — Student er project submit korar modal
// StudentSubmission page theke "Submit Project" click korle khule.
// Student ta dite parbe: project image, project file, GitHub link, Live link, Drive link.
// Submit click korle ConfirmToast dekhano hoy (double confirmation).
// Confirmed hole multipart/form-data diye backend e POST hoy.
// Success hole user data refresh kora hoy (submittedContests sync er jonno)
// tahole ContestDetails page e "Response Submitted" badge dekhabe.
// ============================================================

import React, { useState, useCallback, useMemo } from 'react';
import { FiX, FiSend, FiImage, FiFileText, FiLink2, FiGithub, FiGlobe, FiUser, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import DropZone from '../Input/DropZone';
import PortalInput from '../Input/PortalInput';
import Button from '../Button/Button';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const SubmitContestModal = ({ isOpen, onClose, contest, onSuccess }) => {
    const { updateUser } = useAuth();
    const [projectPic, setProjectPic] = useState(null);
    const [projectFile, setProjectFile] = useState(null);
    const [githubLink, setGithubLink] = useState('');
    const [liveLink, setLiveLink] = useState('');
    const [driveLink, setDriveLink] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isFormValid = useMemo(() => {
        // At least one thing should be provided (thumbnail, link or file)
        if (!projectPic && !githubLink.trim() && !liveLink.trim() && !driveLink.trim() && !projectFile) return false;
        return true;
    }, [projectPic, projectFile, githubLink, liveLink, driveLink]);

    const performFinalSubmit = async () => {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('contestId', contest?.id);
        if (projectPic) formData.append('projectPic', projectPic);
        if (projectFile) formData.append('projectFile', projectFile);
        if (githubLink) formData.append('githubLink', githubLink);
        if (liveLink) formData.append('liveLink', liveLink);
        if (driveLink) formData.append('driveLink', driveLink);

        try {
            const response = await api.post('/student/contests/submit', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                // Refresh user data to show "Response Submitted" status immediately
                const userRes = await api.get('/users/me');
                if (userRes.data.success) {
                    updateUser(userRes.data.data);
                }

                toast.dismiss(); // Close the confirmation toast
                toast.success('Project Submitted Successfully! 🎉');
                onSuccess();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong during submission.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = () => {
        if (!isFormValid) {
            toast.error('Properly submit your work as per rule, if you submit wrong input then you will be disqualified.', {
                position: "top-right",
                autoClose: 5000,
                theme: "colored"
            });
            return;
        }

        const ConfirmToast = ({ closeToast }) => (
            <div className="p-1">
                <p className="text-[12px] font-black text-slate-800 mb-4 uppercase tracking-tight leading-tight">
                   Are you sure you have submitted all files correctly according to the rules?
                </p>
                <div className="flex justify-end gap-2">
                    <button 
                        onClick={closeToast}
                        className="bg-gray-100 text-gray-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => {
                            performFinalSubmit();
                        }}
                        className="bg-[#8cc63f] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#7ab332] shadow-lg shadow-[#8cc63f]/20"
                    >
                        Confirm Submit
                    </button>
                </div>
            </div>
        );

        toast.info(<ConfirmToast />, {
            position: "top-right",
            autoClose: false,
            closeOnClick: false,
            draggable: false,
            theme: "light",
            icon: false
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm shadow-2xl">
            <div className="fixed inset-0" onClick={onClose}></div>
            
            <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-300 h-auto max-h-[90vh]">
                
                 {/* Left Sidebar (Desktop Only) */}
                 <div className="hidden lg:flex w-2/5 bg-[#4a7010] p-10 flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10 text-left">
                        <h2 className="text-white text-sm font-black tracking-widest uppercase mb-12">Desun Academy</h2>
                        <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight mt-12 mb-2">
                            Submit Your Response
                        </h1>
                        <p className="text-[#ecf0e6] font-medium text-sm mt-4">
                            Submit your project for "{contest?.title || contest?.name || 'Contest'}". Ensure all links and documents are publicly accessible.
                        </p>
                    </div>

                    <div className="relative z-10 bg-black/20 p-5 rounded-2xl border border-white/10 mt-8">
                        <h4 className="text-[10px] font-black text-[#fbc111] uppercase tracking-widest mb-3 flex items-center gap-2">
                            <FiFileText size={12} /> Submission Rules
                        </h4>
                        <ul className="space-y-3">
                            <li className="text-[11px] text-white font-medium leading-relaxed">
                                <span className="font-black text-[#8cc63f]">MERN:</span> Upload GitHub link / Live deployment link
                            </li>
                            <li className="text-[11px] text-white font-medium leading-relaxed">
                                <span className="font-black text-[#8cc63f]">UI-UX:</span> Upload Image / Figma or Canva link / Project File
                            </li>
                            <li className="text-[11px] text-white font-medium leading-relaxed">
                                <span className="font-black text-[#8cc63f]">MARKETING:</span> Upload Image / Google Drive link
                            </li>
                        </ul>
                    </div>

                    {/* Subtle aesthetic gradient overlay */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                </div>

                <div className="w-full md:w-3/5 bg-white relative flex flex-col h-full max-h-[90vh]">
                    <div className="p-6 md:p-8 shrink-0 relative border-b border-gray-100">
                        <button 
                            onClick={onClose}
                            className="absolute top-6 right-6 text-gray-400 hover:text-slate-800 transition-colors p-2 rounded-full hover:bg-gray-100 z-20"
                        >
                            <FiX size={24} />
                        </button>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Submission Details</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 custom-scrollbar">
                        <div className="space-y-8">
                            
                            {/* Mobile/Tab Rules (Visible until Large screens) */}
                            <div className="lg:hidden bg-[#f8faf2] p-4 rounded-2xl border border-[#8cc63f]/20 mb-2">
                                <h4 className="text-[9px] font-black text-[#6b8f36] uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <FiFileText size={12} /> Submission Rules
                                </h4>
                                <ul className="space-y-1.5">
                                    <li className="text-[10px] text-slate-600 font-bold">
                                        • <span className="text-[#8cc63f]">MERN:</span> GitHub / Live link
                                    </li>
                                    <li className="text-[10px] text-slate-600 font-bold">
                                        • <span className="text-[#8cc63f]">UI-UX:</span> Image / Figma / Project File
                                    </li>
                                    <li className="text-[10px] text-slate-600 font-bold">
                                        • <span className="text-[#8cc63f]">MARKETING:</span> Image / Drive link
                                    </li>
                                </ul>
                            </div>

                            {/* Divider line (desktop only) */}
                            <div className="hidden lg:block h-[2px] w-full bg-gradient-to-r from-[#8cc63f]/20 to-transparent rounded-full" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                                <div className="space-y-3">
                                    <DropZone
                                        id="project-pic-upload"
                                        label="Project Image"
                                        accept="image/png, image/jpeg"
                                        icon={FiImage}
                                        hint="Drop Logo/SS here"
                                        note="Max 5MB • Optional"
                                        file={projectPic}
                                        onFileChange={f => {
                                            if (f.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB.'); return; }
                                            setProjectPic(f);
                                        }}
                                        accentColor="#8cc63f"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <DropZone
                                        id="project-file-upload"
                                        label="Project File"
                                        accept="*/*"
                                        icon={FiFileText}
                                        hint="Drop Zip/Source here"
                                        note="Max 20MB • Optional"
                                        file={projectFile}
                                        onFileChange={f => {
                                            if (f.size > 20 * 1024 * 1024) { toast.error('File must be under 20MB.'); return; }
                                            setProjectFile(f);
                                        }}
                                        accentColor="#fbc111"
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2 flex items-center gap-2 bg-[#fcf3d9]/50 border border-[#fbc111]/30 px-3 py-2.5 rounded-xl">
                                    <span className="text-[13px] leading-none mb-[2px]">📌</span>
                                    <p className="text-[10px] text-gray-600 font-medium leading-tight">
                                        <span className="font-bold text-[#a68945]">Note:</span> Rename your file as <span className="font-mono font-bold text-[#4a7010]">YOUR_NAME_SOLO</span> or <span className="font-mono font-bold text-[#4a7010]">YOUR_TEAM_NAME_YOUR_NAME</span> for team only.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <PortalInput
                                    id="github-link"
                                    label="GitHub Repo Link"
                                    value={githubLink}
                                    onChange={e => setGithubLink(e.target.value)}
                                    placeholder="https://github.com/..."
                                    icon={FiGithub}
                                    borderColor="border-[#fbc111]/50 focus-within:border-[#fbc111]"
                                />
                                <PortalInput
                                    id="live-link"
                                    label="Live / Figma / Canva Link"
                                    value={liveLink}
                                    onChange={e => setLiveLink(e.target.value)}
                                    placeholder="https://myproject.com or figma.com/..."
                                    icon={FiGlobe}
                                    borderColor="border-[#8cc63f]/50 focus-within:border-[#8cc63f]"
                                />
                                <PortalInput
                                    id="drive-link"
                                    label="Google Drive Link"
                                    value={driveLink}
                                    onChange={e => setDriveLink(e.target.value)}
                                    placeholder="https://drive.google.com/..."
                                    icon={FiLink2}
                                    borderColor="border-[#8cc63f]/50 focus-within:border-[#8cc63f]"
                                />
                                <div className="flex items-center gap-2 bg-[#fcf3d9]/50 border border-[#fbc111]/30 px-3 py-2.5 rounded-xl !mt-3">
                                    <span className="text-[13px] leading-none mb-[2px]">📌</span>
                                    <p className="text-[10px] text-gray-600 font-medium leading-tight">
                                        <span className="font-bold text-[#a68945]">Note:</span> Make sure link is accessible or public.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 md:px-8 py-3 sm:py-5 border-t border-gray-100 bg-[#f8faf2] shrink-0 flex justify-center">
                        <Button
                            variant="portalSubmit"
                            text="Final Submit"
                            icon={FiSend}
                            isLoading={isSubmitting}
                            loadingText="Submitting..."
                            onClick={handleSubmit}
                            className="w-auto px-6 sm:px-14 py-1.5 sm:py-3.5 text-[10px] sm:text-[13px]"
                        />
                    </div>
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

export default SubmitContestModal;
