import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserNavbar from '../../components/Navbar/UserNavbar';
import Footer from '../../components/Footer/Footer';
import DropZone from '../../components/Input/DropZone';
import PortalInput from '../../components/Input/PortalInput';
import PortalSelect from '../../components/Input/PortalSelect';
import Button from '../../components/Button/Button';
import {
  FiGithub, FiGlobe, FiLink2,
  FiPlus, FiX, FiSend, FiImage, FiFileText, FiUser
} from 'react-icons/fi';

// ─────────────────────────────────────────────────────────────
// MOCK DATA — replace with API calls when backend is ready
// ─────────────────────────────────────────────────────────────

// 🚀 [BACKEND] - GET /api/v1/contests/years  →  string[]
const YEARS = ['2024', '2025', '2026'];

// 🚀 [BACKEND] - GET /api/v1/contests/months?year=YYYY  →  string[]
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const SUBMIT_TYPES = ['Solo', 'Team'];

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────

const StudentSubmission = () => {
  const navigate = useNavigate();

  // Form State
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [projectId, setProjectId] = useState('');
  const [submitType, setSubmitType] = useState('Solo');
  const [teammates, setTeammates] = useState(['']);
  const [projectPic, setProjectPic] = useState(null);
  const [projectPdf, setProjectPdf] = useState(null);
  const [githubLink, setGithubLink] = useState('');
  const [liveLink, setLiveLink] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Teammate helpers
  const addTeammate = useCallback(() => {
    if (teammates.length >= 4) {
      toast.info('Maximum 4 teammates allowed.');
      return;
    }
    setTeammates(prev => [...prev, '']);
  }, [teammates.length]);

  const removeTeammate = useCallback((idx) => {
    setTeammates(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const updateTeammate = useCallback((idx, val) => {
    setTeammates(prev => prev.map((t, i) => i === idx ? val : t));
  }, []);

  // 🚀 [BACKEND] - GET /api/v1/student/enrolled-contests?year=YYYY&month=MM  →  { id, name }[]
  const enrolledContestData = useMemo(() => ({
    '2024': {
      'October': [
        { id: 'c1', name: 'Eco-Urban Design 2024' },
        { id: 'c2', name: 'Future Mobility Concept' }
      ],
      'September': [
        { id: 'c3', name: 'Sustainable Energy Hackathon' }
      ]
    },
    '2025': {
      'January': [
        { id: 'c4', name: 'AI in Architecture 2025' }
      ]
    }
  }), []);

  // Filter Cascade Logic
  const availableMonths = useMemo(() => enrolledContestData[year] ? Object.keys(enrolledContestData[year]) : [], [year, enrolledContestData]);
  const availableContests = useMemo(() => enrolledContestData[year]?.[month] || [], [year, month, enrolledContestData]);

  // Handle Cascading Resets
  useEffect(() => {
    if (year && !availableMonths.includes(month)) {
      setMonth(availableMonths[0] || '');
    }
  }, [year, availableMonths, month]);

  useEffect(() => {
    if (month && !availableContests.some(c => c.id === projectId)) {
      setProjectId(availableContests[0]?.id || '');
    }
  }, [month, availableContests, projectId]);

  const projectOptions = useMemo(() => availableContests.map(p => ({ value: p.id, label: p.name })), [availableContests]);

  // Validation
  const isFormValid = useMemo(() => {
    if (!year || !month || !projectId) return false;
    if (!projectPic || !projectPdf) return false;
    if (!githubLink.trim() || !liveLink.trim()) return false;
    if (submitType === 'Team' && teammates.some(t => !t.trim())) return false;
    return true;
  }, [year, month, projectId, projectPic, projectPdf, githubLink, liveLink, submitType, teammates]);

  // Submit handler
  const handleSubmit = async () => {
    if (!isFormValid) {
      toast.error('Please fill all required fields before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      // =========================================================================
      // 🚀 [BACKEND] SUBMIT PROJECT
      // =========================================================================
      // Endpoint: POST /api/v1/student/submissions
      // Content-Type: multipart/form-data
      //
      // const formData = new FormData();
      // formData.append('year', year);
      // formData.append('month', month);
      // formData.append('contestId', projectId);
      // formData.append('submitType', submitType);
      // if (submitType === 'Team') {
      //   teammates.forEach(t => formData.append('teammates[]', t));
      // }
      // formData.append('projectPic', projectPic);      // File
      // formData.append('projectPdf', projectPdf);      // File
      // formData.append('githubLink', githubLink);
      // formData.append('liveLink', liveLink);
      // formData.append('driveLink', driveLink);
      //
      // const res = await fetch('/api/v1/student/submissions', {
      //   method: 'POST',
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      //   body: formData,
      // });
      //
      // if (!res.ok) {
      //   const err = await res.json();
      //   throw new Error(err.message || 'Submission failed');
      // }
      // =========================================================================

      // MOCK delay — delete when API is ready
      await new Promise(r => setTimeout(r, 1400));
      toast.success('Project Submitted Successfully! 🎉');
      // Optionally redirect:
      // navigate('/student/dashboard');
    } catch (err) {
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf2] font-sans selection:bg-[#8cc63f]/30">
      <UserNavbar />

      {/* ── PAGE HERO HEADER ─────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-12 lg:px-24 pt-12 pb-10">
        <nav className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-gray-400 mb-6">
          <span>Student Portal</span>
          <span className="text-[#8cc63f]">›</span>
          <span className="text-[#8cc63f]">Submit Project</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[#8cc63f] text-[10px] font-black uppercase tracking-[0.2em] mb-3 block">
              Project Portal
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.05]">
              SUBmit your{' '}
              <span className="text-[#fbc111]">contest</span>
            </h1>
          </div>
          {/* Decorative accent */}
          <div className="hidden md:block">
            <div className="w-20 h-1 bg-[#fbc111] rounded-full mb-2" />
            <div className="w-12 h-1 bg-[#8cc63f] rounded-full" />
          </div>
        </div>
      </div>

      {/* ── MAIN FORM ────────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-12 lg:px-24 pb-24 space-y-10">

        {/* SECTION 1: Contest Selection */}
        <div className="bg-white rounded-[40px] p-6 sm:p-10 shadow-sm border border-gray-100">
          <SectionTitle label="01" title="Select Contest" accent="#8cc63f" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <PortalSelect
              id="year-select"
              label="Year of Competition"
              value={year}
              onChange={e => { setYear(e.target.value); setMonth(''); setProjectId(''); }}
              options={YEARS}
              placeholder="Select year"
            />
            <PortalSelect
              id="month-select"
              label="Month"
              value={month}
              onChange={e => { setMonth(e.target.value); setProjectId(''); }}
              options={availableMonths}
              placeholder={availableMonths.length > 0 ? "Select month" : "No active months"}
            />
          </div>

          <div className="mt-6">
            <PortalSelect
              id="project-select"
              label="Project / Contest Name"
              value={projectId}
              onChange={e => setProjectId(e.target.value)}
              options={projectOptions}
              placeholder="Select your project"
            />
          </div>
        </div>

        {/* SECTION 2: Submission Type */}
        <div className="bg-white rounded-[40px] p-6 sm:p-10 shadow-sm border border-gray-100">
          <SectionTitle label="02" title="Submission Type" accent="#fbc111" />

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

            {/* Submit Type Toggle */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                Submit Type
              </label>
              <div className="bg-[#f1f8e8] p-1.5 rounded-2xl flex gap-2 border border-white shadow-inner">
                {SUBMIT_TYPES.map(t => (
                  <button
                    key={t}
                    onClick={() => { setSubmitType(t); setTeammates(['']); }}
                    className={`flex-1 py-3.5 px-2 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all ${
                      submitType === t
                        ? 'bg-[#8cc63f] text-white shadow-lg scale-[1.03]'
                        : 'text-gray-500 hover:text-slate-800 hover:bg-white/60'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Teammate Inputs — only in Team mode */}
            {submitType === 'Team' && (
              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <FiUser size={13} /> Enter Teammate Usernames
                </label>
                <div className="space-y-3">
                  {teammates.map((t, idx) => (
                    <div key={idx} className="flex items-center gap-2 sm:gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center bg-[#f1f8e8] border-2 border-transparent focus-within:border-[#8cc63f]/40 focus-within:bg-white rounded-2xl transition-all shadow-sm overflow-hidden">
                          <div className="pl-3 sm:pl-4 pr-1 sm:pr-2 text-gray-400 shrink-0">
                            <FiUser size={15} className="w-3.5 sm:w-4" />
                          </div>
                          <input
                            type="text"
                            value={t}
                            onChange={e => updateTeammate(idx, e.target.value)}
                            placeholder="@username"
                            className="flex-1 py-2.5 sm:py-3.5 pr-3 sm:pr-4 outline-none bg-transparent text-slate-800 font-bold text-sm placeholder-gray-300 min-w-0"
                          />
                        </div>
                      </div>
                      {teammates.length > 1 && (
                        <button
                          onClick={() => removeTeammate(idx)}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition-all shrink-0"
                        >
                          <FiX className="w-3.5 sm:w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {teammates.length < 4 && (
                  <button
                    onClick={addTeammate}
                    className="flex items-center gap-2 text-[#fbc111] font-black text-[10px] sm:text-xs uppercase tracking-widest hover:text-[#d9a50e] transition-colors mt-1"
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#fbc111] text-white flex items-center justify-center shadow-md shadow-[#fbc111]/30">
                      <FiPlus size={12} className="sm:w-3.5 sm:h-3.5" strokeWidth={3} />
                    </div>
                    Add Teammate
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 3: Submission Area */}
        <div className="bg-white rounded-[40px] p-6 sm:p-10 shadow-sm border border-gray-100">
          {/* Title with separator */}
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Submission Area</h2>
            <div className="flex-1 h-[2px] bg-gradient-to-r from-[#8cc63f] to-transparent rounded-full" />
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
            <div className="space-y-3">
              <DropZone
                id="project-pic-upload"
                label="Upload Project Image"
                accept="image/png, image/jpeg"
                icon={FiImage}
                hint="Drop your PNG/JPG here"
                note="Max size 5MB · PNG or JPG"
                file={projectPic}
                onFileChange={f => {
                  if (f.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB.'); return; }
                  setProjectPic(f);
                  toast.success('Project image selected!');
                }}
                accentColor="#8cc63f"
              />
              <p className="text-[10px] text-[#fbc111] font-bold px-1">
                📌 Filename should be: <span className="font-black">yourUserName_project.jpg/.png</span> or <span className="font-black">yourTeamName_yourUserName.jpg/.png</span>
              </p>
            </div>

            <div className="space-y-3">
              <DropZone
                id="project-pdf-upload"
                label="Upload Project PDF"
                accept="application/pdf"
                icon={FiFileText}
                hint="Drop your PDF here"
                note="Max size 10MB · PDF"
                file={projectPdf}
                onFileChange={f => {
                  if (f.size > 10 * 1024 * 1024) { toast.error('PDF must be under 10MB.'); return; }
                  setProjectPdf(f);
                  toast.success('Project PDF selected!');
                }}
                accentColor="#fbc111"
              />
              <p className="text-[10px] text-[#fbc111] font-bold px-1">
                📌 Filename should be: <span className="font-black">yourUserName_project.pdf</span> or <span className="font-black">yourTeamName_yourUserName.pdf</span>
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-5 mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <PortalInput
                id="github-link"
                label="GitHub Repo Link"
                value={githubLink}
                onChange={e => setGithubLink(e.target.value)}
                placeholder="https://github.com/..."
                icon={FiGithub}
                subNote="Make sure link is public"
                borderColor="border-[#fbc111]/50 focus-within:border-[#fbc111]"
              />
              <PortalInput
                id="live-link"
                label="Live Link"
                value={liveLink}
                onChange={e => setLiveLink(e.target.value)}
                placeholder="https://myproject.vercel.app"
                icon={FiGlobe}
                subNote="Make sure link is public"
                borderColor="border-[#8cc63f]/50 focus-within:border-[#8cc63f]"
              />
            </div>

            <PortalInput
              id="drive-link"
              label="Google Drive Link"
              value={driveLink}
              onChange={e => setDriveLink(e.target.value)}
              placeholder="https://drive.google.com/..."
              icon={FiLink2}
              subNote="Make sure link is public"
              borderColor="border-[#8cc63f]/50 focus-within:border-[#8cc63f]"
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-center pt-4">
          <Button
            variant="portalSubmit"
            text="Final Submit"
            icon={FiSend}
            isLoading={isSubmitting}
            loadingText="Submitting..."
            onClick={handleSubmit}
            className="w-max px-14"
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// HELPER: Section title with number badge
// ─────────────────────────────────────────────────────────────
const SectionTitle = ({ label, title, accent }) => (
  <div className="flex items-center gap-4">
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black text-white shrink-0 shadow-md"
      style={{ background: accent === '#fbc111' ? '#fbc111' : '#8cc63f', boxShadow: `0 4px 14px ${accent}44` }}
    >
      {label}
    </div>
    <h2 className="text-xl font-black text-slate-900 tracking-tight">{title}</h2>
    <div className={`flex-1 h-[2px] bg-gradient-to-r ${accent === '#fbc111' ? 'from-[#fbc111]' : 'from-[#8cc63f]'} to-transparent rounded-full`} />
  </div>
);

export default StudentSubmission;
