import React, { useState } from 'react';
import { FiX, FiTrendingUp, FiList, FiSend, FiExternalLink, FiCode, FiHardDrive, FiDownload } from 'react-icons/fi';
import { toast } from 'react-toastify';

// Mock submission links — replace with actual participant data from API
const MOCK_SUBMISSION = {
  githubLink: 'https://github.com/marcus-aurelius/eco-urban-design',
  liveUrl: 'https://eco-urban-nexus.netlify.app',
  googleDriveLink: 'https://drive.google.com/drive/folders/shared-assets-link',
  pdfUrl: '/samples/project-detailed-plan.pdf',
  projectImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
};

const METRIC_LABELS = {
  innovation: 'Innovation',
  technical: 'Technical Execution',
  presentation: 'Presentation',
  codeQuality: 'Code Quality',
  deployment: 'Deployment',
  designQuality: 'Design Quality',
  thinking: 'Thinking',
  functionality: 'Functionality',
};

const LinkRow = ({ label, icon: Icon, value, copyKey, copiedLink, onCopy }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">{label}</label>
    <div className="flex bg-white border border-gray-100 p-3 rounded-2xl items-center gap-3 shadow-sm">
      <Icon className="text-gray-400 flex-shrink-0" size={14} />
      <span className="text-xs font-bold text-slate-600 truncate flex-1 min-w-0">{value}</span>
      <button
        onClick={() => onCopy(value, copyKey)}
        className="shrink-0 text-[#8cc63f] hover:text-[#7ab332] text-[10px] font-black uppercase tracking-widest transition-colors"
      >
        {copiedLink === copyKey ? '✓ Copied' : 'Copy'}
      </button>
    </div>
  </div>
);

