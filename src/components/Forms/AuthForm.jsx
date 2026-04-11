// ============================================================
// AuthForm.jsx — Shared Login/Register form structure
// Form status loading handle kore r errors display kore.
// User context (auth) access kore register/login call korar jonno.
// Glassmorphism design system follow kora hoyeche.
// Input validation hints r error messages er styling ekhane ache.
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../index';
import {
  FiUser, FiPhone, FiMail, FiMapPin, FiBookOpen, FiLock,
  FiArrowRight, FiRotateCcw, FiCheckCircle, FiStar
} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { InputField, Button, SocialButton } from '../index';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const AuthForm = ({ type }) => {
  const isRegister = type === 'register';
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const firstInputRef = useRef(null);

  useEffect(() => {
    // Normalize scroll position to the top instantly so that both Login and Register 
    // start from the same position, yielding a consistent top-to-bottom focus trajectory.
    window.scrollTo({ top: 0, behavior: 'instant' });

    const timer = setTimeout(() => {
      // Allow browser to natively scroll input into view (works best with mobile keyboards)
      if (firstInputRef.current) {
        firstInputRef.current.focus();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [type]);

  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    email: '',
    gender: '',
    address: '',
    interestedIn: '',
    password: '',
    confirmPassword: '',
    keepLoggedIn: false,
    termsAccepted: false
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isForgotPassword) {
      if (!formData.email) {
        toast.error("Please enter your email address");
        return;
      }

      setLoading(true);
      try {
        const { data } = await api.post('/users/password/forgot', { email: formData.email });
        toast.success(data.message || "Reset link sent to your email!");
        setIsForgotPassword(false);
      } catch (error) {
        toast.error(error.message || "Failed to send reset link.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (isRegister) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        toast.error("Password must match all security criteria.");
        return;
      }

      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(formData.contactNumber)) {
        toast.error("Contact number must be exactly 10 digits.");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }
      if (!formData.termsAccepted) {
        toast.error("Please accept the Terms of Service.");
        return;
      }
      
      setLoading(true);
      try {
        // Backend e registration data pathano hoche
        const { data } = await api.post('/users/register', formData);
        
        if (data.success) {
          toast.success("Account created successfully! Please log in.");
          navigate('/login');
        }
      } catch (error) {
        toast.error(error.message || "Registration failed!");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        // Backend e login data pathano hoche
        const { data } = await api.post('/users/login', {
          email: formData.email,
          password: formData.password
        });

        if (data.success) {
          toast.success(`Welcome back ${data.data.user.name}!`);
          login(data.data.user);
          
          // Role base redirection
          if (data.data.user.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/student/dashboard');
          }
        }
      } catch (error) {
        toast.error(error.message || "Invalid email or password!");
      } finally {
        setLoading(false);
      }
    }

  };

  return (
    <div className={`w-full ${isRegister ? 'max-w-120' : 'max-w-[420px]'}`}>
      {/* Header Area */}
      <div className="flex flex-col items-center mb-10 mt-4">
        <Logo 
          size="lg" 
          className="mb-10" 
          imgClassName="bg-white rounded-full shadow-sm flex items-center justify-center p-0.5" 
        />
        
        <div className="text-center">
          <h2 className={`font-black text-black mb-1.5 tracking-tight leading-tight uppercase ${isRegister ? 'text-[32px]' : 'text-[34px]'}`}>
            {isForgotPassword ? 'Reset Password' : isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-500 text-[15px] font-bold opacity-70">
            {isForgotPassword 
              ? 'Enter your email to receive a recovery link.' 
              : isRegister 
                ? 'Start your journey toward academic mastery today.' 
                : 'Please enter your details to continue.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={isRegister ? 'space-y-4' : 'space-y-6'}>
        {isRegister && (
          <>
            <InputField
              ref={firstInputRef}
              label="Full Name" type="text" name="fullName" value={formData.fullName}
              onChange={handleChange} placeholder="Alok Nandy" icon={FiUser} required
            />
            <InputField
              label="Contact Number" type="tel" name="contactNumber" value={formData.contactNumber}
              onChange={handleChange} placeholder="+91 9876543210" icon={FiPhone} required
              maxLength={10}
            />
          </>
        )}

        <InputField
          ref={!isRegister ? firstInputRef : null}
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={isRegister ? "scholar@desun.edu" : "name@academy.com"}
          icon={isRegister ? FiMail : null}
          required
        />

        {isRegister && (
          <div className="mb-4">
            <label className="text-[11px] font-bold text-gray-800 tracking-tight block mb-3 uppercase">Gender</label>
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
        )}

        {isRegister && (
          <>
            <InputField
              label="Address" type="textarea" name="address" value={formData.address}
              onChange={handleChange} placeholder="Enter your full address" icon={FiMapPin} required
            />
            <InputField
              label="Interested In" type="select" name="interestedIn" value={formData.interestedIn}
              onChange={handleChange} placeholder="Select your field of interest" icon={FiBookOpen} required
              options={['MERN', 'UI/UX', 'Digital Marketing']}
            />
          </>
        )}

        {!isForgotPassword && (
          <div className={isRegister ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-6"}>
            <div className="flex flex-col">
              <InputField
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                icon={isRegister ? FiLock : null}
                labelRight={!isRegister ? "Forgot Password?" : null}
                onLabelRightClick={() => setIsForgotPassword(true)}
                required
              />
              {isRegister && (
                <p className="text-[9.5px] sm:whitespace-nowrap text-black font-semibold mt-2 leading-tight">
                  <span className="text-[#fbc111] font-black mr-1">Note:</span> Min 8 chars, 1 uppercase, 1 number, 1 special char (@$!%*?&#).
                </p>
              )}
            </div>
            {isRegister && (
              <InputField
                label="Confirm" type="password" name="confirmPassword" value={formData.confirmPassword}
                onChange={handleChange} placeholder="••••••••" icon={FiRotateCcw} required
              />
            )}
          </div>
        )}

        {!isForgotPassword && (
          <div className="flex items-center gap-2.5 py-1">
            <input
              type="checkbox"
              id={isRegister ? "terms" : "keepLoggedIn"}
              name={isRegister ? "termsAccepted" : "keepLoggedIn"}
              checked={isRegister ? formData.termsAccepted : formData.keepLoggedIn}
              onChange={handleChange}
              className="w-4.5 h-4.5 rounded border border-gray-300 text-[#8cc63f] focus:ring-[#8cc63f] accent-[#8cc63f] cursor-pointer bg-white"
            />
            <label htmlFor={isRegister ? "terms" : "keepLoggedIn"} className="text-sm text-gray-600 font-semibold cursor-pointer flex-1 uppercase tracking-tight">
              {isRegister ? (
                <>I agree to the <a href="#terms" className="text-[#6aa315] font-semibold hover:underline">Terms of Service</a> and <a href="#privacy" className="text-[#6ca518] font-semibold hover:underline">Privacy Policy</a>.</>
              ) : (
                "Keep me logged in"
              )}
            </label>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading || (isRegister && !formData.termsAccepted)}
          text={loading ? "Please wait..." : isForgotPassword ? "Send Recovery Link" : isRegister ? "Create Account" : "Sign In to Academy"}
          icon={FiArrowRight}
          variant="primary"
          className={`mt-2 py-4 shadow-xl shadow-[#8cc63f]/25 ${!isRegister ? 'text-[16px] tracking-wider' : ''}`}
        />

        {isForgotPassword && (
          <button
            type="button"
            onClick={() => setIsForgotPassword(false)}
            className="w-full text-center text-sm font-bold text-[#6ca518] hover:underline mt-4 cursor-pointer"
          >
            ← Back to Login
          </button>
        )}
      </form>

      {!isForgotPassword && (
        <>
          {/* Divider */}
          <div className="relative my-10 lg:my-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-black tracking-[0.2em] text-gray-300">
              <span className="bg-[#e5faa7] lg:bg-white px-5 uppercase">
                {isRegister ? 'OR REGISTER WITH' : 'OR CONTINUE WITH'}
              </span>
            </div>
          </div>

          {/* Social Sign In */}
          <div className={`flex gap-4 ${!isRegister ? 'flex-col' : ''}`}>
            <SocialButton
              text="Google"
              icon={FcGoogle}
              onClick={() => console.log("Google Login Clicked")}
            />
            {isRegister && (
              <SocialButton text="Apple" icon={FaApple} iconColor="text-black" onClick={() => console.log('Apple login clicked')} />
            )}
          </div>

          <p className={`text-center text-[15px] font-bold text-gray-500 mt-14 mb-8 ${!isRegister ? 'text-gray-400' : ''}`}>
            {isRegister ? (
              <>Already have an account? <Link to="/login" className="text-[#6ca518] hover:underline font-bold ml-1 transition-colors">Log in here</Link></>
            ) : (
              <>Don't have an account yet? <Link to="/register" className="text-[#6ca518] hover:underline hover:text-[#5a8c14] transition-colors ml-1 font-bold">Join the Academy</Link></>
            )}
          </p>
        </>
      )}
    </div>
  );
};

export default AuthForm;
