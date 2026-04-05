import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiTrendingUp, FiUsers, FiBold, FiItalic, FiList, FiSend, FiChevronDown } from 'react-icons/fi';
import { toast } from 'react-toastify';
import AdminLayout from '../../layouts/AdminLayout';

export default function ReviewSubmissions() {
  const [loading, setLoading] = useState(true);

  // States for interactive Dropdowns and Sliders
  const [selectedContest, setSelectedContest] = useState('Eco-Urban Design 2024');
  const [selectedParticipant, setSelectedParticipant] = useState('Marcus Aurelius (Selected)');
  const [reviewDraft, setReviewDraft] = useState('');

  // Example submission data
  const [submission, setSubmission] = useState({
    participantName: 'Marcus Aurelius',
    participantTrack: 'SCHOLAR TRACK',
    submittedAt: 'Oct 14, 2023 • 14:32 PM',
    projectImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    abstract: `"The 'Verdant Nexus' concept aims to integrate modular vertical gardening with affordable residential units, reducing the urban heat island effect while fostering community-based food production."`,
    githubLink: 'https://github.com/marcus-aurelius/eco-urban-design',
    liveUrl: 'https://eco-urban-nexus.netlify.app',
    googleDriveLink: 'https://drive.google.com/drive/folders/shared-assets-link',
    pdfUrl: '/samples/project-detailed-plan.pdf',
    username: 'marcus_aurelius',
    metrics: {
      innovation: 8,
      technical: 9,
      presentation: 7,
      codeQuality: 8,
      deployment: 6,
      designQuality: 7,
      thinking: 9,
      functionality: 8
    }
  });

  const [scoreMode, setScoreMode] = useState('performance'); // 'performance' or 'custom'
  const [customScore, setCustomScore] = useState(8.5);

  const performanceAverage = React.useMemo(() => {
    return (Object.values(submission.metrics).reduce((a, b) => a + b, 0) / Object.keys(submission.metrics).length).toFixed(1);
  }, [submission.metrics]);

  const finalScore = React.useMemo(() => {
    return scoreMode === 'performance' ? performanceAverage : customScore;
  }, [scoreMode, performanceAverage, customScore]);

  const [copiedLink, setCopiedLink] = useState(null);

  const copyToClipboard = React.useCallback((text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(type);
    setTimeout(() => setCopiedLink(null), 2000);
  }, []);

  const handleMetricChange = React.useCallback((metric, value) => {
    setSubmission(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [metric]: parseInt(value)
      }
    }));
  }, []);

  // =========================================================================
  // 🚀 BACKEND API INTEGRATION: FETCH SUBMISSION DATA (GET)
  // =========================================================================
  /*
  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await fetch(`http://YOUR_BACKEND_URL/api/v1/submissions?contestId=xyz&participantId=abc`);
        const data = await response.json();
        if(response.ok) {
           setSubmission(data.submission);
        }
      } catch (error) {
        console.error("API error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmission();
  }, [selectedContest, selectedParticipant]);
  */
  // =========================================================================

  const handleSubmitReview = React.useCallback(async () => {
    if(!reviewDraft.trim()) return toast.warning('Please enter review narrative');
    
    // MOCK SUBMIT
    console.log("Submitted Review:", { reviewDraft, metrics: submission.metrics, finalScore });
    toast.success(`Review Submitted successfully! Final Score: ${finalScore}`);
    setReviewDraft('');
  }, [reviewDraft, submission.metrics, finalScore]);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">
        
        {/* Header Area */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-4">
          <div className="space-y-2">
            <h4 className="text-[#fbc111] text-[10px] sm:text-[12px] font-black tracking-[0.2em] uppercase">
              Scholastic Atelier
            </h4>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
              Review <br className="hidden md:block"/> Submissions
            </h1>
            <p className="text-gray-600 font-bold text-sm sm:text-base leading-relaxed max-w-lg mt-3">
              Evaluate the creativity and technical prowess of the next generation of designers.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto mt-4 lg:mt-0">
            <div className="space-y-2 flex-1 sm:w-64">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-900">Select Contest</label>
              <div className="relative">
                <select 
                  value={selectedContest}
                  onChange={(e) => setSelectedContest(e.target.value)}
                  className="w-full bg-[#f1f8e8] border border-transparent hover:border-[#8cc63f]/30 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 outline-none appearance-none cursor-pointer transition-all"
                >
                  <option>Eco-Urban Design 2024</option>
                  <option>Future Mobility Concept</option>
                </select>
                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2 flex-1 sm:w-64">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-900">Select Participant</label>
              <div className="relative">
                <select 
                  value={selectedParticipant}
                  onChange={(e) => setSelectedParticipant(e.target.value)}
                  className="w-full bg-[#f1f8e8] border border-transparent hover:border-[#8cc63f]/30 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 outline-none appearance-none cursor-pointer transition-all"
                >
                  <option>Marcus Aurelius (Selected)</option>
                  <option>Jane Doe (Pending)</option>
                </select>
                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column - Submission Details */}
          <div className="lg:col-span-8 bg-white rounded-[32px] sm:rounded-[40px] p-6 lg:p-10 shadow-sm border border-transparent hover:border-gray-50 flex flex-col gap-8 transition-all">
            
            {/* User Profile Banner */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src="https://i.pravatar.cc/150?img=11" className="w-14 h-14 rounded-2xl object-cover shadow-sm bg-gray-100" alt="avatar" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">{submission.participantName}</h2>
                  <p className="text-xs font-bold text-gray-500 mt-0.5">Submitted on {submission.submittedAt}</p>
                </div>
              </div>
              <span className="bg-[#fbc111]/20 text-[#d4a000] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                {submission.participantTrack}
              </span>
            </div>

            {/* Project Render */}
            <div className="w-full h-64 md:h-[400px] bg-slate-900 rounded-[24px] overflow-hidden shadow-inner relative group cursor-crosshair">
              <img 
                src={submission.projectImage} 
                alt="Project Entry" 
                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>

            {/* Student Submission Links (Refined) */}
            <div className="space-y-4 pt-6 border-t border-gray-100">
               <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Project Assets & Links</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* GitHub Link */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">GitHub Repository</label>
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
                      <input 
                        readOnly 
                        value={submission.githubLink}
                        className="flex-1 bg-transparent px-2 py-1 text-xs font-bold text-slate-600 outline-none overflow-hidden text-ellipsis"
                      />
                      <button 
                        onClick={() => copyToClipboard(submission.githubLink, 'github')}
                        className="p-2 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors flex items-center gap-1.5"
                      >
                         {copiedLink === 'github' ? <span className="text-[9px] font-black text-green-600">COPIED</span> : null}
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                      </button>
                    </div>
                  </div>

                   {/* Live Link */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Live Deployment</label>
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
                      <input 
                        readOnly 
                        value={submission.liveUrl}
                        className="flex-1 bg-transparent px-2 py-1 text-xs font-bold text-slate-600 outline-none overflow-hidden text-ellipsis"
                      />
                      <button 
                        onClick={() => copyToClipboard(submission.liveUrl, 'live')}
                        className="p-2 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors flex items-center gap-1.5"
                      >
                         {copiedLink === 'live' ? <span className="text-[9px] font-black text-green-600">COPIED</span> : null}
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                      </button>
                    </div>
                  </div>

                  {/* Google Drive Link */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Google Drive Assets</label>
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
                      <input 
                        readOnly 
                        value={submission.googleDriveLink}
                        className="flex-1 bg-transparent px-2 py-1 text-xs font-bold text-slate-600 outline-none overflow-hidden text-ellipsis"
                      />
                      <button 
                        onClick={() => copyToClipboard(submission.googleDriveLink, 'drive')}
                        className="p-2 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors flex items-center gap-1.5"
                      >
                         {copiedLink === 'drive' ? <span className="text-[9px] font-black text-green-600">COPIED</span> : null}
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                      </button>
                    </div>
                  </div>
               </div>

               {/* PDF Download Section */}
               <div className="flex items-center justify-between bg-[#f8faf6] p-4 rounded-2xl border border-[#8cc63f]/10 group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Document Submission</p>
                      <h4 className="text-sm font-bold text-slate-700">Project-Detailed-Syllabus.pdf</h4>
                    </div>
                  </div>
                  <a 
                    href={submission.pdfUrl}
                    download={`${submission.participantName}_${submission.username}.pdf`}
                    className="p-3 bg-[#8cc63f] hover:bg-[#7eb533] text-white rounded-xl transition-all shadow-md group-hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  </a>
               </div>
            </div>

            {/* Narrative Feedback Section (Moved from right column) */}
            <div className="bg-[#f8faf6]/30 rounded-[32px] p-6 sm:p-8 border border-[#8cc63f]/10 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#8cc63f]/10 rounded-xl text-[#8cc63f]">
                  <FiList size={20} />
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Technical & Narrative Feedback</h3>
              </div>

              <div className="bg-white border-2 border-slate-100 focus-within:border-[#8cc63f]/20 rounded-2xl overflow-hidden transition-all flex flex-col min-h-[200px] shadow-sm">
                <div className="flex gap-4 px-4 py-2.5 border-b border-gray-50 bg-gray-50/50">
                  <button className="text-gray-400 hover:text-slate-900 transition-colors"><FiBold size={14} /></button>
                  <button className="text-gray-400 hover:text-slate-900 transition-colors"><FiItalic size={14} /></button>
                  <button className="text-gray-400 hover:text-slate-900 transition-colors"><FiList size={14} /></button>
                </div>
                <textarea 
                  value={reviewDraft}
                  onChange={(e) => setReviewDraft(e.target.value)}
                  placeholder="Record your executive evaluation and narrative feedback here..."
                  className="w-full h-full min-h-[160px] bg-transparent p-5 text-sm font-semibold text-slate-700 outline-none resize-none placeholder:text-gray-400"
                />
              </div>

              <button 
                onClick={handleSubmitReview}
                className="w-full sm:w-fit bg-[#8cc63f] hover:bg-[#7db534] text-white py-4 px-10 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                Submit Final Review <FiSend size={18} />
              </button>
            </div>
          </div>

          {/* Right Column - Scoring and Review */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Performance Metrics Card */}
            <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-green-50 rounded-xl text-green-600 hidden sm:block">
                    <FiTrendingUp size={20} className="text-[#8cc63f]" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">Performance Metrics</h3>
                </div>
                
                {/* Score Mode Toggle */}
                <div className="flex bg-gray-100 p-1.5 rounded-2xl gap-2">
                  <button 
                    onClick={() => setScoreMode('performance')}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${scoreMode === 'performance' ? 'bg-white text-[#8cc63f] shadow-sm' : 'text-gray-400'}`}
                  >
                    Performance
                  </button>
                  <button 
                    onClick={() => setScoreMode('custom')}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${scoreMode === 'custom' ? 'bg-white text-[#fbc111] shadow-sm' : 'text-gray-400'}`}
                  >
                    Custom
                  </button>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Innovation Score */}
                <div className="space-y-2 group">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-slate-800">Innovation</span>
                    <div className="flex items-center gap-2">
                       <input 
                         type="number" 
                         min="0" max="10"
                         value={submission.metrics.innovation}
                         onChange={(e) => handleMetricChange('innovation', e.target.value)}
                         className="w-10 bg-transparent text-right text-xs font-black text-[#8cc63f] outline-none border-b border-transparent focus:border-[#8cc63f]"
                       />
                       <span className="text-[10px] text-gray-400 font-bold">/10</span>
                    </div>
                  </div>
                  <input 
                    type="range" min="0" max="10" 
                    value={submission.metrics.innovation}
                    onChange={(e) => handleMetricChange('innovation', e.target.value)}
                    className="w-full h-2 bg-[#f1f8e8] rounded-full appearance-none cursor-pointer accent-[#8cc63f]"
                  />
                </div>

                {/* Technical Execution Score */}
                <div className="space-y-2 group">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-slate-800">Technical Execution</span>
                    <div className="flex items-center gap-2">
                       <input 
                         type="number" 
                         min="0" max="10"
                         value={submission.metrics.technical}
                         onChange={(e) => handleMetricChange('technical', e.target.value)}
                         className="w-10 bg-transparent text-right text-xs font-black text-[#8cc63f] outline-none border-b border-transparent focus:border-[#8cc63f]"
                       />
                       <span className="text-[10px] text-gray-400 font-bold">/10</span>
                    </div>
                  </div>
                  <input 
                    type="range" min="0" max="10" 
                    value={submission.metrics.technical}
                    onChange={(e) => handleMetricChange('technical', e.target.value)}
                    className="w-full h-2 bg-[#f1f8e8] rounded-full appearance-none cursor-pointer accent-[#8cc63f]"
                  />
                </div>

                {/* Presentation Score */}
                <div className="space-y-2 group">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-slate-800">Presentation</span>
                    <div className="flex items-center gap-2">
                       <input 
                         type="number" 
                         min="0" max="10"
                         value={submission.metrics.presentation}
                         onChange={(e) => handleMetricChange('presentation', e.target.value)}
                         className="w-10 bg-transparent text-right text-xs font-black text-[#8cc63f] outline-none border-b border-transparent focus:border-[#8cc63f]"
                       />
                       <span className="text-[10px] text-gray-400 font-bold">/10</span>
                    </div>
                  </div>
                  <input 
                    type="range" min="0" max="10" 
                    value={submission.metrics.presentation}
                    onChange={(e) => handleMetricChange('presentation', e.target.value)}
                    className="w-full h-2 bg-[#f1f8e8] rounded-full appearance-none cursor-pointer accent-[#8cc63f]"
                  />
                </div>

                {/* Code Quality Score */}
                <div className="space-y-2 group">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-slate-800">Code Quality</span>
                    <div className="flex items-center gap-2">
                       <input 
                         type="number" 
                         min="0" max="10"
                         value={submission.metrics.codeQuality}
                         onChange={(e) => handleMetricChange('codeQuality', e.target.value)}
                         className="w-10 bg-transparent text-right text-xs font-black text-[#8cc63f] outline-none border-b border-transparent focus:border-[#8cc63f]"
                       />
                       <span className="text-[10px] text-gray-400 font-bold">/10</span>
                    </div>
                  </div>
                  <input 
                    type="range" min="0" max="10" 
                    value={submission.metrics.codeQuality}
                    onChange={(e) => handleMetricChange('codeQuality', e.target.value)}
                    className="w-full h-2 bg-[#f1f8e8] rounded-full appearance-none cursor-pointer accent-[#8cc63f]"
                  />
                </div>

                {/* Deployment Score */}
                <div className="space-y-2 group">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-slate-800">Deployment</span>
                    <div className="flex items-center gap-2">
                       <input 
                         type="number" 
                         min="0" max="10"
                         value={submission.metrics.deployment}
                         onChange={(e) => handleMetricChange('deployment', e.target.value)}
                         className="w-10 bg-transparent text-right text-xs font-black text-[#8cc63f] outline-none border-b border-transparent focus:border-[#8cc63f]"
                       />
                       <span className="text-[10px] text-gray-400 font-bold">/10</span>
                    </div>
                  </div>
                  <input 
                    type="range" min="0" max="10" 
                    value={submission.metrics.deployment}
                    onChange={(e) => handleMetricChange('deployment', e.target.value)}
                    className="w-full h-2 bg-[#f1f8e8] rounded-full appearance-none cursor-pointer accent-[#8cc63f]"
                  />
                </div>

                {/* Design Quality Score */}
                <div className="space-y-2 group">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-slate-800">Design Quality</span>
                    <div className="flex items-center gap-2">
                       <input 
                         type="number" 
                         min="0" max="10"
                         value={submission.metrics.designQuality}
                         onChange={(e) => handleMetricChange('designQuality', e.target.value)}
                         className="w-10 bg-transparent text-right text-xs font-black text-[#8cc63f] outline-none border-b border-transparent focus:border-[#8cc63f]"
                       />
                       <span className="text-[10px] text-gray-400 font-bold">/10</span>
                    </div>
                  </div>
                  <input 
                    type="range" min="0" max="10" 
                    value={submission.metrics.designQuality}
                    onChange={(e) => handleMetricChange('designQuality', e.target.value)}
                    className="w-full h-2 bg-[#f1f8e8] rounded-full appearance-none cursor-pointer accent-[#8cc63f]"
                  />
                </div>

                {/* Thinking Score */}
                <div className="space-y-2 group">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-slate-800">Thinking</span>
                    <div className="flex items-center gap-2">
                       <input 
                         type="number" 
                         min="0" max="10"
                         value={submission.metrics.thinking}
                         onChange={(e) => handleMetricChange('thinking', e.target.value)}
                         className="w-10 bg-transparent text-right text-xs font-black text-[#8cc63f] outline-none border-b border-transparent focus:border-[#8cc63f]"
                       />
                       <span className="text-[10px] text-gray-400 font-bold">/10</span>
                    </div>
                  </div>
                  <input 
                    type="range" min="0" max="10" 
                    value={submission.metrics.thinking}
                    onChange={(e) => handleMetricChange('thinking', e.target.value)}
                    className="w-full h-2 bg-[#f1f8e8] rounded-full appearance-none cursor-pointer accent-[#8cc63f]"
                  />
                </div>

                {/* Functionality Score */}
                <div className="space-y-2 group">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-slate-800">Functionality</span>
                    <div className="flex items-center gap-2">
                       <input 
                         type="number" 
                         min="0" max="10"
                         value={submission.metrics.functionality}
                         onChange={(e) => handleMetricChange('functionality', e.target.value)}
                         className="w-10 bg-transparent text-right text-xs font-black text-[#8cc63f] outline-none border-b border-transparent focus:border-[#8cc63f]"
                       />
                       <span className="text-[10px] text-gray-400 font-bold">/10</span>
                    </div>
                  </div>
                  <input 
                    type="range" min="0" max="10" 
                    value={submission.metrics.functionality}
                    onChange={(e) => handleMetricChange('functionality', e.target.value)}
                    className="w-full h-2 bg-[#f1f8e8] rounded-full appearance-none cursor-pointer accent-[#8cc63f]"
                  />
                </div>

                {/* Custom/Final Score Override */}
                <div className="pt-6 border-t border-gray-100 mt-4">
                  <div className={`p-5 rounded-[24px] border transition-all space-y-4 ${scoreMode === 'performance' ? 'bg-[#f8faf6] border-[#8cc63f]/20' : 'bg-[#fffdf8] border-[#fbc111]/30 shadow-lg shadow-yellow-500/5'}`}>
                     <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                           <label className={`text-[11px] font-black uppercase tracking-widest ${scoreMode === 'performance' ? 'text-[#8cc63f]' : 'text-[#d4a000]'}`}>
                             {scoreMode === 'performance' ? 'Calculated Average' : 'Custom Final Score'}
                           </label>
                           <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Current Deployment Value</span>
                        </div>
                        <div className="bg-white px-5 py-2 rounded-[14px] shadow-sm border border-gray-100">
                           <input 
                             type="number" 
                             step="0.1"
                             min="0" max="10"
                             readOnly={scoreMode === 'performance'}
                             value={finalScore}
                             onChange={(e) => setCustomScore(parseFloat(e.target.value))}
                             className={`w-14 bg-transparent text-center font-black outline-none text-lg ${scoreMode === 'performance' ? 'text-[#8cc63f]' : 'text-slate-900'}`}
                           />
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>


            
          </div>
        </div>



      </div>
    </AdminLayout>
  );
}
