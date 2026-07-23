import React from 'react';

interface LogoProps {
  showText?: boolean;
  showSubtitle?: boolean;
  onDarkBackground?: boolean;
  className?: string;
  height?: number | string;
}

export const Logo: React.FC<LogoProps> = ({
  showText = true,
  showSubtitle = false,
  onDarkBackground = false,
  className = '',
  height = 40,
}) => {
  // Define color schemes depending on the background
  const textColorWis = onDarkBackground ? 'text-cyan-400' : 'text-brand-700';
  const textColorTech = onDarkBackground ? 'text-slate-100' : 'text-brand-950';
  const subtitleColor = onDarkBackground ? 'text-slate-300' : 'text-slate-500';

  return (
    <div className={`flex items-center ${className}`} style={{ height }}>
      <svg
        id="wis-tech-svg-logo"
        viewBox="0 0 420 110"
        className="h-full w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Blue Metallic Gradient for W and Arch */}
          <linearGradient id="logoBlueGradient" x1="10" y1="20" x2="90" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563EB" /> {/* Blue 600 */}
            <stop offset="50%" stopColor="#3B82F6" /> {/* Blue 500 */}
            <stop offset="100%" stopColor="#0284C7" /> {/* Sky 600 */}
          </linearGradient>

          {/* Silver/Metallic Steel Gradient for T */}
          <linearGradient id="logoSilverGradient" x1="70" y1="20" x2="130" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E2E8F0" /> {/* Slate 200 */}
            <stop offset="35%" stopColor="#F1F5F9" /> {/* Slate 100 */}
            <stop offset="70%" stopColor="#94A3B8" /> {/* Slate 400 */}
            <stop offset="100%" stopColor="#475569" /> {/* Slate 600 */}
          </linearGradient>
          
          {/* Subtle Glow Filter */}
          <filter id="logoGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- ICON GRAPHIC (WT + ARCH + PIXELS) --- */}
        <g id="wt-icon-group">
          {/* Sweeping Arch */}
          <path
            d="M 30,35 A 46,46 0 0,1 118,32"
            stroke="url(#logoBlueGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Digital Pixels at the end of the Arch */}
          <rect x="117" y="24" width="4" height="4" fill="#2563EB" rx="0.5" />
          <rect x="123" y="29" width="5" height="5" fill="#3B82F6" rx="0.5" />
          <rect x="119" y="36" width="4" height="4" fill="#0284C7" rx="0.5" />

          {/* The "W" Shape - Blue Metallic */}
          <path
            d="M 10,32 L 26,32 L 40,70 L 50,45 L 60,70 L 74,32 L 90,32 L 70,92 L 56,92 L 50,75 L 44,92 L 30,92 Z"
            fill="url(#logoBlueGradient)"
          />

          {/* The "T" Shape - Silver Metallic (overlaps the W slightly and is offset) */}
          <path
            d="M 75,41 L 122,41 L 118,48 L 100,48 L 81,90 L 71,90 L 89,48 L 79,48 Z"
            fill="url(#logoSilverGradient)"
            filter="drop-shadow(0px 1px 2px rgba(0,0,0,0.15))"
          />
        </g>

        {/* --- BRAND NAME TEXT (WIS TECH) --- */}
        {showText && (
          <g id="brand-text-group" transform="translate(142, 0)">
            {/* "WIS" text - stylized futuristic, rounded, bold */}
            <text
              x="0"
              y="68"
              fill={onDarkBackground ? '#22D3EE' : '#1E40AF'} // Cyan-400 vs Blue-800
              fontSize="38"
              fontWeight="900"
              fontFamily="'Inter', sans-serif"
              letterSpacing="0.05em"
              style={{ textTransform: 'uppercase' }}
            >
              Wis
            </text>

            {/* "TECH" text - steel-colored metallic */}
            <text
              x="82"
              y="68"
              fill={onDarkBackground ? '#F1F5F9' : '#0F172A'} // Slate-100 vs Slate-900
              fontSize="38"
              fontWeight="800"
              fontFamily="'Inter', sans-serif"
              letterSpacing="0.08em"
              style={{ textTransform: 'uppercase' }}
            >
              Tech
            </text>

            {/* Tagline / Subtitle */}
            {showSubtitle && (
              <g transform="translate(0, 92)">
                <line
                  x1="0"
                  y1="-4"
                  x2="255"
                  y2="-4"
                  stroke={onDarkBackground ? '#1E293B' : '#E2E8F0'}
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y="8"
                  fill={onDarkBackground ? '#94A3B8' : '#64748B'}
                  fontSize="7.5"
                  fontWeight="600"
                  fontFamily="'Inter', sans-serif"
                  letterSpacing="0.44em"
                >
                  INNOVATION | PERFORMANCE | CONFIANCE
                </text>
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
