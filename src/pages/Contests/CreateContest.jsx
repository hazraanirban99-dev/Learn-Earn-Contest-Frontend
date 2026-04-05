import React, { useState } from 'react';
import { FiBold, FiItalic, FiList, FiLink, FiCalendar, FiUploadCloud, FiAward, FiChevronDown, FiPlus } from 'react-icons/fi';
import AdminLayout from '../../layouts/AdminLayout';
import Button from '../../components/Button/Button';
import { toast } from 'react-toastify';

const CreateContest = () => {
  const [rigor, setRigor] = useState('Easy');
  const [domain, setDomain] = useState('Development');
  const [cashPrize, setCashPrize] = useState('');
  const [expertCertificate, setExpertCertificate] = useState('No');
  const [internshipOffer, setInternshipOffer] = useState('No');

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-20">
        {/* --- Header Section --- */}
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <nav className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-gray-400">
              <span>CONTESTS</span>
              <span className="text-[#8cc63f]">›</span>
              <span className="text-[#8cc63f]">NEW SCHOLASTIC CHALLENGE</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
              Craft New Contest
            </h1>
            <div className="border-l-4 border-[#fbc111] pl-6 py-1 bg-yellow-50/30 rounded-r-xl max-w-xl">
              <p className="text-gray-500 font-bold text-lg leading-relaxed italic opacity-90">
                "Define the parameters for the next chapter of scholastic excellence. Curate with precision and intent."
              </p>
            </div>
          </div>
          
          {/* Top Right Illustration Placeholder */}
          <div className="hidden lg:block relative">
            <div className="w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl absolute inset-0 -z-10" />
            <div className="w-24 h-24 rounded-full border-2 border-yellow-100 flex items-center justify-center bg-white/50 backdrop-blur-sm shadow-inner relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <svg className="w-12 h-12 text-yellow-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
               </svg>
            </div>
          </div>
        </div>

        {/* --- Main Form Grid --- */}
        <div className="grid grid-cols-12 gap-8 mt-4">
          
          {/* LEFT COLUMN (Title & Description) */}
          <div className="col-span-12 xl:col-span-8 space-y-10">
            
            {/* Contest Title */}
            <div className="space-y-4 group">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 group-focus-within:text-[#8cc63f] transition-colors">
                CONTEST TITLE
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="e.g., The Bauhaus Revival: Digital Interface Challeng"
                  className="w-full bg-[#f8faf6]/80 border-2 border-transparent focus:border-[#8cc63f]/30 focus:bg-white rounded-2xl px-6 py-5 text-lg font-bold text-slate-800 placeholder-gray-300 outline-none transition-all shadow-sm group-hover:shadow-md"
                />
                <div className="absolute top-0 right-0 h-full flex items-center pr-6 opacity-0 group-focus-within:opacity-100 transition-opacity">
                  <div className="w-2 h-2 bg-[#8cc63f] rounded-full animate-pulse" />
                </div>
              </div>
            </div>

            {/* Project Description (Editor) */}
            <div className="space-y-4 group">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 group-focus-within:text-[#8cc63f] transition-colors">
                PROJECT DESCRIPTION
              </label>
              <div className="bg-[#f8faf6]/50 border-2 border-transparent focus-within:border-[#8cc63f]/20 focus-within:bg-white rounded-[32px] overflow-hidden shadow-sm transition-all group-hover:shadow-md">
                {/* Toolbar */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-6 bg-white/50 backdrop-blur-sm">
                   <button className="text-yellow-500 hover:scale-110 transition-transform"><FiBold size={18} strokeWidth={3} /></button>
                   <button className="text-yellow-500 hover:scale-110 transition-transform"><FiItalic size={18} strokeWidth={3} /></button>
                   <button className="text-yellow-500 hover:scale-110 transition-transform"><FiList size={18} strokeWidth={3} /></button>
                   <button className="text-yellow-500 hover:scale-110 transition-transform"><FiLink size={18} strokeWidth={3} /></button>
                </div>
                {/* Textarea */}
                <textarea 
                  rows={12}
                  placeholder="Elaborate on the vision, goals, and academic requirements..."
                  className="w-full bg-transparent px-8 py-8 text-slate-600 font-bold placeholder-gray-300 outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-4 group">
                <label className="text-[11px] font-black uppercase tracking-widest text-[#8cc63f] transition-colors">
                  CONTEST THUMBNAIL (JPG/PNG)
                </label>
                <div className="border-4 border-dashed border-gray-100 bg-white rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 transition-all hover:border-[#fbc111]/40 hover:bg-[#fbc111]/5 cursor-pointer h-full">
                  <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <FiUploadCloud size={24} className="text-yellow-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Upload Thumbnail</p>
                    <p className="text-gray-400 font-bold text-[10px]">16:9 Aspect Ratio / Max 5MB</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 group">
                <label className="text-[11px] font-black uppercase tracking-widest text-[#8cc63f] transition-colors">
                  PROJECT BRIEF & SYLLABUS (PDF)
                </label>
                <div className="border-4 border-dashed border-gray-100 bg-white rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 transition-all hover:border-[#8cc63f]/30 hover:bg-[#8cc63f]/5 cursor-pointer h-full">
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <FiUploadCloud size={24} className="text-[#8cc63f]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Upload Syllabus</p>
                    <p className="text-gray-400 font-bold text-[10px]">PDF format / Max 25MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Settings) */}
          <div className="col-span-12 xl:col-span-4 space-y-10">
            
            {/* Scholastic Domain */}
            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase tracking-widest text-[#8cc63f]">
                SCHOLASTIC DOMAIN
              </label>
              <div className="relative group">
                <select 
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full bg-[#f1f8e8] border-2 border-white rounded-[20px] px-6 py-5 text-slate-800 font-black appearance-none outline-none focus:bg-white focus:border-[#8cc63f]/20 transition-all cursor-pointer shadow-sm"
                >
                  <option>MERN</option>
                  <option>UI/UX</option>
                  <option>DIGITAL MARKETING</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#8cc63f]">
                  <FiChevronDown size={20} strokeWidth={3} />
                </div>
              </div>
            </div>

            {/* Academic Rigor */}
            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                ACADEMIC RIGOR
              </label>
              <div className="bg-[#f1f8e8]/50 p-2 rounded-[24px] flex gap-2 border border-white shadow-inner">
                {['Easy', 'Medium', 'Hard'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setRigor(lvl)}
                    className={`flex-1 py-4 px-2 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all ${
                      rigor === lvl 
                        ? 'bg-[#8cc63f] text-white shadow-lg scale-105' 
                        : 'text-gray-500 hover:text-slate-800 hover:bg-white/50'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Scholastic Window (Dates) */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <label className="text-[11px] font-black uppercase tracking-widest text-[#8cc63f]">
                SCHOLASTIC WINDOW
              </label>
              <div className="space-y-4">
                <div className="bg-white border-2 border-gray-50 rounded-2xl p-5 flex items-center gap-6 shadow-sm hover:border-[#8cc63f]/20 transition-all group">
                  <div className="p-3 bg-yellow-50 rounded-xl group-hover:scale-110 transition-transform">
                    <FiCalendar className="text-yellow-500" size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-[#8cc63f] uppercase tracking-widest">START DATE</span>
                    <input type="date" className="bg-transparent font-black text-slate-800 outline-none uppercase text-sm" />
                  </div>
                </div>
                <div className="bg-white border-2 border-gray-50 rounded-2xl p-5 flex items-center gap-6 shadow-sm hover:border-[#8cc63f]/20 transition-all group">
                  <div className="p-3 bg-yellow-50 rounded-xl group-hover:scale-110 transition-transform">
                    <FiCalendar className="text-yellow-500" size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-[#8cc63f] uppercase tracking-widest">END DATE</span>
                    <input type="date" className="bg-transparent font-black text-slate-800 outline-none uppercase text-sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* Award & Recognition */}
            <div className="pt-10">
              <div className="bg-white border-2 border-yellow-200 rounded-[32px] p-8 space-y-6 relative overflow-hidden group shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all">
                <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-yellow-400/5 rounded-full blur-2xl group-hover:bg-yellow-400/10 transition-colors" />
                
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border-2 border-yellow-500 flex items-center justify-center text-yellow-500 bg-yellow-50">
                    <FiAward size={16} strokeWidth={3} />
                  </div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-[#fbc111]">
                    AWARD AND RECOGNITION
                  </label>
                </div>

                 <div className="space-y-5">
                  {/* Cash Prize */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-[#fbc111]/70 uppercase">CASH PRIZE (₹)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-[#fbc111]">₹</span>
                      <input 
                        type="number"
                        placeholder="0.00"
                        value={cashPrize}
                        onChange={(e) => setCashPrize(e.target.value)}
                        className="w-full bg-yellow-50/50 border border-yellow-100 rounded-2xl pl-10 pr-4 py-4 font-bold text-slate-700 placeholder-yellow-300 outline-none focus:bg-white focus:border-yellow-300 transition-all transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Yes/No Options Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Expert Certificate */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black tracking-widest text-[#fbc111]/70 uppercase">EXPERT CERTIFICATE</label>
                      <div className="flex bg-yellow-50/50 p-1.5 rounded-2xl border border-yellow-100 h-[58px]">
                        {['Yes', 'No'].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setExpertCertificate(opt)}
                            className={`flex-1 rounded-xl text-[11px] font-black uppercase transition-all ${
                              expertCertificate === opt 
                                ? 'bg-white text-[#fbc111] shadow-sm' 
                                : 'text-yellow-400/60 hover:text-yellow-500'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Internship Offer */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black tracking-widest text-[#fbc111]/70 uppercase">INTERNSHIP OFFER</label>
                      <div className="flex bg-yellow-50/50 p-1.5 rounded-2xl border border-yellow-100 h-[58px]">
                        {['Yes', 'No'].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setInternshipOffer(opt)}
                            className={`flex-1 rounded-xl text-[11px] font-black uppercase transition-all ${
                              internshipOffer === opt 
                                ? 'bg-white text-[#fbc111] shadow-sm' 
                                : 'text-yellow-400/60 hover:text-yellow-500'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[9px] font-bold text-[#fbc111]/50 leading-relaxed px-1 text-center italic">
                  Awards will be digitally authenticated via Secure Ledger.
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <Button 
                text="Finalize & Create Contest"
                onClick={async () => {
                  toast.success("Contest Created Successfully!");
                }}
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
