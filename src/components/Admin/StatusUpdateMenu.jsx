// ============================================================
// StatusUpdateMenu.jsx — Admin contest list e status update korar context menu
// Current status onujayi toggle option (Upcoming, Ongoing, Completed) show kore.
// Parent handler (onStatusUpdate) ke call kore status logic trigger korar jonno.
// Outside click detect kore automatic menu close hoy.
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import { FiMoreVertical, FiClock, FiPlay, FiCheckCircle, FiEdit2, FiTrash2 } from 'react-icons/fi';

const StatusUpdateMenu = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

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
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-slate-600 dark:hover:text-gray-200"
      >
        <FiMoreVertical size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 w-max bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-right-2 duration-300 flex items-center gap-1 px-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                onEdit();
                setIsOpen(false);
              }}
              className="p-2.5 rounded-xl flex items-center gap-2 transition-all hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-500 hover:scale-105 active:scale-95 group/edit"
              title="Edit Contest"
            >
              <FiEdit2 size={16} className="group-hover/edit:rotate-12 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">Edit</span>
            </button>
            <button
              onClick={() => {
                onDelete();
                setIsOpen(false);
              }}
              className="p-2.5 rounded-xl flex items-center gap-2 transition-all hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 hover:scale-105 active:scale-95 group/delete"
              title="Delete Contest"
            >
              <FiTrash2 size={16} className="group-hover/delete:shake transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">Delete</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(StatusUpdateMenu);
