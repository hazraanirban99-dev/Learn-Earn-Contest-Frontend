import React, { useState } from 'react';
import {
  FiUser, FiPhone, FiMail, FiMapPin, FiBookOpen, FiLock,
  FiCheckCircle, FiStar, FiArrowRight, FiRotateCcw
} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { InputField, Button, SocialButton } from '../../components';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '', contactNumber: '', email: '', gender: '',
    address: '', interestedIn: '', password: '', confirmPassword: '', termsAccepted: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGenderSelect = (g) => {
    setFormData(prev => ({ ...prev, gender: g }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!formData.termsAccepted) {
      alert("Please accept the Terms of Service.");
      return;
    }
    console.log("Form Submitted Successfully:", formData);
    alert("Registration successful! Check console for data.");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans text-gray-800">

      {/* Left Panel */}
      <div className="flex-1 bg-gradient-to-b from-[#6ca518] to-[#467008] p-8 md:p-14 lg:p-20 text-white flex flex-col justify-between hidden lg:flex">
        <div className="font-bold tracking-widest text-[13px] uppercase">DESUN ACADEMY</div>

        <div className="my-10">
          <h1 className="text-[52px] font-bold mb-4 leading-tight tracking-tight text-white">
            Enter the <br /><span className="text-[#fbc111]">Scholastic Atelier.</span>
          </h1>
          <p className="text-white/90 text-[15px] mb-12 max-w-sm leading-relaxed font-light">
            Join a community of forward-thinkers. Our curated learning environment bridges the gap between traditional prestige and digital innovation.
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-[42px] h-[42px] rounded-xl border border-white/20 bg-white/10 text-[#fbc111] flex items-center justify-center shrink-0">
                <FiCheckCircle size={20} />
              </div>
              <div className="pt-0.5">
                <h3 className="font-bold text-[15px] text-white">Premium Certifications</h3>
                <p className="text-white/70 text-sm mt-0.5">Industry-recognized credentials designed by experts.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-[42px] h-[42px] rounded-xl border border-white/20 bg-white/10 text-[#fbc111] flex items-center justify-center shrink-0">
                <FiStar size={20} />
              </div>
              <div className="pt-0.5">
                <h3 className="font-bold text-[15px] text-white">Editorial Learning</h3>
                <p className="text-white/70 text-sm mt-0.5">High-end content that feels like a premium journal.</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="h-px w-full bg-white/20 mb-8 max-w-sm"></div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              <img src="https://i.pravatar.cc/100?img=11" alt="Scholar" className="w-[40px] h-[40px] rounded-full border-2 border-[#4a770a]" />
              <img src="https://i.pravatar.cc/100?img=12" alt="Scholar" className="w-[40px] h-[40px] rounded-full border-2 border-[#4a770a]" />
              <img src="https://i.pravatar.cc/100?img=13" alt="Scholar" className="w-[40px] h-[40px] rounded-full border-2 border-[#4a770a]" />
            </div>
            <div className="text-sm font-medium text-white/90">
              Join 40,000+ scholars worldwide.
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 p-6 md:p-12 lg:py-12 lg:px-24 overflow-y-auto w-full lg:w-auto flex flex-col items-center">
        <div className="w-full max-w-[480px]">

          {/* Header Area exactly matching the image */}
          <div className="flex flex-col items-center mb-10 mt-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-0.5">
                <img src="/src/assets/Desun Logo (1)(1)-Photoroom (1).png" alt="logo" className="w-full h-full object-contain" onError={(e) => { e.target.style.display = 'none' }} />
              </div>
              <div>
                <div className="font-black text-xl tracking-tighter text-black">DESUN ACADEMY</div>
                <div className="text-[10px] bg-[#fbc111] text-black px-1.5 py-0.5 rounded font-bold inline-block leading-none mt-0.5">Get Placed by Skills</div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-[28px] font-bold text-gray-900 mb-1">Create Account</h2>
            <p className="text-gray-500 text-[15px]">Start your journey toward academic mastery today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Full Name" type="text" name="fullName" value={formData.fullName}
              onChange={handleChange} placeholder="Alok Nandy" icon={FiUser} required
            />

            <InputField
              label="Contact Number" type="tel" name="contactNumber" value={formData.contactNumber}
              onChange={handleChange} placeholder="+91 9876543210" icon={FiPhone} required
            />

            <InputField
              label="Email Address" type="email" name="email" value={formData.email}
              onChange={handleChange} placeholder="scholar@desun.edu" icon={FiMail} required
            />

            <div className="mb-4">
              <label className="text-xs font-bold text-gray-800 tracking-wide block mb-3">Gender</label>
              <div className="flex gap-6 ml-1">
                {['Male', 'Female', 'Other'].map(g => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-600 transition-colors hover:text-gray-900">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={() => handleGenderSelect(g)}
                      className="w-4 h-4 text-[#8cc63f] focus:ring-[#8cc63f] accent-[#8cc63f] cursor-pointer"
                    />
                    {g}
                  </label>
                ))}
              </div>
            </div>

            <InputField
              label="Address" type="text" name="address" value={formData.address}
              onChange={handleChange} placeholder="Enter your full address" icon={FiMapPin} required
            />

            <InputField
              label="Interested In" type="text" name="interestedIn" value={formData.interestedIn}
              onChange={handleChange} placeholder="e.g. Data Science, Design, Management" icon={FiBookOpen} required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Password" type="password" name="password" value={formData.password}
                onChange={handleChange} placeholder="••••••••" icon={FiLock} required
              />
              <InputField
                label="Confirm" type="password" name="confirmPassword" value={formData.confirmPassword}
                onChange={handleChange} placeholder="••••••••" icon={FiRotateCcw} required
              />
            </div>

            <div className="flex items-start gap-3 py-2">
              <input
                type="checkbox" id="terms" name="termsAccepted"
                checked={formData.termsAccepted} onChange={handleChange}
                className="mt-1 w-[18px] h-[18px] rounded border border-gray-300 text-[#8cc63f] focus:ring-[#8cc63f] accent-[#8cc63f] cursor-pointer bg-[#f4f7eb]"
              />
              <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer flex-1">
                I agree to the <a href="#terms" className="text-[#6aa315] font-semibold hover:underline">Terms of Service</a> and <a href="#privacy" className="text-[#6ca518] font-semibold hover:underline">Privacy Policy</a>.
              </label>
            </div>

            <Button
              type="submit" disabled={!formData.termsAccepted} text="Create Account"
              icon={FiArrowRight} variant="primary" className="mt-2"
            />
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-400 font-bold tracking-widest text-[10px] uppercase">OR REGISTER WITH</span>
            </div>
          </div>

          <div className="flex gap-4">
            <SocialButton text="Google" icon={FcGoogle} onClick={() => console.log('Google login clicked')} />
            <SocialButton text="Apple" icon={FaApple} iconColor="text-black" onClick={() => console.log('Apple login clicked')} />
          </div>

          <p className="text-center text-[13px] font-medium text-gray-600 mt-10 mb-8">
            Already have an account? <a href="#login" className="text-[#6ca518] font-bold hover:underline ml-1">Log in here</a>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;
