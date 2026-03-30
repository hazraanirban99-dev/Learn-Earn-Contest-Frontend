import React from 'react';
import { AuthForm, Footer, Navbar } from '../../components';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-r from-[#fbc111] to-[#8cc63f] overflow-x-hidden">
      {/* Navbar - sticky at top */}
      <Navbar />
      
      {/* Main Content - takes remaining space */}
      <main className="flex-1 flex items-center justify-center px-4 py-6 md:py-10 lg:py-14">
        <div className="w-full max-w-[1200px] flex flex-col lg:flex-row bg-white font-sans text-gray-800 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Left Panel - Branding */}
          <div className="flex flex-1 bg-linear-to-br from-[#f0f9e1] via-[#f7fcea] to-white p-8 md:p-12 lg:p-20 flex-col justify-between relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full border-48 border-[#8cc63f]/5"></div>
            <div className="absolute -bottom-12 -left-12 w-72 h-72 rounded-full border-36 border-[#8cc63f]/10"></div>

            <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="text-[#fbc111] font-bold text-lg tracking-tight mb-8 lg:mb-16 uppercase">Desun Academy</div>
              
              <h1 className="text-[32px] md:text-[40px] lg:text-[56px] font-black leading-[1.05] tracking-tight text-black max-w-md drop-shadow-sm">
                The Scholastic <br />
                <span className="text-[#8cc63f]">Atelier</span>
              </h1>
              
              <p className="text-gray-600 text-[14px] lg:text-[16px] mt-5 lg:mt-7 max-w-sm leading-relaxed font-semibold opacity-90">
                Step into a curated digital space where learning is an art form. Your journey to mastery begins here.
              </p>
            </div>

            <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left mt-8 lg:mt-0">
              <button className="flex items-center gap-2.5 bg-[#fbc111] hover:bg-[#e0ad0c] text-black text-[11px] font-black px-5 py-3 rounded-full transition-all shadow-lg hover:shadow-[#fbc111]/30 uppercase tracking-widest group active:scale-95">
                 <span className="w-3 h-3 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-black rotate-45 group-hover:rotate-180 transition-all duration-500"></div>
                 </span>
                 SKILL-UP HIGHLIGHTS
              </button>
            </div>
          </div>

          {/* Right Panel - Auth Form */}
          <div className="flex-1 p-6 md:p-12 lg:p-16 flex flex-col items-center justify-center bg-[#e5faa7] lg:bg-white transition-colors duration-500">
            <AuthForm type="login" />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Login;
