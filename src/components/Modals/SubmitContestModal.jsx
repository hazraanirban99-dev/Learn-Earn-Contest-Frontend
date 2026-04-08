import React, { useState, useCallback, useMemo } from 'react';
import { FiX, FiSend, FiImage, FiFileText, FiLink2, FiGithub, FiGlobe, FiUser, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import DropZone from '../Input/DropZone';
import PortalInput from '../Input/PortalInput';
import Button from '../Button/Button';

const SubmitContestModal = ({ isOpen, onClose, contest, onSuccess }) => {
    const [projectPic, setProjectPic] = useState(null);
    const [projectPdf, setProjectPdf] = useState(null);
    const [githubLink, setGithubLink] = useState('');
    const [liveLink, setLiveLink] = useState('');
    const [driveLink, setDriveLink] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);



    const isFormValid = useMemo(() => {
        if (!projectPic || !projectPdf) return false;
        if (!githubLink.trim() || !liveLink.trim()) return false;
        return true;
    }, [projectPic, projectPdf, githubLink, liveLink]);

    const handleSubmit = async () => {
        if (!isFormValid) {
            toast.error('Please fill all required fields before submitting.');
            return;
        }

        setIsSubmitting(true);

        try {
            // MOCK delay
            await new Promise(r => setTimeout(r, 1500));
            toast.success('Project Submitted Successfully! 🎉');
            onSuccess();
        } catch (err) {
            toast.error(err.message || 'Something went wrong.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm shadow-2xl">
            <div className="fixed inset-0" onClick={onClose}></div>
            
            <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-300 h-auto max-h-[90vh]">
                
                 {/* Left Sidebar */}
                 <div className="hidden md:flex w-2/5 bg-[#4a7010] p-10 flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-white text-sm font-black tracking-widest uppercase mb-12">Desun Academy</h2>
                        <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight mt-12 mb-2">
                            Submit Your Response
                        </h1>
                        <p className="text-[#ecf0e6] font-medium text-sm mt-4">
                            Submit your project for "{contest?.name || 'Contest'}". Ensure all links and documents are publicly accessible.
                        </p>
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
                            


                            {/* Divider line */}
                            <div className="h-[2px] w-full bg-gradient-to-r from-[#8cc63f]/20 to-transparent rounded-full" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                                <div className="space-y-3">
                                    <DropZone
                                        id="project-pic-upload"
                                        label="Project Image"
                                        accept="image/png, image/jpeg"
                                        icon={FiImage}
                                        hint="Drop PNG/JPG here"
                                        note="Max 5MB"
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
                                        id="project-pdf-upload"
                                        label="Project PDF"
                                        accept="application/pdf"
                                        icon={FiFileText}
                                        hint="Drop PDF here"
                                        note="Max 10MB"
                                        file={projectPdf}
                                        onFileChange={f => {
                                            if (f.size > 10 * 1024 * 1024) { toast.error('PDF must be under 10MB.'); return; }
                                            setProjectPdf(f);
                                        }}
                                        accentColor="#fbc111"
                                    />
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
                                    label="Live Link"
                                    value={liveLink}
                                    onChange={e => setLiveLink(e.target.value)}
                                    placeholder="https://myproject.vercel.app"
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
                            </div>
                        </div>
                    </div>

                    <div className="px-6 md:px-8 py-5 border-t border-gray-100 bg-[#f8faf2] shrink-0">
                        <Button
                            variant="portalSubmit"
                            text="Final Submit"
                            icon={FiSend}
                            isLoading={isSubmitting}
                            loadingText="Submitting..."
                            onClick={handleSubmit}
                            className="w-full"
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
