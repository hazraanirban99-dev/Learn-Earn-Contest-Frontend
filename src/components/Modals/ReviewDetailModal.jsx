// ============================================================
// ReviewDetailModal.jsx — Admin e submission er detail dekha r score dewa modal
// ReviewSubmissions page theke ei modal open hoy.
// Participant er project URL, thumbnail, PDF dekhano hoy.
// Score input field e admin score dite pare (0-100).
// "Submit Review" click hole backend e score pathano hoy.
// Submit successful hole parent component e onReviewSubmit() callback hoy,
// jeta participant er status update kore local state e.
// ============================================================

import React, { useState } from 'react';
import { FiX, FiTrendingUp, FiList, FiSend, FiExternalLink, FiCode, FiHardDrive, FiDownload, FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../utils/api';

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
    <div className="flex bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3 rounded-2xl items-center gap-3 shadow-sm">
      <Icon className="text-gray-400 flex-shrink-0" size={14} />
      <span className="text-xs font-bold text-slate-600 dark:text-gray-300 truncate flex-1 min-w-0">{value}</span>
      <button
        onClick={() => onCopy(value, copyKey)}
        className="shrink-0 text-[#8cc63f] hover:text-[#7ab332] text-[10px] font-black uppercase tracking-widest transition-colors"
      >
        {copiedLink === copyKey ? '✓ Copied' : 'Copy'}
      </button>
    </div>
  </div>
);

