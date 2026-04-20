import React from 'react';
import { getOptimizedUrl, CLOUDINARY_ASSETS } from '../../utils/cloudinary';

const desunLogo = getOptimizedUrl(CLOUDINARY_ASSETS['desun-logo.png']);

/**
 * Loader Component — Global Standard
 *
 * size="xs"       → Inline spinner only (buttons, small spaces). No overlay.
 * size="sm|md|lg" → Full-page glassmorphic blur overlay + logo spinner.
 *
 * The arc animation: 1s draws yellow (top 180°), next 1s draws green (bottom 180°).
 * Logo sits exactly inside the white inner circle. Arc rotates around it, never behind it.
 */
const Loader = ({ fullPage = false, text = 'Loading...', size = 'md' }) => {
  const isInline = size === 'xs';

  // ─── XS: tiny inline spinner for buttons ──────────────────────────────────
  if (isInline) {
    return (
      <span className="relative inline-flex items-center justify-center w-4 h-4 shrink-0">
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes ldY{0%{stroke-dashoffset:289}50%,100%{stroke-dashoffset:144.5}}
          @keyframes ldG{0%,50%{stroke-dashoffset:289}100%{stroke-dashoffset:144.5}}
          .ld-xs-y{animation:ldY 2s linear infinite}
          .ld-xs-g{animation:ldG 2s linear infinite}
        `}} />
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="46" fill="none" stroke="#fbc111" strokeWidth="14"
            strokeLinecap="round" strokeDasharray="289" className="ld-xs-y" />
          <circle cx="50" cy="50" r="46" fill="none" stroke="#8cc63f" strokeWidth="14"
            strokeLinecap="round" strokeDasharray="289"
            style={{ transform: 'rotate(180deg)', transformOrigin: '50px 50px' }}
            className="ld-xs-g" />
        </svg>
      </span>
    );
  }

  // ─── SM / MD / LG: full-page blur overlay ─────────────────────────────────
  const spinnerSizes = { sm: 'w-24 h-24', md: 'w-32 h-32', lg: 'w-40 h-40' };
  const spinnerClass = spinnerSizes[size] || spinnerSizes.md;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-md">
      <div className="flex flex-col items-center justify-center gap-5">

        {/* ── Spinner ring + Logo ── */}
        <div className={`relative flex items-center justify-center ${spinnerClass}`}>

          {/* Keyframes injected once */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes ldYf{0%{stroke-dashoffset:289}50%,100%{stroke-dashoffset:144.5}}
            @keyframes ldGf{0%,50%{stroke-dashoffset:289}100%{stroke-dashoffset:144.5}}
            .ld-f-y{animation:ldYf 2s linear infinite}
            .ld-f-g{animation:ldGf 2s linear infinite}
          `}} />

          {/* SVG arc — sits on z-20 so it renders ON TOP of the inner white circle */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full -rotate-90"
            style={{ zIndex: 20 }}
          >
            {/* Yellow arc — first half of circle */}
            <circle
              cx="50" cy="50" r="46"
              fill="none"
              stroke="#fbc111"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray="289"
              className="ld-f-y"
            />
            {/* Green arc — second half (starts at 180°) */}
            <circle
              cx="50" cy="50" r="46"
              fill="none"
              stroke="#8cc63f"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray="289"
              style={{ transform: 'rotate(180deg)', transformOrigin: '50px 50px' }}
              className="ld-f-g"
            />
          </svg>

          {/* Inner white circle — sizes to leave the arc visible around the edge */}
          {/* z-10 so it renders BELOW the arc (z-20) but above the background */}
          <div
            className="rounded-full bg-[#f4f5f0] dark:bg-gray-800 border border-[#8cc63f]/15 shadow-lg flex items-center justify-center"
            style={{
              position: 'absolute',
              width: '72%',
              height: '72%',
              zIndex: 10,
            }}
          >
            {/* Logo — 65% of the inner circle so the white ring remains visible */}
            <img
              src={desunLogo}
              alt="Desun Academy"
              style={{ width: '65%', height: '65%', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* ── Text label + bouncing dots ── */}
        {text && (
          <div className="flex flex-col items-center gap-2 mt-1">
            <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#fbc111] animate-pulse drop-shadow">
              {text}
            </span>
            <div className="flex gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#8cc63f] animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#fbc111] animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#8cc63f] animate-bounce" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Loader;
