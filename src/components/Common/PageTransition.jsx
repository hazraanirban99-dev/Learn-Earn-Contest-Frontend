// ============================================================
// PageTransition.jsx — Framer Motion based smooth page transitions
// Route transition er somoy fade r slide animation trigger kore.
// Spring transition config use kora hoyeche organic feel er jonno.
// 'initial', 'animate', r 'exit' states define kora ache.
// ============================================================

import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for a premium, smooth feel
        opacity: { duration: 0.4 }
      }}
      className={`w-full h-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
