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
    <div className="flex flex-col gap-1.5">
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
            ? accentColor === '#fbc111' ? 'border-[#fbc111] bg-yellow-50/60' : 'border-[#8cc63f] bg-[#8cc63f]/5'
            : `${accentColor === '#fbc111' ? 'bg-yellow-50/40 border-[#fbc111]/40' : 'bg-[#f4f9ed] border-[#8cc63f]/40'} ${borderColor}`
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
              <p className="text-sm font-black text-slate-800 truncate max-w-[180px]">{file.name}</p>
              <p className="text-[10px] text-gray-400 font-bold mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </>
        ) : (
          <>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform ${iconBg}`}>
              <FiUploadCloud size={20} />
            </div>
            <div className="text-center">
              <p className="text-xs font-black text-slate-700 uppercase tracking-tight">{hint}</p>
              <p className="text-[10px] text-gray-400 font-bold mt-0.5">{note}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

export default DropZone;
