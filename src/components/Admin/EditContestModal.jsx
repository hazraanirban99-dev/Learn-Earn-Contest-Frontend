// ============================================================
// EditContestModal.jsx — Admin er contest edit korar modal
// ManageContests page theke "Edit" click korle URL e ?edit=id set hoye ei modal khule.
// contestId prop theke backend e GET call kore form pre-fill kora hoy.
// Admin title, domain (MERN/UIUX/DIGITAL MARKETING), rigor, dates,
// cash prize, certificate, internship, project type edit korte parbe.
// Thumbnail ar Syllabus (PDF) upload korte para jay.
// Save click hole multipart/form-data diye PUT /admin/contests/:id call hoy.
// "Discard Changes" korle re-fetch kore original values restore kore.
// ============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiX, FiBold, FiItalic, FiList, FiLink, FiAward, FiTrash2, FiUploadCloud, FiChevronDown } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const EditContestModal = ({ isOpen, onClose, contestId }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    domain: 'MERN',
    rigor: 'Medium',
    description: '',
    startDate: '',
    endDate: '',
    cashPrize: '0',
    expertCertificate: 'No',
    internshipOffer: 'No',
    projectType: 'Solo',
    maxTeamSize: 1
  });

  const [files, setFiles] = useState({
    thumbnail: null,
    syllabus: null
  });

  const [previews, setPreviews] = useState({
    thumbnail: null,
    syllabusName: null
  });

  // Handle closing by removing the query param
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      searchParams.delete('edit');
      navigate(`?${searchParams.toString()}`);
    }
  };

  // =========================================================================
  // 🚀 BACKEND API INTEGRATION: FETCH CONTEST DETAILS (GET)
  // =========================================================================
  const fetchContestDetails = React.useCallback(async () => {
    if(!contestId || !isOpen) return;
    setIsLoading(true);
    try {
      const { data } = await api.get(`/admin/contests/admin`);
      const contest = data.data.find(c => c._id === contestId);
      
      if(contest) {
         const allowedDomains = ['MERN', 'UIUX', 'DIGITAL MARKETING'];
         setFormData({
           title: contest.title,
           domain: allowedDomains.includes(contest.domain) ? contest.domain : 'MERN',
           rigor: contest.rigor || 'Medium',
           description: contest.description,
           startDate: contest.startDate ? new Date(contest.startDate).toISOString().slice(0, 16) : '',
           endDate: contest.endDate ? new Date(contest.endDate).toISOString().slice(0, 16) : '',
           cashPrize: contest.cashPrize || '0',
           expertCertificate: contest.expertCertificate || 'No',
           internshipOffer: contest.internshipOffer || 'No',
           projectType: contest.projectType || 'Solo',
           maxTeamSize: contest.maxTeamSize || 1
         });
         setPreviews({
           thumbnail: contest.thumbnail?.url,
           syllabusName: contest.syllabus?.url ? 'Current Syllabus (PDF)' : null
         });
         // Reset files state as well
         setFiles({
           thumbnail: null,
           syllabus: null
         });
      }
    } catch (error) {
      toast.error("Failed to fetch contest details");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [contestId, isOpen]);

  useEffect(() => {
    fetchContestDetails();
  }, [fetchContestDetails]);

  const handleDiscard = () => {
    fetchContestDetails();
    toast.info("Changes discarded. Restored original values.");
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFiles({ ...files, [type]: file });
      if (type === 'thumbnail') {
        setPreviews({ ...previews, thumbnail: URL.createObjectURL(file) });
      } else {
        setPreviews({ ...previews, syllabusName: file.name });
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const submissionData = { ...formData };
      const allowedDomains = ['MERN', 'UIUX', 'DIGITAL MARKETING'];
      if (!allowedDomains.includes(submissionData.domain)) {
        submissionData.domain = 'MERN';
      }

      const data = new FormData();
      Object.keys(submissionData).forEach(key => {
        data.append(key, submissionData[key]);
      });
      if (files.thumbnail) data.append('thumbnail', files.thumbnail);
      if (files.syllabus) data.append('syllabus', files.syllabus);

      const response = await api.put(`/admin/contests/${contestId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if(response.data.success) {
        toast.success("Contest updated successfully!");
        handleClose();
      } else {
        toast.error("Update failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen && !contestId) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full max-w-4xl rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 md:px-10 py-6 md:py-8 border-b border-gray-100 flex justify-between items-start shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            <span className="inline-block bg-[#f1f8e8] text-[#6ca518] text-[10px] sm:text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
              Edit Contest Configuration
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight truncate">
              {formData.title || "Loading..."}
            </h2>
          </div>
          <button 
            onClick={handleClose}
            className="p-3 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 hover:text-slate-900 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="px-6 md:px-10 py-8 overflow-y-auto space-y-8 flex-1 custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-transparent border-t-[#8cc63f] border-b-[#fbc111]"></div>
            </div>
          ) : (
            <>
              {/* Contest Title */}
              <div className="space-y-3">
                <label className="text-[12px] font-bold text-gray-800 uppercase tracking-widest">Contest Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-[#f8faf6]/80 focus:bg-white border-2 border-transparent focus:border-[#8cc63f]/30 rounded-2xl px-5 py-4 text-[15px] font-semibold text-slate-800 outline-none transition-all shadow-sm"
                  placeholder="Enter contest title"
                />
              </div>

               {/* Domain and Rigor Row */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {/* Domain */}
                 <div className="space-y-3">
                   <label className="text-[12px] font-bold text-gray-800 uppercase tracking-widest">Scholastic Domain</label>
                   <div className="relative">
                     <select 
                       value={formData.domain}
                       onChange={(e) => setFormData({...formData, domain: e.target.value})}
                       className="w-full bg-[#f8faf6]/80 focus:bg-white border-2 border-transparent focus:border-[#8cc63f]/30 rounded-2xl px-5 py-4 text-[15px] font-bold text-slate-800 outline-none transition-all shadow-sm appearance-none cursor-pointer"
                     >
                       <option value="MERN">MERN</option>
                       <option value="UIUX">UIUX</option>
                       <option value="DIGITAL MARKETING">DIGITAL MARKETING</option>
                     </select>
                     <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                   </div>
                 </div>

                 {/* Rigor */}
                 <div className="space-y-3">
                   <label className="text-[12px] font-bold text-gray-800 uppercase tracking-widest">Academic Rigor</label>
                   <div className="flex bg-[#f8faf6]/80 p-1.5 rounded-2xl gap-1">
                     {['Easy', 'Medium', 'Hard'].map(level => (
                       <button
                         key={level}
                         type="button"
                         onClick={() => setFormData({...formData, rigor: level})}
                         className={`flex-1 py-3 px-1 rounded-xl text-[10px] sm:text-[13px] font-bold transition-all ${
                           formData.rigor === level 
                             ? 'bg-white border-2 border-[#8cc63f] text-[#6ca518] shadow-sm scale-[1.02]' 
                             : 'border-2 border-transparent text-gray-500 hover:text-slate-800 hover:bg-white/50'
                         }`}
                       >
                         {level}
                       </button>
                     ))}
                   </div>
                 </div>
               </div>

               {/* Collaboration Strategy */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="space-y-3">
                   <label className="text-[12px] font-bold text-gray-800 uppercase tracking-widest">Collaboration Strategy</label>
                   <div className="flex bg-[#f8faf6]/80 p-1.5 rounded-2xl gap-1">
                     {['Solo', 'Team'].map(type => (
                       <button
                         key={type}
                         type="button"
                         onClick={() => setFormData({...formData, projectType: type})}
                         className={`flex-1 py-3 px-1 rounded-xl text-[10px] sm:text-[13px] font-bold transition-all ${
                           formData.projectType === type 
                             ? 'bg-[#8cc63f] text-white shadow-sm scale-[1.02]' 
                             : 'text-gray-500 hover:text-slate-800 hover:bg-white/50'
                         }`}
                       >
                         {type} Project
                       </button>
                     ))}
                   </div>
                 </div>

                 {formData.projectType === 'Team' && (
                   <div className="space-y-3">
                     <label className="text-[12px] font-bold text-gray-800 uppercase tracking-widest">Max Team Size</label>
                     <input 
                       type="number"
                       min="2"
                       max="10"
                       value={formData.maxTeamSize}
                       onChange={(e) => setFormData({...formData, maxTeamSize: Number(e.target.value)})}
                       className="w-full bg-[#f8faf6]/80 focus:bg-white border-2 border-transparent focus:border-[#8cc63f]/30 rounded-2xl px-5 py-3.5 text-[15px] font-bold text-slate-800 outline-none transition-all shadow-sm"
                     />
                   </div>
                 )}
               </div>

              {/* Project Description Editor */}
              <div className="space-y-3">
                <label className="text-[12px] font-bold text-gray-800 uppercase tracking-widest">Project Description</label>
                <div className="bg-[#f8faf6]/80 rounded-[24px] overflow-hidden shadow-sm border-2 border-transparent focus-within:border-[#8cc63f]/20 focus-within:bg-white transition-all">
                  <div className="flex gap-4 px-5 py-3 border-b border-gray-100 bg-white/50">
                    <button type="button" className="text-gray-500 hover:text-slate-900 transition-colors"><FiBold size={16} /></button>
                    <button type="button" className="text-gray-500 hover:text-slate-900 transition-colors"><FiItalic size={16} /></button>
                    <button type="button" className="text-gray-500 hover:text-slate-900 transition-colors"><FiList size={16} /></button>
                    <button type="button" className="text-gray-500 hover:text-slate-900 transition-colors"><FiLink size={16} /></button>
                  </div>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={5}
                    className="w-full bg-transparent px-5 py-5 text-[14px] font-semibold text-slate-700 outline-none resize-none leading-relaxed"
                    placeholder="Provide a detailed project description"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div className="space-y-3">
                  <label className="text-[12px] font-bold text-gray-800 uppercase tracking-widest">Start Date & Time</label>
                  <input 
                    type="datetime-local" 
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full bg-[#f8faf6]/80 focus:bg-white border-2 border-transparent focus:border-[#8cc63f]/30 rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 text-[14px] sm:text-[15px] font-semibold text-slate-800 outline-none transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[12px] font-bold text-gray-800 uppercase tracking-widest">End Date & Time</label>
                  <input 
                    type="datetime-local" 
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full bg-[#f8faf6]/80 focus:bg-white border-2 border-transparent focus:border-[#8cc63f]/30 rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 text-[14px] sm:text-[15px] font-semibold text-slate-800 outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 bg-green-50 rounded-lg text-green-600">
                    <FiAward size={20} />
                  </div>
                  <label className="text-[12px] font-bold text-gray-800 uppercase tracking-widest">Award & Recognition</label>
                </div>
                
                <div className="bg-white border-2 border-green-100 rounded-[28px] p-6 space-y-6 shadow-sm shadow-green-500/5">
                  {/* Cash Prize */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-green-600 uppercase">Cash Prize</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-[#8cc63f]">₹</span>
                      <input 
                        type="number"
                        placeholder="0.00"
                        value={formData.cashPrize}
                        onChange={(e) => setFormData({...formData, cashPrize: e.target.value})}
                        className="w-full bg-[#f1f8e8]/30 border border-green-50 rounded-2xl pl-10 pr-4 py-4 font-bold text-slate-700 placeholder-green-200 outline-none focus:bg-white focus:border-[#8cc63f]/20 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Yes/No Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Expert Certificate */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black tracking-widest text-green-600 uppercase">Expert Certificate</label>
                      <div className="flex bg-[#f1f8e8]/30 p-1 rounded-2xl border border-green-50 h-[54px]">
                        {['Yes', 'No'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setFormData({...formData, expertCertificate: opt})}
                            className={`flex-1 rounded-xl text-[10px] sm:text-[11px] font-black uppercase transition-all ${
                              formData.expertCertificate === opt 
                                ? 'bg-white text-green-600 shadow-sm' 
                                : 'text-green-400/60 hover:text-green-500'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Internship Offer */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black tracking-widest text-green-600 uppercase">Internship Offer</label>
                      <div className="flex bg-[#f1f8e8]/30 p-1 rounded-2xl border border-green-50 h-[54px]">
                        {['Yes', 'No'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setFormData({...formData, internshipOffer: opt})}
                            className={`flex-1 rounded-xl text-[10px] sm:text-[11px] font-black uppercase transition-all ${
                              formData.internshipOffer === opt 
                                ? 'bg-white text-green-600 shadow-sm' 
                                : 'text-green-400/60 hover:text-green-500'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[12px] font-bold text-gray-800 uppercase tracking-widest">Contest Thumbnail</label>
                  <label className="block border-2 border-dashed border-gray-200 bg-[#f8faf6]/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#8cc63f]/5 hover:border-[#8cc63f]/30 transition-all group overflow-hidden relative min-h-[140px]">
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'thumbnail')} />
                    {previews.thumbnail ? (
                      <img src={previews.thumbnail} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-10 shadow-inner" />
                    ) : null}
                    <FiUploadCloud size={28} className="text-[#8cc63f] relative z-10 group-hover:scale-110 transition-transform" />
                    <span className="text-[12px] font-black text-slate-800 relative z-10">{previews.thumbnail ? 'Replace Cover Image' : 'Upload Cover Image'}</span>
                    <span className="text-[10px] text-gray-400 font-bold relative z-10">PNG, JPG up to 5MB</span>
                  </label>
                </div>

                <div className="space-y-3">
                  <label className="text-[12px] font-bold text-gray-800 uppercase tracking-widest">Project Syllabus (PDF)</label>
                  <label className="block border-2 border-dashed border-gray-200 bg-[#f8faf6]/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all min-h-[140px] group">
                    <input type="file" className="hidden" accept="application/pdf" onChange={(e) => handleFileChange(e, 'syllabus')} />
                    <FiUploadCloud size={28} className="text-blue-500 group-hover:scale-110 transition-transform" />
                    <span className="text-[12px] font-black text-slate-800 text-center px-2">
                       {previews.syllabusName || 'Upload Syllabus PDF'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold">Max 25MB</span>
                  </label>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 md:px-10 py-6 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center shrink-0 gap-4">
          <button 
            type="button"
            onClick={handleDiscard}
            className="flex items-center gap-2 text-gray-400 hover:text-red-500 font-bold text-sm transition-colors w-full sm:w-auto justify-center"
          >
            <FiTrash2 size={18} />
            Discard Changes
          </button>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={handleClose}
              disabled={isSaving}
              className="flex-1 sm:flex-none px-6 py-3.5 text-gray-500 hover:text-slate-900 font-bold text-sm transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving || isLoading}
              className="flex-1 sm:flex-none px-4 sm:px-10 py-2.5 sm:py-3.5 bg-[#8cc63f] hover:bg-[#7eb533] text-white rounded-xl sm:rounded-2xl font-black text-[11px] sm:text-sm uppercase tracking-widest shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 min-w-[120px] sm:min-w-[180px]"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-[3px] border-transparent border-t-[#8cc63f] border-b-[#fbc111] rounded-full animate-spin" />
                  Updating...
                </>
              ) : 'Save Configuration'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditContestModal;