const ReviewDetailModal = ({ isOpen, onClose, participant, onReviewSubmit }) => {
  const [reviewDraft, setReviewDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scoreMode, setScoreMode] = useState('performance');
  const [customScore, setCustomScore] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(null);
  const [metrics, setMetrics] = useState({
    innovation: 0,
    technical: 0,
    presentation: 0,
    codeQuality: 0,
    deployment: 0,
    designQuality: 0,
    thinking: 0,
    functionality: 0,
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

  const handleSubmitReview = async () => {
    if (!reviewDraft.trim()) return toast.warning('Please enter review narrative');
    
    setIsLoading(true);
    try {
      const { data } = await api.post('/admin/submissions/review', {
        submissionId: participant.id,
        score: finalScore,
        feedback: reviewDraft
      });

      if (data.success) {
        toast.success(`Review for ${participant.name} submitted! Score: ${finalScore}`);
        if (onReviewSubmit) {
          onReviewSubmit({
            ...participant,
            score: finalScore,
            status: 'REVIEWED',
            feedback: reviewDraft
          });
        }
        onClose();
      }
    } catch (error) {
      console.error("Review submission error:", error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen flex items-start justify-center p-3 sm:p-6 py-8">
        <div className="bg-white dark:bg-gray-800 w-full max-w-6xl rounded-[32px] sm:rounded-[40px] shadow-2xl relative flex flex-col">

          {/* Modal Header */}
          <div className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10 rounded-t-[32px] sm:rounded-t-[40px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover shadow-sm flex-shrink-0 bg-slate-100 dark:bg-gray-900 flex items-center justify-center text-[13px] font-black text-slate-500 overflow-hidden">
                {participant.avatar?.url || (typeof participant.avatar === 'string' && participant.avatar) ? (
                  <img
                    src={participant.avatar?.url || participant.avatar}
                    className="w-full h-full object-cover"
                    alt="avatar"
                  />
                ) : (
                  participant.name ? participant.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '??'
                )}
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-xl font-black text-slate-900 dark:text-gray-100 truncate">{participant.name}</h2>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] sm:text-xs font-bold text-gray-400">Participant Entry</p>
                  {participant.teamData && (
                    <span className="text-[9px] font-black text-[#8cc63f] border border-[#8cc63f]/20 bg-[#8cc63f]/5 px-2 py-0.5 rounded-full uppercase tracking-widest">TEAM</span>
                  )}
                </div>
              </div>
            </div>
            <button onClick={() => { onClose(); setIsFullscreen(false); }} className="p-2.5 hover:bg-gray-100 rounded-2xl text-gray-400 transition-colors flex-shrink-0 ml-4">
              <FiX size={20} />
            </button>
          </div>          {/* Team Members List (If Team) */}
          {participant.teamData && (
            <div className="px-5 sm:px-8 py-3 bg-[#fcf3d9]/30 dark:bg-amber-900/10 border-b border-[#fcf3d9]/50 dark:border-amber-900/20 flex flex-wrap gap-4 items-center transition-colors">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Squad Registry:</span>
              
              {/* Leader */}
              <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-3 py-1.5 rounded-xl border border-[#fcf3d9] dark:border-amber-900/30">
                <span className="text-xs">👑</span>
                <span className="text-xs font-bold text-slate-700 dark:text-gray-100">{participant.teamData.leader?.name} (Leader)</span>
              </div>
 
              {/* Teammates */}
              {participant.teamData.members?.map((m, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white dark:bg-gray-900 px-3 py-1.5 rounded-xl border border-[#fcf3d9] dark:border-amber-900/30">
                  <span className="text-xs">🤝</span>
                  <span className="text-xs font-bold text-slate-600 dark:text-gray-300">{m.name}</span>
                  <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-sm ${m.status === 'ACCEPTED' ? 'text-green-500 bg-green-50 dark:bg-green-900/20' : 'text-amber-500 bg-amber-50 dark:bg-amber-900/20'}`}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Modal Body */}
          <div className="p-4 sm:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">

              {/* Left Column — Project Details */}
              <div className="flex-1 min-w-0 flex flex-col gap-6">

                {/* Project Image or Placeholder */}
                <div className="flex items-start">
                  {participant.projectThumbnail ? (
                    <div 
                      onClick={() => setIsFullscreen(true)}
                      className="relative w-48 sm:w-64 aspect-video rounded-[20px] overflow-hidden shadow-md bg-slate-100 cursor-pointer group"
                    >
                      <img
                        src={participant.projectThumbnail}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        alt="Project Thumbnail"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                        <FiEye className="text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 drop-shadow-md" size={28} />
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-48 sm:w-64 aspect-video rounded-[20px] flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-900 dark:to-gray-800 shadow-sm border border-slate-200/50 dark:border-gray-800">
                      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm">
                        <FiCode className="text-slate-400" size={24} />
                      </div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">No preview</p>
                    </div>
                  )}
                </div>

                {/* Links Section */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-[24px] p-4 sm:p-6 space-y-3">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Project Assets & Links</h3>


                  {participant.githubLink && (
                    <LinkRow
                      label="GitHub Repository"
                      icon={FiCode}
                      value={participant.githubLink}
                      copyKey="github"
                      copiedLink={copiedLink}
                      onCopy={copyToClipboard}
                    />
                  )}
                  {participant.liveLink && (
                    <LinkRow
                      label="Live Demo URL"
                      icon={FiExternalLink}
                      value={participant.liveLink}
                      copyKey="live"
                      copiedLink={copiedLink}
                      onCopy={copyToClipboard}
                    />
                  )}
                  {participant.driveLink && (
                    <LinkRow
                      label="Google Drive / Assets"
                      icon={FiHardDrive}
                      value={participant.driveLink}
                      copyKey="drive"
                      copiedLink={copiedLink}
                      onCopy={copyToClipboard}
                    />
                  )}
                  <div className="p-3 bg-blue-50/50 rounded-2xl flex items-center gap-3 border border-blue-100/50">
                    <FiExternalLink className="text-blue-400" size={14} />
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none">Primary Asset</span>
                  </div>

                  {/* PDF Download */}
                  <div className="flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-3 sm:p-4 mt-2 shadow-sm group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-xl flex-shrink-0">
                        <svg className="w-4 h-4 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Document</p>
                        <p className="text-xs font-bold text-slate-700 dark:text-gray-200 truncate">Project-Detailed-Plan.pdf</p>
                      </div>
                    </div>
                    <a
                      href={participant.projectPdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-3 py-2 ${participant.projectPdf ? 'bg-[#8cc63f] hover:bg-[#7eb533]' : 'bg-gray-200 cursor-not-allowed'} text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md flex-shrink-0 ml-3`}
                    >
                      <FiDownload size={12} />
                      <span className="hidden sm:inline">{participant.projectPdf ? 'Download' : 'No PDF'}</span>
                    </a>
                  </div>
                </div>

                {/* Narrative Feedback */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <FiList className="text-[#fbc111]" />
                    <h3 className="font-black text-[#fbc111] text-[13px] uppercase tracking-widest">Narrative Evaluation</h3>
                  </div>
                  <textarea
                    className="w-full h-36 bg-gray-50 dark:bg-slate-950 rounded-[20px] p-5 text-sm font-semibold text-slate-700 dark:text-gray-100 border-2 border-transparent focus:border-[#fbc111]/20 outline-none resize-none placeholder:text-gray-300 dark:placeholder:text-gray-600 transition-all shadow-inner"
                    placeholder="Type your detailed feedback here..."
                    value={reviewDraft}
                    onChange={(e) => setReviewDraft(e.target.value)}
                  />
                </div>
              </div>

              {/* Right Column — Scoring Panel */}
              <div className="w-full lg:w-[340px] xl:w-[360px] flex-shrink-0 flex flex-col gap-5 bg-slate-50 dark:bg-gray-900 rounded-[28px] p-5 sm:p-7 border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">

                {/* Header + Toggle */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <FiTrendingUp className="text-[#fbc111]" />
                    <h3 className="font-black text-slate-800 dark:text-gray-100 text-[13px] uppercase tracking-widest">Scoring</h3>
                  </div>
                  <div className="flex bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
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
                        <span className="text-[11px] font-bold text-slate-600 dark:text-gray-300">{METRIC_LABELS[key]}</span>
                        <span className="text-xs font-black text-[#8cc63f]">{value}<span className="text-gray-300 dark:text-gray-600 font-bold">/10</span></span>
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
                      className="bg-transparent text-4xl font-black text-slate-800 dark:text-gray-100 w-20 text-center outline-none"
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

      {/* Fullscreen Image Overlay */}
      {isFullscreen && participant.projectThumbnail && (
        <div 
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-10 cursor-pointer animate-in fade-in duration-300"
          onClick={() => setIsFullscreen(false)}
        >
          <img 
            src={participant.projectThumbnail} 
            alt="Fullscreen Preview" 
            className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain animate-in zoom-in-95 duration-300"
          />
          <button 
            className="absolute top-6 right-6 p-4 bg-white/ dark:bg-gray-800/ hover:bg-white/ dark:bg-gray-800/ text-white rounded-full backdrop-blur-md transition-all border border-white/20 hover:scale-110"
            onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}
          >
            <FiX size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewDetailModal;
