import React, { useState, useRef, useEffect } from 'react';
import { FiMoreVertical, FiClock, FiPlay, FiCheckCircle } from 'react-icons/fi';

const StatusUpdateMenu = ({ currentStatus, onStatusUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const statuses = [
    { id: 'UPCOMING', label: 'Mark as Upcoming', icon: FiClock, color: 'text-amber-500', bg: 'hover:bg-amber-50' },
    { id: 'ONGOING', label: 'Mark as Ongoing', icon: FiPlay, color: 'text-[#8cc63f]', bg: 'hover:bg-green-50' },
    { id: 'COMPLETED', label: 'Mark as Completed', icon: FiCheckCircle, color: 'text-gray-500', bg: 'hover:bg-gray-50' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-slate-600"
      >
        <FiMoreVertical size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 w-max bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-right-2 duration-300 flex items-center gap-1 px-2">
          {statuses.map((status) => (
            <button
              key={status.id}
              disabled={currentStatus === status.id}
              onClick={() => {
                onStatusUpdate(status.id);
                setIsOpen(false);
              }}
              className={`p-2.5 rounded-xl flex items-center gap-2 transition-all group/item ${status.bg} ${
                currentStatus === status.id ? 'opacity-30 cursor-not-allowed grayscale' : 'hover:scale-105 active:scale-95'
              }`}
              title={status.label}
            >
              <status.icon className={`${status.color} group-hover/item:scale-110 transition-transform`} size={16} />
              <span className={`text-[10px] font-black uppercase tracking-widest leading-none ${currentStatus === status.id ? 'text-gray-400' : 'text-slate-700'}`}>
                {status.id}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(StatusUpdateMenu);
