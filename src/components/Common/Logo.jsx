import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/desun-logo.png';

/**
 * Reusable Logo component for DESUN ACADEMY branding.
 * 
 * @param {string} variant - 'dark' (default for light backgrounds) or 'light' (for dark backgrounds)
 * @param {string} size - 'xs', 'sm', 'md', 'lg'
 * @param {boolean} showTagline - Whether to show the "Get Placed by Skills" badge
 * @param {boolean} showText - Whether to show the library name "DESUN ACADEMY"
 * @param {string} className - Additional CSS classes for the container
 * @param {string} to - Path to link to. If null or empty, will not be a link.
 */
const Logo = ({ 
  variant = 'dark', 
  size = 'md', 
  showTagline = true, 
  showText = true, 
  className = '', 
  imgClassName = '',
  to = '/' 
}) => {
  const sizes = {
    xs: { img: 'w-8 h-8', text: 'text-xs', tagline: 'text-[7px]' },
    sm: { img: 'w-8 h-8', text: 'text-base', tagline: 'text-[7px]' },
    md: { img: 'w-11 h-11', text: 'text-[17px]', tagline: 'text-[7px]' },
    lg: { img: 'w-16 h-16', text: 'text-xl', tagline: 'text-[10px]' },
  };

  const currentSize = sizes[size] || sizes.md;

  const content = (
    <div className={`flex items-center gap-3.5 group ${className}`}>
      <div className={`${currentSize.img} flex-shrink-0 relative ${imgClassName}`}>
        {/* Glow effect for certain sizes/variants */}
        {size === 'md' && variant === 'dark' && (
          <div className="absolute inset-0 bg-[#8cc63f]/10 rounded-full blur-lg group-hover:bg-[#8cc63f]/20 transition-all" />
        )}
        <img 
          src={logo} 
          alt="Desun Logo" 
          className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-500" 
          onError={(e) => { e.target.style.display = 'none' }}
        />
      </div>
      {(showText || showTagline) && (
        <div className="flex flex-col">
          {showText && (
            <h2 className={`${currentSize.text} font-black tracking-tight leading-none uppercase transition-colors ${
              variant === 'light' ? 'text-white' : 'text-slate-900 group-hover:text-[#8cc63f]'
            }`}>
              DESUN ACADEMY
            </h2>
          )}
          {showTagline && (
            <div className="mt-1 self-start">
              <span className={`bg-[#fbc111] text-black ${currentSize.tagline} font-black px-1.5 py-0.5 rounded shadow-sm leading-none uppercase tracking-widest border border-yellow-400/20 whitespace-nowrap`}>
                Get Placed by Skills
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="shrink-0 block">
        {content}
      </Link>
    );
  }

  return <div className="shrink-0">{content}</div>;
};

export default Logo;