const ReviewDetailModal = ({ isOpen, onClose, participant }) => {
  const [reviewDraft, setReviewDraft] = useState('');
  const [scoreMode, setScoreMode] = useState('performance');
  const [customScore, setCustomScore] = useState(8.5);
  const [copiedLink, setCopiedLink] = useState(null);
  const [metrics, setMetrics] = useState({
    innovation: 8,
    technical: 9,
    presentation: 7,
    codeQuality: 8,
    deployment: 6,
    designQuality: 7,
    thinking: 9,
    functionality: 8,
  });

  const performanceAverage = React.useMemo(() =>
    (Object.values(metrics).reduce((a, b) => a + b, 0) / Object.keys(metrics).length).toFixed(1),
    [metrics]
  );

  const finalScore = scoreMode === 'performance' ? performanceAverage : customScore;

  const copyToClipboard = React.useCallback((text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(type);
    setTimeout(() => setCopiedLink(null), 2000);
  }, []);

  const handleMetricChange = (metric, value) => {
    setMetrics(prev => ({ ...prev, [metric]: parseInt(value) }));
  };

  const handleSubmitReview = () => {
    if (!reviewDraft.trim()) return toast.warning('Please enter review narrative');
    toast.success(`Review for ${participant.name} submitted! Score: ${finalScore}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen flex items-start justify-center p-3 sm:p-6 py-8">
        <div className="bg-white w-full max-w-6xl rounded-[32px] sm:rounded-[40px] shadow-2xl relative flex flex-col">

          {/* Modal Header */}
          <div className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-[32px] sm:rounded-t-[40px]">
            <div className="flex items-center gap-3">
              <img
                src={participant.avatar || 'https://i.pravatar.cc/150?img=11'}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover shadow-sm flex-shrink-0"
                alt="avatar"
              />
              <div className="min-w-0">
                <h2 className="text-base sm:text-xl font-black text-slate-900 truncate">{participant.name}</h2>
                <p className="text-[10px] sm:text-xs font-bold text-gray-400">Participant Entry</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2.5 hover:bg-gray-100 rounded-2xl text-gray-400 transition-colors flex-shrink-0 ml-4">
              <FiX size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">

              {/* Left Column — Project Details */}
              <div className="flex-1 min-w-0 flex flex-col gap-6">

                {/* Project Image */}
                <div className="relative aspect-video rounded-[24px] overflow-hidden shadow-lg bg-slate-100">
                  <img
                    src={MOCK_SUBMISSION.projectImage}
                    className="w-full h-full object-cover"
                    alt="Project"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                {/* Links Section */}
                <div className="bg-gray-50 rounded-[24px] p-4 sm:p-6 space-y-3">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Project Assets & Links</h3>

                  <LinkRow
                    label="GitHub Repository"
                    icon={FiCode}
                    value={MOCK_SUBMISSION.githubLink}
                    copyKey="github"
                    copiedLink={copiedLink}
                    onCopy={copyToClipboard}
                  />
                  <LinkRow
                    label="Live Demo"
                    icon={FiExternalLink}
                    value={MOCK_SUBMISSION.liveUrl}
                    copyKey="live"
                    copiedLink={copiedLink}
                    onCopy={copyToClipboard}
                  />
                  <LinkRow
                    label="Google Drive Assets"
                    icon={FiHardDrive}
                    value={MOCK_SUBMISSION.googleDriveLink}
                    copyKey="drive"
                    copiedLink={copiedLink}
                    onCopy={copyToClipboard}
                  />

                  {/* PDF Download */}
                  <div className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl p-3 sm:p-4 mt-2 shadow-sm group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-red-50 rounded-xl flex-shrink-0">
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Document</p>
                        <p className="text-xs font-bold text-slate-700 truncate">Project-Detailed-Plan.pdf</p>
                      </div>
                    </div>
                    <a
                      href={MOCK_SUBMISSION.pdfUrl}
                      download
                      className="flex items-center gap-2 px-3 py-2 bg-[#8cc63f] hover:bg-[#7eb533] text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md flex-shrink-0 ml-3"
                    >
                      <FiDownload size={12} />
                      <span className="hidden sm:inline">Download</span>
                    </a>
                  </div>
                </div>

                {/* Narrative Feedback */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <FiList className="text-[#8cc63f]" />
                    <h3 className="font-black text-slate-800 text-[13px] uppercase tracking-widest">Narrative Evaluation</h3>
                  </div>
                  <textarea
                    className="w-full h-36 bg-gray-50 rounded-[20px] p-5 text-sm font-semibold text-slate-700 border-2 border-transparent focus:border-[#8cc63f]/20 outline-none resize-none placeholder:text-gray-300 transition-all"
                    placeholder="Type your detailed feedback here..."
                    value={reviewDraft}
                    onChange={(e) => setReviewDraft(e.target.value)}
                  />
                </div>
              </div>

              {/* Right Column — Scoring Panel */}
              <div className="w-full lg:w-[340px] xl:w-[360px] flex-shrink-0 flex flex-col gap-5 bg-slate-50 rounded-[28px] p-5 sm:p-7 border border-gray-100">

                {/* Header + Toggle */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <FiTrendingUp className="text-[#fbc111]" />
                    <h3 className="font-black text-slate-800 text-[13px] uppercase tracking-widest">Scoring</h3>
                  </div>
                  <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                    <button
                      onClick={() => setScoreMode('performance')}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${scoreMode === 'performance' ? 'bg-[#8cc63f] text-white shadow' : 'text-gray-400'}`}
                    >
                      Auto
                    </button>
                    <button
                      onClick={() => setScoreMode('custom')}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${scoreMode === 'custom' ? 'bg-[#fbc111] text-white shadow' : 'text-gray-400'}`}
                    >
                      Custom
                    </button>
                  </div>
                </div>

                {/* Metric Sliders */}
                <div className="space-y-4">
                  {Object.entries(metrics).map(([key, value]) => (
                    <div key={key} className="space-y-1.5">
                      <div className="flex justify-between items-center px-0.5">
                        <span className="text-[11px] font-bold text-slate-600">{METRIC_LABELS[key]}</span>
                        <span className="text-xs font-black text-[#8cc63f]">{value}<span className="text-gray-300 font-bold">/10</span></span>
                      </div>
                      <input
                        type="range" min="0" max="10" value={value}
                        onChange={(e) => handleMetricChange(key, e.target.value)}
                        className="w-full h-1.5 bg-gray-200 rounded-full appearance-none accent-[#8cc63f] cursor-pointer"
                      />
                    </div>
                  ))}
                </div>

                {/* Final Score */}
                <div className={`p-5 rounded-2xl flex flex-col gap-1 text-center transition-all border ${scoreMode === 'performance' ? 'bg-[#8cc63f]/5 border-[#8cc63f]/20' : 'bg-[#fbc111]/5 border-[#fbc111]/20'}`}>
                  <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${scoreMode === 'performance' ? 'text-[#8cc63f]' : 'text-[#fbc111]'}`}>
                    {scoreMode === 'performance' ? 'Calculated Average' : 'Custom Score'}
                  </label>
                  <div className="flex items-center justify-center gap-2">
                    <input
                      type="number" step="0.1" min="0" max="10"
                      readOnly={scoreMode === 'performance'}
                      value={finalScore}
                      onChange={(e) => setCustomScore(parseFloat(e.target.value))}
                      className="bg-transparent text-4xl font-black text-slate-800 w-20 text-center outline-none"
                    />
                    <span className="text-xl font-bold text-gray-300">/ 10</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmitReview}
                  className="w-full bg-[#8cc63f] hover:bg-[#7db534] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:shadow-xl active:scale-95 shadow-lg shadow-[#8cc63f]/20"
                >
                  Submit Review <FiSend size={16} />
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailModal;
