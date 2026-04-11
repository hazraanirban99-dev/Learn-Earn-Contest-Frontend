// ============================================================
// Footer.jsx — Global footer component
// Navigation links, social media buttons, r platform info niche thake.
// Mobile responsive layout (column to grid).
// Premium dark theme focus with subtle gradients.
// Copyright info r newsletter signup form design ekhane ache.
// ============================================================

import React from 'react';
import { Logo } from '../index';
import { getOptimizedUrl, CLOUDINARY_ASSETS } from '../../utils/cloudinary';
const partnerLogos = getOptimizedUrl(CLOUDINARY_ASSETS["partner-logos.png"]);
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  const companyLinks = [
    'About Us', 'Placement', 'Blog', 'Interview', 
    'Testimonial', 'Gallery', 'Contact Us'
  ];

  const courseLinks = [
    'UI/UX and Graphics with AI Course', 
    'MERN Stack Development', 
    'Digital Marketing Course', 
    'Web Design Course'
  ];

  return (
    <footer className="bg-[#0b72c4] text-white py-6 px-4 sm:px-6 lg:px-24 overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto">
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 mb-6">
          {/* Brand Column */}
          <div className="flex flex-col gap-4 items-center text-center md:items-start md:text-left">
            <Logo variant="light" size="sm" />
            <div className="flex flex-col gap-1.5">
              <p className="text-[12px] font-medium leading-snug opacity-90 italic">
                Award-winning, tech institute in India.
              </p>
              <p className="text-[12px] font-medium leading-snug opacity-80">
                Industry-backed training in Digital Marketing, UI/UX with AI, and MERN – 100% placement support.
              </p>
            </div>
          </div>

          {/* Company Column */}
          <div className="flex flex-col gap-4 items-center text-center md:items-start md:text-left">
            <h4 className="text-[14px] font-black uppercase tracking-tight relative pb-1 w-fit">
              Company
              <span className="absolute bottom-0 left-0 w-1/2 h-[2.5px] bg-[#fbc111] rounded-full" />
            </h4>
            <ul className="flex flex-col gap-2">
              {companyLinks.map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="text-[12px] font-medium opacity-80 hover:opacity-100 transition-all inline-block">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses Column */}
          <div className="flex flex-col gap-4 items-center text-center md:items-start md:text-left">
            <h4 className="text-[14px] font-black uppercase tracking-tight relative pb-1 w-fit">
              Courses
              <span className="absolute bottom-0 left-0 w-1/2 h-[2.5px] bg-[#fbc111] rounded-full" />
            </h4>
            <ul className="flex flex-col gap-2">
              {courseLinks.map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="text-[12px] font-medium opacity-80 hover:opacity-100 transition-all inline-block leading-tight">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="flex flex-col gap-4 items-center text-center md:items-start md:text-left">
            <h4 className="text-[14px] font-black uppercase tracking-tight relative pb-1 w-fit">
              Contact
              <span className="absolute bottom-0 left-0 w-1/2 h-[2.5px] bg-[#fbc111] rounded-full" />
            </h4>
            <div className="flex flex-col gap-5 text-[12px] font-medium leading-snug opacity-90">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3">
                <FiMapPin className="shrink-0 text-[#fbc111]" size={16} />
                <p className="max-w-[250px] md:max-w-none">
                  11th Floor, Ambuja Neotia Eco Station, Sector V, Salt lake, Kolkata 700091
                </p>
              </div>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3">
                <FiMail className="shrink-0 text-[#fbc111]" size={18} />
                <a href="mailto:contact@desunacademy.in" className="hover:text-[#fbc111] transition-colors">contact@desunacademy.in</a>
              </div>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3">
                <FiPhone className="shrink-0 text-[#fbc111]" size={16} />
                <a href="tel:+919147061005" className="text-sm font-black tracking-wider text-[#fbc111] hover:underline">+91 91470 61005</a>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Approved & Partner */}
        <div className="flex flex-col items-center gap-4 py-4 border-t border-white/10">
          <div className="flex flex-col items-center gap-1.5">
            <h4 className="text-[13px] font-black uppercase tracking-widest text-center">Approved & Partner</h4>
            <div className="w-10 h-1 bg-[#fbc111] rounded-full" />
          </div>
          <div className="w-full max-w-lg px-4 flex justify-center">
            <img src={partnerLogos} alt="Approved & Partner Logos" className="w-full h-auto object-contain max-h-8 md:max-h-10 brightness-110" />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center gap-4 mt-1 pt-4 border-t-2 border-[#8cc63f]">
          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest opacity-90">
            <a href="#" className="hover:text-[#fbc111] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#fbc111] transition-colors">Terms of Use</a>
          </div>
          
          <div className="flex flex-col items-center text-center gap-0.5">
            <p className="text-[10px] lg:text-[11px] font-black tracking-normal leading-normal">
              © 2025 <span className="text-[#fbc111]">Desun Academy</span>. All Rights Reserved. 
              <span className="hidden md:inline mx-2 opacity-30">|</span>
              A unit of DESUN Tech Foundation.
            </p>
            <p className="text-[9px] font-bold opacity-40 tracking-widest uppercase">
              Powered by <span className="font-black text-white opacity-80">DESUN Technology PVT LTD.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
