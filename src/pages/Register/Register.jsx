// ============================================================
// Register.jsx — User Registration page
// Domain selection (MERN, UIUX, Marketing) r personal details collect kore.
// AuthForm through te schema validation logic trigger hoy.
// Registration successful hole login page e redirect kore.
// ============================================================

import React from 'react';
import { FiCheckCircle, FiStar } from 'react-icons/fi';
import { AuthForm, Footer, Navbar } from '../../components';
import PageTransition from '../../components/Common/PageTransition';

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-r from-[#fbc111] to-[#8cc63f] overflow-x-hidden">
      {/* Navbar - sticky at top */}
      <Navbar />

      {/* Main Content - takes remaining space */}
      <main className="flex-1 flex items-center justify-center pt-28 md:pt-32 px-4 pb-6 md:pb-10 lg:pb-14">
        <PageTransition className="flex items-center justify-center w-full">
          <div className="w-full max-w-[1200px] flex flex-col lg:flex-row bg-white font-sans text-gray-800 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
          
            {/* Left Panel */}
            <div className="flex flex-1 bg-linear-to-b from-[#6ca518] to-[#467008] p-8 md:p-12 lg:p-16 text-white flex-col justify-between">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="font-bold tracking-widest text-[13px] uppercase">DESUN ACADEMY</div>

                <div className="mt-8 lg:mt-12 mb-8 flex flex-col items-center lg:items-start">
                  <h1 className="text-[32px] md:text-[38px] lg:text-[48px] font-bold mb-4 leading-tight tracking-tight text-white">
                    Enter the <br /><span className="text-[#fbc111]">Scholastic Atelier.</span>
                  </h1>
                  <p className="text-white/90 text-[14px] md:text-[15px] mb-8 lg:mb-10 max-w-sm leading-relaxed font-light mx-auto lg:mx-0">
                    Join a community of forward-thinkers. Our curated learning environment bridges the gap between traditional prestige and digital innovation.
                  </p>

                  <div className="space-y-6 flex flex-col items-center lg:items-start text-left">
                    <div className="flex items-start gap-4">
                      <div className="w-10.5 h-10.5 rounded-xl border border-white/20 bg-white/10 text-[#fbc111] flex items-center justify-center shrink-0">
                        <FiCheckCircle size={20} />
                      </div>
                      <div className="pt-0.5">
                        <h3 className="font-bold text-[15px] text-white">Premium Certifications</h3>
                        <p className="text-white/70 text-sm mt-0.5">Industry-recognized credentials designed by experts.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10.5 h-10.5 rounded-xl border border-white/20 bg-white/10 text-[#fbc111] flex items-center justify-center shrink-0">
                        <FiStar size={20} />
                      </div>
                      <div className="pt-0.5">
                        <h3 className="font-bold text-[15px] text-white">Editorial Learning</h3>
                        <p className="text-white/70 text-sm mt-0.5">High-end content that feels like a premium journal.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center lg:items-start mt-6 lg:mt-0">
                <div className="h-px w-full bg-white/20 mb-6 max-w-sm"></div>
                <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  <div className="flex -space-x-3">
                    <img src="https://i.pravatar.cc/100?img=11" alt="Scholar" className="w-10 h-10 rounded-full border-2 border-[#4a770a]" />
                    <img src="https://i.pravatar.cc/100?img=12" alt="Scholar" className="w-10 h-10 rounded-full border-2 border-[#4a770a]" />
                    <img src="https://i.pravatar.cc/100?img=13" alt="Scholar" className="w-10 h-10 rounded-full border-2 border-[#4a770a]" />
                  </div>
                  <div className="text-sm font-medium text-white/90">
                    Join 40,000+ scholars worldwide.
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Auth Form */}
            <div className="flex-1 p-6 md:p-10 lg:py-12 lg:px-16 w-full lg:w-auto flex flex-col items-center justify-center bg-[#e5faa7] lg:bg-white transition-colors duration-300">
              <AuthForm type="register" />
            </div>
          
          </div>
        </PageTransition>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Register;
