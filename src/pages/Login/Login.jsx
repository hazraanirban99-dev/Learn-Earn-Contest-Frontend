import React from 'react';
import { AuthForm } from '../../components';

const Login = () => {
  return (
    <div className="min-h-screen bg-linear-to-r from-[#fbc111] to-[#8cc63f] p-1.5 md:p-2 lg:p-3">
      <div className="min-h-full flex flex-col lg:flex-row bg-white font-sans text-gray-800 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl relative">
        
        {/* Left Panel - Branding - Now visible on mobile/tablet */}
        <div className="flex flex-1 bg-linear-to-br from-[#f0f9e1] via-[#f7fcea] to-white p-10 md:p-14 lg:p-24 flex-col justify-between relative overflow-hidden">
          {/* Subtle decorative background elements matching the design circles */}
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full border-48 border-[#8cc63f]/5"></div>
          <div className="absolute -bottom-12 -left-12 w-72 h-72 rounded-full border-36 border-[#8cc63f]/10"></div>

          <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="text-[#fbc111] font-bold text-lg tracking-tight mb-12 lg:mb-20 uppercase">Desun Academy</div>
            
            <h1 className="text-[40px] lg:text-[64px] font-black leading-[1.05] tracking-tight text-black max-w-md drop-shadow-sm">
              The Scholastic <br />
              <span className="text-[#8cc63f]">Atelier</span>
            </h1>
            
            <p className="text-gray-600 text-[15px] lg:text-[17px] mt-6 lg:mt-8 max-w-90 leading-relaxed font-semibold opacity-90">
              Step into a curated digital space where learning is an art form. Your journey to mastery begins here.
            </p>
          </div>

          <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
            <button className="flex items-center gap-2.5 bg-[#fbc111] hover:bg-[#e0ad0c] text-black text-[11px] font-black px-5 py-3 rounded-full transition-all shadow-lg hover:shadow-[#fbc111]/30 uppercase tracking-widest group active:scale-95">
               <span className="w-3 h-3 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-black rotate-45 group-hover:rotate-180 transition-all duration-500"></div>
               </span>
               SKILL-UP HIGHLIGHTS
            </button>
          </div>
        </div>

        {/* Right Panel - Unified AuthForm component in 'login' mode */}
        <div className="flex-1 p-8 md:p-16 lg:p-24 flex flex-col items-center justify-center bg-[#e5faa7] lg:bg-white transition-colors duration-500">
          <AuthForm type="login" />
        </div>
      </div>
    </div>
  );
};

export default Login;
