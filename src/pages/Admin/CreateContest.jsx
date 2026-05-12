import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBold, FiItalic, FiList, FiLink, FiCalendar, FiUploadCloud, FiAward, FiChevronDown, FiPlus, FiMinus, FiUser, FiUsers } from 'react-icons/fi';
import AdminLayout from '../../layouts/AdminLayout';
import Button from '../../components/Button/Button';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { Loader } from '../../components/index';

const CreateContest = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rigor, setRigor] = useState('Medium');
  const [domain, setDomain] = useState('MERN');
  const [projectType, setProjectType] = useState('Solo');
  const [teamSize, setTeamSize] = useState(2);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    cashPrize: '0',
    expertCertificate: 'No',
    internshipOffer: 'No'
  });

  const [files, setFiles] = useState({
    thumbnail: null,
    syllabus: null
  });

  const [previews, setPreviews] = useState({
    thumbnail: null,
    syllabusName: null
  });

  const thumbnailInputRef = useRef(null);
  const syllabusInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.startDate || !formData.endDate) {
      return toast.error("Please fill all required fields");
    }
    if (!files.thumbnail) {
      return toast.error("Thumbnail is required");
    }
    if (!files.syllabus) {
      return toast.error("Project PDF (Syllabus) is required");
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      
      const allowedDomains = ['MERN', 'UIUX', 'DIGITAL MARKETING'];
      data.append('domain', allowedDomains.includes(domain) ? domain : 'MERN');
      data.append('rigor', rigor);
      data.append('projectType', projectType);
      // Solo hole team size default 1, Team hole user selected value
      data.append('maxTeamSize', projectType === 'Team' ? teamSize : 1);
      
      if (files.thumbnail) data.append('thumbnail', files.thumbnail);
      if (files.syllabus) data.append('syllabus', files.syllabus);

      const response = await api.post('/admin/contests/create', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        toast.success("Contest Created Successfully!");
        navigate('/admin/contests');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create contest");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {loading && (
        <Loader fullPage text="Forging Contest..." />
      )}
      <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-20 px-4 sm:px-6 lg:px-8">
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-4 w-full">
            <nav className="flex flex-wrap items-center gap-2 text-[9px] sm:text-[10px] font-black tracking-widest uppercase text-gray-400">
              <span>CONTESTS</span>
              <span className="text-[#8cc63f]">›</span>
              <span className="text-[#8cc63f]">NEW SCHOLASTIC CHALLENGE</span>
            </nav>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-gray-100 tracking-tight leading-tight">
              Craft New <span className="text-[#8cc63f]">Contest</span>
            </h1>
            <div className="border-l-4 border-[#fbc111] pl-4 sm:pl-6 py-1 bg-yellow-50/30 rounded-r-xl max-w-xl">
              <p className="text-gray-500 font-bold text-base sm:text-lg leading-relaxed italic opacity-90">
                "Define the parameters for the next chapter of scholastic excellence. Curate with precision and intent."
              </p>
            </div>
          </div>
        </div>

        {/* --- Main Form Grid --- */}
        <div className="grid grid-cols-12 gap-6 lg:gap-8 mt-4">
          
          {/* LEFT COLUMN (Title & Description) */}
          <div className="col-span-12 lg:col-span-8 space-y-10">
            
            {/* Contest Title */}
            <div className="space-y-4 group">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 group-focus-within:text-[#8cc63f] transition-colors">
                CONTEST TITLE
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., The Bauhaus Revival..."
                  className="w-full bg-[#f8faf6]/80 dark:bg-gray-800/80 border-2 border-transparent focus:border-[#8cc63f]/30 dark:focus:bg-gray-800 rounded-2xl px-4 sm:px-6 py-4 sm:py-5 text-base sm:text-lg font-bold text-slate-800 dark:text-gray-100 placeholder-gray-300 outline-none transition-all shadow-sm group-hover:shadow-md"
                />
              </div>
            </div>

            {/* Project Description (Editor) */}
            <div className="space-y-4 group">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 group-focus-within:text-[#8cc63f] transition-colors">
                PROJECT DESCRIPTION
              </label>
              <div className="bg-[#f8faf6]/50 border-2 border-transparent focus-within:border-[#8cc63f]/20 focus-within:bg-white dark:focus-within:bg-gray-900 dark:bg-gray-800 rounded-[32px] overflow-hidden shadow-sm transition-all group-hover:shadow-md">
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 dark:border-gray-700 flex flex-wrap items-center gap-4 sm:gap-6 bg-white dark:bg-gray-800 backdrop-blur-sm">
                   <button className="text-yellow-500 hover:scale-110 transition-transform"><FiBold size={16} strokeWidth={3} /></button>
                   <button className="text-yellow-500 hover:scale-110 transition-transform"><FiItalic size={16} strokeWidth={3} /></button>
                   <button className="text-yellow-500 hover:scale-110 transition-transform"><FiList size={16} strokeWidth={3} /></button>
                   <button className="text-yellow-500 hover:scale-110 transition-transform"><FiLink size={16} strokeWidth={3} /></button>
                </div>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={10}
                  placeholder="Elaborate on the vision, goals, and academic requirements..."
                  className="w-full bg-transparent px-5 sm:px-8 py-5 sm:py-8 text-sm sm:text-base text-slate-600 dark:text-gray-100 font-bold placeholder-gray-300 outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-4 group">
                <label className="text-[11px] font-black uppercase tracking-widest text-[#8cc63f] transition-colors">
                  CONTEST THUMBNAIL (JPG/PNG)
                </label>
                <input 
                  type="file" 
                  ref={thumbnailInputRef}
                  onChange={(e) => handleFileChange(e, 'thumbnail')}
                  className="hidden" 
                  accept="image/*"
                />
                <div 
                  onClick={() => thumbnailInputRef.current.click()}
                  className="border-4 border-dashed border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[32px] p-6 sm:p-8 flex flex-col items-center justify-center gap-4 transition-all hover:border-[#fbc111]/40 dark:hover:border-[#fbc111]/40 hover:bg-[#fbc111]/5 dark:hover:bg-[#fbc111]/10 cursor-pointer h-full relative overflow-hidden group"
                >
                  {previews.thumbnail && (
                    <img src={previews.thumbnail} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-10 transition-opacity" />
                  )}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-50 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform relative z-10">
                    <FiUploadCloud size={20} className="text-yellow-400 dark:text-[#fbc111]" />
                  </div>
                  <div className="text-center relative z-10">
                    <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-gray-100 uppercase tracking-tight">
                      {previews.thumbnail ? 'Change Thumbnail' : 'Upload Thumbnail'}
                    </p>
                    <p className="text-gray-400 font-bold text-[9px] sm:text-[10px]">16:9 Aspect Ratio / Max 5MB</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 group">
                <label className="text-[11px] font-black uppercase tracking-widest text-[#8cc63f] transition-colors">
                  PROJECT BRIEF & SYLLABUS (PDF)
                </label>
                <input 
                  type="file" 
                  ref={syllabusInputRef}
                  onChange={(e) => handleFileChange(e, 'syllabus')}
                  className="hidden" 
                  accept="application/pdf"
                />
                <div 
                  onClick={() => syllabusInputRef.current.click()}
                  className="border-4 border-dashed border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[32px] p-6 sm:p-8 flex flex-col items-center justify-center gap-4 transition-all hover:border-[#8cc63f]/30 dark:hover:border-[#8cc63f]/40 hover:bg-[#8cc63f]/5 dark:hover:bg-[#8cc63f]/10 cursor-pointer h-full group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <FiUploadCloud size={20} className="text-[#8cc63f]" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-gray-100 uppercase tracking-tight">
                      {previews.syllabusName || 'Upload Syllabus PDF'}
                    </p>
                    <p className="text-gray-400 font-bold text-[9px] sm:text-[10px]">PDF format / Max 25MB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Collaboration Strategy (Solo vs Team) */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-[#8cc63f] rounded-full" />
                <label className="text-[11px] font-black uppercase tracking-widest text-[#8cc63f]">
                  COLLABORATION STRATEGY
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#f8faf6]/50 dark:bg-gray-800/50 p-2 rounded-[28px] flex gap-2 border border-white dark:border-gray-700 shadow-inner min-h-[70px]">
                  {[
                    { id: 'Solo', icon: FiUser, label: 'Solo' },
                    { id: 'Team', icon: FiUsers, label: 'Team' },
                    { id: 'Both', icon: FiUsers, label: 'Both' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setProjectType(type.id)}
                      className={`flex-1 flex items-center justify-center gap-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                        projectType === type.id 
                          ? 'bg-[#8cc63f] text-white shadow-lg scale-[1.02]' 
                          : 'text-gray-400 hover:text-slate-800 dark:text-gray-100'
                      }`}
                    >
                      <type.icon size={18} />
                      {type.label}
                    </button>
                  ))}
                </div>

                <div className={`transition-all duration-500 overflow-hidden ${['Team', 'Both'].includes(projectType) ? 'opacity-100 max-h-40 translate-y-0' : 'opacity-0 max-h-0 -translate-y-4 pointer-events-none'}`}>
                  <div className="bg-white dark:bg-gray-800 border-2 border-[#8cc63f]/10 rounded-[20px] sm:rounded-[28px] p-2 flex items-center justify-between shadow-sm hover:border-[#8cc63f]/30 transition-all">
                    <div className="flex flex-col px-3 sm:px-6">
                       <span className="text-[8px] sm:text-[9px] font-black text-[#8cc63f] uppercase tracking-widest block mb-1">Max Team Capacity</span>
                       <span className="text-xl sm:text-2xl font-black text-slate-800 dark:text-gray-100 tabular-nums">{teamSize} Members</span>
                    </div>
                    
                    <div className="flex items-center gap-1 sm:gap-2 mr-1 shrink-0">
                      <button 
                        type="button"
                        onClick={() => setTeamSize(Math.max(2, teamSize - 1))}
                        className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 dark:bg-gray-800 rounded-xl sm:rounded-2xl flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90 shrink-0"
                      >
                         <FiMinus size={18} strokeWidth={3} className="sm:w-5 sm:h-5" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => setTeamSize(Math.min(10, teamSize + 1))}
                        className="w-10 h-10 sm:w-12 sm:h-12 bg-[#8cc63f]/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-[#8cc63f] hover:bg-[#8cc63f] hover:text-white transition-all shadow-sm active:scale-90 shadow-[#8cc63f]/20 shrink-0"
                      >
                         <FiPlus size={18} strokeWidth={3} className="sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Settings) */}
          <div className="col-span-12 lg:col-span-4 space-y-10">
            
            {/* Scholastic Domain */}
            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase tracking-widest text-[#8cc63f]">
                SCHOLASTIC DOMAIN
              </label>
              <div className="relative group">
                <select 
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full bg-[#f1f8e8] dark:bg-gray-800 border-2 border-white dark:border-gray-700 rounded-[20px] px-5 sm:px-6 py-4 sm:py-5 text-sm sm:text-base text-slate-800 dark:text-gray-100 font-black appearance-none outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-[#8cc63f]/20 transition-all cursor-pointer shadow-sm"
                >
                  <option value="MERN">MERN</option>
                  <option value="UIUX">UIUX</option>
                  <option value="DIGITAL MARKETING">DIGITAL MARKETING</option>
                </select>
                <div className="absolute right-5 sm:right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#8cc63f]">
                  <FiChevronDown size={20} strokeWidth={3} />
                </div>
              </div>
            </div>

            {/* Academic Rigor */}
            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                ACADEMIC RIGOR
              </label>
              <div className="bg-[#f1f8e8]/50 dark:bg-gray-800/50 p-1.5 sm:p-2 rounded-[24px] flex flex-wrap lg:flex-nowrap gap-2 border border-white dark:border-gray-700 shadow-inner">
                {['Easy', 'Medium', 'Hard'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setRigor(lvl)}
                    className={`flex-1 min-w-[60px] py-3 px-2 rounded-2xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all ${
                      rigor === lvl 
                        ? 'bg-[#8cc63f] text-white shadow-lg scale-105' 
                        : 'text-gray-500 hover:text-slate-800 dark:text-gray-100 hover:bg-white/ dark:hover:bg-gray-700/'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Scholastic Window (Dates) */}
            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <label className="text-[11px] font-black uppercase tracking-widest text-[#8cc63f]">
                SCHOLASTIC WINDOW
              </label>
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-3xl p-4 flex flex-col gap-3 shadow-sm hover:border-[#8cc63f]/30 transition-all">
                  <div className="flex items-center gap-3 px-1">
                    <FiCalendar className="text-[#8cc63f]" size={16} />
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">START DATE & TIME</span>
                  </div>
                  <input 
                    type="datetime-local" 
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full bg-[#f8faf6] dark:bg-gray-700/50 focus:bg-white dark:focus:bg-gray-900 rounded-xl px-4 py-3 font-bold text-slate-800 dark:text-gray-100 outline-none text-sm transition-all border-2 border-transparent focus:border-[#8cc63f]/20"
                  />
                </div>
                <div className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-3xl p-4 flex flex-col gap-3 shadow-sm hover:border-[#8cc63f]/30 transition-all">
                  <div className="flex items-center gap-3 px-1">
                    <FiCalendar className="text-[#8cc63f]" size={16} />
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">END DATE & TIME</span>
                  </div>
                  <input 
                    type="datetime-local" 
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full bg-[#f8faf6] dark:bg-gray-700/50 focus:bg-white dark:focus:bg-gray-900 rounded-xl px-4 py-3 font-bold text-slate-800 dark:text-gray-100 outline-none text-sm transition-all border-2 border-transparent focus:border-[#8cc63f]/20"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 sm:pt-10">
              <div className="bg-white dark:bg-gray-800 border-2 border-green-200 rounded-[32px] p-6 sm:p-8 space-y-6 relative overflow-hidden group shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all">
                <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-green-400/5 rounded-full blur-2xl group-hover:bg-green-400/10 transition-colors" />
                
                <div className="flex items-center gap-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 bg-green-50 dark:bg-green-900/20">
                    <FiAward size={14} sm:size={16} strokeWidth={3} />
                  </div>
                  <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-green-600">
                    AWARD AND RECOGNITION
                  </label>
                </div>

                 <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black tracking-widest text-green-600 uppercase">Cash Prize</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-[#8cc63f]">₹</span>
                      <input 
                        type="number"
                        name="cashPrize"
                        placeholder="0.00"
                        value={formData.cashPrize}
                        onChange={handleInputChange}
                        className="w-full bg-green-50/20 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30 rounded-2xl pl-10 pr-4 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-slate-700 dark:text-gray-100 placeholder-green-200 outline-none dark:focus:bg-gray-900 focus:border-green-300 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] sm:text-[10px] font-black tracking-widest text-green-600 uppercase">Expert Certificate</label>
                      <div className="flex bg-green-50/20 p-1 rounded-2xl border border-green-100 h-[50px] sm:h-[58px]">
                        {['Yes', 'No'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setFormData({...formData, expertCertificate: opt})}
                            className={`flex-1 rounded-xl text-[10px] sm:text-[11px] font-black uppercase transition-all ${
                              formData.expertCertificate === opt 
                                ? 'bg-white dark:bg-gray-800 text-green-600 shadow-sm' 
                                : 'text-green-400/60 hover:text-green-500'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] sm:text-[10px] font-black tracking-widest text-green-600 uppercase">Internship Offer</label>
                      <div className="flex bg-green-50/20 p-1 rounded-2xl border border-green-100 h-[50px] sm:h-[58px]">
                        {['Yes', 'No'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setFormData({...formData, internshipOffer: opt})}
                            className={`flex-1 rounded-xl text-[10px] sm:text-[11px] font-black uppercase transition-all ${
                              formData.internshipOffer === opt 
                                ? 'bg-white dark:bg-gray-800 text-green-600 shadow-sm' 
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
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <Button 
                text="Finalize & Create Contest"
                isLoading={loading}
                loadingText="Creating..."
                onClick={handleSubmit}
                className="!py-3 sm:!py-[14px] !text-[13px] sm:!text-[15px] !rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="mt-12 text-center pb-10">
          <p className="text-[11px] font-bold text-gray-300 uppercase tracking-[0.2em]">
            "The design of education is the architecture of the future."
          </p>
          <div className="flex justify-center gap-1.5 mt-4">
             <div className="w-1.5 h-1.5 rounded-full bg-yellow-200" />
             <div className="w-1.5 h-1.5 rounded-full bg-[#8cc63f]/30" />
             <div className="w-1.5 h-1.5 rounded-full bg-yellow-200" />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateContest;
