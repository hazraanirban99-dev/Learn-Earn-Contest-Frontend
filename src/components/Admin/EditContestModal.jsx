import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiX, FiBold, FiItalic, FiList, FiLink, FiAward, FiTrash2, FiUploadCloud, FiChevronDown } from 'react-icons/fi';
import { toast } from 'react-toastify';

const EditContestModal = ({ isOpen, onClose, contestId }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSaving, setIsSaving] = useState(false);

  // Handle closing by removing the query param
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      searchParams.delete('edit');
      navigate(`?${searchParams.toString()}`);
    }
  };

  const [formData, setFormData] = useState({
    title: 'Sustainable Urbanism Masterclass: Reimagining Metropolis 2025',
    domain: 'Architecture & Design',
    rigor: 'Medium',
    description: 'The challenge invites students to propose a 10-hectare carbon-neutral district model. Focusing on the integration of vertical forests, circular waste management, and autonomous transport systems, participants must present a holistic masterplan for future urban living...',
    startDate: '2024-11-01',
    endDate: '2025-01-15',
    award: '£5,000 Academic Grant + Summer Internship at Foster & Partners'
  });

  // =========================================================================
  // 🚀 BACKEND API INTEGRATION: FETCH CONTEST DETAILS (GET)
  // =========================================================================
  /*
  useEffect(() => {
    if(!contestId) return;
    const fetchContestDetails = async () => {
      try {
        const response = await fetch(`http://YOUR_BACKEND_URL/api/v1/contests/${contestId}`);
        const data = await response.json();
        if(response.ok) {
           setFormData({
             title: data.title,
             domain: data.domain,
             rigor: data.rigor,
             description: data.description,
             startDate: data.startDate,
             endDate: data.endDate,
             award: data.award
           });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchContestDetails();
  }, [contestId]);
  */
  // =========================================================================

  const handleSave = async () => {
    setIsSaving(true);
    // =========================================================================
    // 🚀 BACKEND API INTEGRATION: UPDATE CONTEST (PUT)
    // =========================================================================
    /*
    try {
      const response = await fetch(`http://YOUR_BACKEND_URL/api/v1/contests/${contestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if(response.ok) {
        toast.success("Contest updated successfully!");
        handleClose();
      } else {
        toast.error("Update failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong with the server.");
    } finally {
      setIsSaving(false);
    }
    */
    
    // MOCK BEHAVIOR
    setTimeout(() => {
      setIsSaving(false);
      toast.success("✅ Success! Contest information updated.\n\nNote: Simulated backend response.");
      handleClose();
    }, 1500);
  };

  if (!isOpen && !contestId) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full max-w-4xl rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 md:px-10 py-6 md:py-8 border-b border-gray-100 flex justify-between items-start shrink-0">
          <div>
            <span className="inline-block bg-[#f1f8e8] text-[#6ca518] text-[10px] sm:text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
              Edit Contest Configuration
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Sustainable Urbanism Masterclass
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
        <div className="px-6 md:px-10 py-8 overflow-y-auto space-y-8 flex-1">
          
          {/* Contest Title */}
          <div className="space-y-3">
            <label className="text-[12px] font-bold text-gray-800">Contest Title</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-[#f8faf6]/80 focus:bg-white border-2 border-transparent focus:border-[#8cc63f]/30 rounded-2xl px-5 py-4 text-[15px] font-semibold text-slate-800 outline-none transition-all shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Domain */}
            <div className="space-y-3">
              <label className="text-[12px] font-bold text-gray-800">Scholastic Domain</label>
              <div className="relative">
                <select 
                  value={formData.domain}
                  onChange={(e) => setFormData({...formData, domain: e.target.value})}
                  className="w-full bg-[#f8faf6]/80 focus:bg-white border-2 border-transparent focus:border-[#8cc63f]/30 rounded-2xl px-5 py-4 text-[15px] font-semibold text-slate-800 outline-none transition-all shadow-sm appearance-none cursor-pointer"
                >
                  <option>Architecture & Design</option>
                  <option>Fullstack Development</option>
                  <option>Data Science</option>
                </select>
                <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Rigor */}
            <div className="space-y-3">
              <label className="text-[12px] font-bold text-gray-800">Academic Rigor</label>
              <div className="flex bg-[#f8faf6]/80 p-1.5 rounded-2xl gap-1">
                {['Easy', 'Medium', 'Hard'].map(level => (
                  <button
                    key={level}
                    onClick={() => setFormData({...formData, rigor: level})}
                    className={`flex-1 py-3 px-2 rounded-xl text-[13px] font-bold transition-all ${
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

          {/* Project Description Editor */}
          <div className="space-y-3">
            <label className="text-[12px] font-bold text-gray-800">Project Description</label>
            <div className="bg-[#f8faf6]/80 rounded-[24px] overflow-hidden shadow-sm border-2 border-transparent focus-within:border-[#8cc63f]/20 focus-within:bg-white transition-all">
              <div className="flex gap-4 px-5 py-3 border-b border-gray-100 bg-white/50">
                <button className="text-gray-500 hover:text-slate-900 transition-colors"><FiBold size={16} /></button>
                <button className="text-gray-500 hover:text-slate-900 transition-colors"><FiItalic size={16} /></button>
                <button className="text-gray-500 hover:text-slate-900 transition-colors"><FiList size={16} /></button>
                <button className="text-gray-500 hover:text-slate-900 transition-colors"><FiLink size={16} /></button>
              </div>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={5}
                className="w-full bg-transparent px-5 py-5 text-[14px] font-semibold text-slate-700 outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[12px] font-bold text-gray-800">Start Date</label>
              <input 
                type="date" 
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full bg-[#f8faf6]/80 focus:bg-white border-2 border-transparent focus:border-[#8cc63f]/30 rounded-2xl px-5 py-4 text-[15px] font-semibold text-slate-800 outline-none transition-all shadow-sm"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[12px] font-bold text-gray-800">End Date</label>
              <input 
                type="date" 
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="w-full bg-[#f8faf6]/80 focus:bg-white border-2 border-transparent focus:border-[#8cc63f]/30 rounded-2xl px-5 py-4 text-[15px] font-semibold text-slate-800 outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[12px] font-bold text-gray-800">Award & Recognition</label>
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-yellow-600">
                <FiAward size={20} />
              </div>
              <input 
                type="text" 
                value={formData.award}
                onChange={(e) => setFormData({...formData, award: e.target.value})}
                className="w-full bg-yellow-50/50 focus:bg-white border-2 border-yellow-100 focus:border-yellow-300 rounded-2xl pl-14 pr-5 py-4 text-[15px] font-bold text-yellow-800 outline-none transition-all shadow-sm"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[12px] font-bold text-gray-800">Contest Thumbnail (JPG/PNG)</label>
              <div className="border-2 border-dashed border-gray-200 bg-[#f8faf6]/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#fbc111]/10 hover:border-[#fbc111]/40 transition-all">
                <FiUploadCloud size={24} className="text-yellow-500" />
                <span className="text-[13px] font-bold text-gray-500">Replace cover image</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[12px] font-bold text-gray-800">Project Brief & Syllabus (PDF)</label>
              <div className="border-2 border-dashed border-gray-200 bg-[#f8faf6]/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#8cc63f]/5 hover:border-[#8cc63f]/30 transition-all">
                <FiUploadCloud size={24} className="text-[#8cc63f]" />
                <span className="text-[13px] font-bold text-gray-500">Replace syllabus PDF</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 md:px-10 py-6 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center shrink-0 gap-4">
          <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 font-bold text-sm transition-colors w-full sm:w-auto justify-center">
            <FiTrash2 size={18} />
            Delete Draft
          </button>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={handleClose}
              className="flex-1 sm:flex-none px-6 py-3.5 text-gray-600 hover:text-slate-900 font-bold text-sm transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 sm:flex-none px-8 py-3.5 bg-[#fbc111] hover:bg-[#e6b110] text-black rounded-xl font-black text-sm uppercase tracking-wider shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditContestModal;
