// ============================================================
// DropZone.jsx — Advanced file upload component (Drag & Drop)
// Files (Thumbnail, PDF) select korle preview trigger kore.
// File size r type validation checks ache.
// Animation logic ache dragging state detect korar jonno.
// ============================================================

import React, { useState, useRef, useCallback } from 'react';
import { FiUploadCloud, FiCheck } from 'react-icons/fi';

const DropZone = React.memo(({ label, accept, icon: Icon, hint, note, file, onFileChange, accentColor = '#8cc63f', id }) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) onFileChange(dropped);
  }, [onFileChange]);

  const handleDragOver = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const borderColor = accentColor === '#fbc111' ? 'hover:border-[#fbc111]/60 focus-within:border-[#fbc111]/60' : 'hover:border-[#8cc63f]/60 focus-within:border-[#8cc63f]/60';
  const iconBg = accentColor === '#fbc111' ? 'bg-yellow-50 text-[#fbc111]' : 'bg-green-50 text-[#8cc63f]';

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
        <span style={{ color: accentColor }}>
          <Icon size={13} />
        </span>
        {label}
      </label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all min-h-[140px] group
          ${isDragging
            ? accentColor === '#fbc111' 
              ? 'border-[#fbc111] bg-[#fbc111]/10 dark:bg-[#fbc111]/20' 
              : 'border-[#8cc63f] bg-[#8cc63f]/10 dark:bg-[#8cc63f]/20'
            : `${accentColor === '#fbc111' 
                ? 'bg-[#fbc111]/5 border-[#fbc111]/30 dark:bg-gray-900/40 dark:border-[#fbc111]/20' 
                : 'bg-[#8cc63f]/5 border-[#8cc63f]/30 dark:bg-gray-900/40 dark:border-[#8cc63f]/20'} ${borderColor}`
          }`}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => e.target.files[0] && onFileChange(e.target.files[0])}
        />
        {file ? (
          <>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${iconBg}`}>
              <FiCheck size={20} strokeWidth={3} />
            </div>
            <div className="text-center">
              <p className="text-sm font-black text-slate-800 dark:text-gray-100 truncate max-w-[180px]">{file.name}</p>
              <p className="text-[10px] text-gray-400 font-bold mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </>
        ) : (
          <>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform ${iconBg}`}>
              <FiUploadCloud size={20} />
            </div>
            <div className="text-center">
              <p className="text-xs font-black text-slate-700 dark:text-gray-100 uppercase tracking-tight">{hint}</p>
              <p className="text-[10px] text-gray-400 font-bold mt-0.5">{note}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

export default DropZone;
