import React, { useState } from 'react';
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

const AuthForm = ({ type }) => {
  const isRegister = type === 'register';
  const { login } = useAuth();
  const navigate = useNavigate();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      if (!formData.termsAccepted) {
        alert("Please accept the Terms of Service.");
        return;
      }
      console.log("Registration Attempt:", formData);
      
      // =========================================================================
      // 🚀 BACKEND API INTEGRATION: REGISTRATION (USING FETCH)
      // =========================================================================
      /*
      try {
        const response = await fetch('http://YOUR_BACKEND_URL/api/v1/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            contactNumber: formData.contactNumber,
            email: formData.email,
            gender: formData.gender,
            address: formData.address,
            password: formData.password
          })
        });

        const data = await response.json(); // Data from backend

        if (response.ok) {
          // Success: Use context login and redirect
          login({ email: data.user.email, name: data.user.name, token: data.token });
          navigate('/admin/dashboard');
        } else {
          alert(data.message || "Registration failed!");
        }
      } catch (error) {
        console.error("API Error:", error);
        alert("Something went wrong with the server.");
      }
      */
      
      // MOCK BEHAVIOR (DELETE THIS WHEN API IS READY):
      login({ email: formData.email, name: formData.fullName });
      navigate('/admin/dashboard');
    } else {
      console.log("Login Attempt:", formData);
      
      // =========================================================================
      // 🚀 BACKEND API INTEGRATION: LOGIN (USING FETCH)
      // =========================================================================
      /*
      try {
        const response = await fetch('http://YOUR_BACKEND_URL/api/v1/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        const data = await response.json(); // Convert to JSON

        if (response.ok) {
          // Success: Save user data in context
          login({ email: data.user.email, name: data.user.name, token: data.token });
          navigate('/admin/dashboard');
        } else {
          alert(data.message || "Invalid email or password!");
        }
      } catch (error) {
        console.error("API Error:", error);
        alert("Server connection failed.");
      }
      */
      
      // MOCK BEHAVIOR (DELETE THIS WHEN API IS READY):
      login({ email: formData.email, name: 'Admin User' });
      navigate('/admin/dashboard');
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
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-500 text-[15px] font-bold opacity-70">
            {isRegister ? 'Start your journey toward academic mastery today.' : 'Please enter your details to continue.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={isRegister ? 'space-y-4' : 'space-y-6'}>
        {isRegister && (
          <>
            <InputField
              label="Full Name" type="text" name="fullName" value={formData.fullName}
              onChange={handleChange} placeholder="Alok Nandy" icon={FiUser} required
            />
            <InputField
              label="Contact Number" type="tel" name="contactNumber" value={formData.contactNumber}
              onChange={handleChange} placeholder="+91 9876543210" icon={FiPhone} required
            />
          </>
        )}

        <InputField
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
              options={['Web Development', 'UI/UX', 'Digital Marketing']}
            />
          </>
        )}

        <div className={isRegister ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-6"}>
          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            icon={isRegister ? FiLock : null}
            labelRight={!isRegister ? "Forgot Password?" : null}
            required
          />
          {isRegister && (
            <InputField
              label="Confirm" type="password" name="confirmPassword" value={formData.confirmPassword}
              onChange={handleChange} placeholder="••••••••" icon={FiRotateCcw} required
            />
          )}
        </div>

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

        <Button
          type="submit"
          disabled={isRegister && !formData.termsAccepted}
          text={isRegister ? "Create Account" : "Sign In to Academy"}
          icon={FiArrowRight}
          variant="primary"
          className={`mt-2 py-4 shadow-xl shadow-[#8cc63f]/25 ${!isRegister ? 'text-[16px] tracking-wider' : ''}`}
        />
      </form>

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
    </div>
  );
};

export default AuthForm;
