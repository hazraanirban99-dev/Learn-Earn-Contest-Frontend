import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/desun-logo.png';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { InputField, Button, SocialButton } from '../../components';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    keepLoggedIn: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Attempt:", formData);
    alert("Login Successful!");
  };

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

        {/* Right Panel - Form Area */}
        <div className="flex-1 p-8 md:p-16 lg:p-24 flex flex-col items-center justify-center bg-[#e5faa7] lg:bg-white transition-colors duration-500">
          <div className="w-full max-w-105">
            
            {/* Header Area simplified (no hover transformation) */}
            <div className="flex flex-col items-center mb-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center p-0.5">
                  <img src={logo} alt="Desun Logo" className="w-full h-full object-contain" onError={(e) => { e.target.style.display = 'none' }} />
                </div>
                <div>
                  <div className="font-black text-xl tracking-tight text-black flex flex-col justify-center leading-tight uppercase">
                    <span>DESUN ACADEMY</span>
                  </div>
                  <div className="text-[10px] bg-[#fbc111] text-black px-1.5 py-0.5 rounded font-bold inline-block leading-none mt-1.5 uppercase tracking-wide">Get Placed by Skills</div>
                </div>
              </div>
              
              <div className="text-center">
                <h2 className="text-[34px] font-black text-black mb-1.5 tracking-tight leading-tight uppercase">Welcome Back</h2>
                <p className="text-gray-500 text-[15px] font-bold opacity-70">Please enter your details to continue.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <InputField
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@academy.com"
                required
              />

              <InputField
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                labelRight="Forgot Password?"
                required
              />

              <div className="flex items-center gap-2.5 py-1">
                <input
                  type="checkbox"
                  id="keepLoggedIn"
                  name="keepLoggedIn"
                  checked={formData.keepLoggedIn}
                  onChange={handleChange}
                  className="w-4.5 h-4.5 rounded border-gray-300 text-[#8cc63f] focus:ring-[#8cc63f] accent-[#8cc63f] cursor-pointer bg-white"
                />
                <label htmlFor="keepLoggedIn" className="text-sm text-gray-700 font-bold cursor-pointer hover:text-black transition-colors uppercase tracking-tight">
                  Keep me logged in
                </label>
              </div>

              <Button
                type="submit"
                text="Sign In to Academy"
                icon={FiArrowRight}
                variant="primary"
                className="mt-2 py-4 shadow-xl shadow-[#8cc63f]/25 text-[16px] tracking-wider"
              />
            </form>

            {/* Divider */}
            <div className="relative my-12">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-black tracking-[0.2em] text-gray-300">
                <span className="bg-[#e5faa7] lg:bg-white px-5 uppercase">OR CONTINUE WITH</span>
              </div>
            </div>

            {/* Social Sign In */}
            <div className="flex flex-col gap-4">
              <SocialButton
                text="Google"
                icon={FcGoogle}
                onClick={() => console.log("Google Login Clicked")}
              />
            </div>

            <p className="text-center text-[15px] font-bold text-gray-400 mt-14 mb-4">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-[#6ca518] hover:underline hover:text-[#5a8c14] transition-colors ml-1 font-bold">Join the Academy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
