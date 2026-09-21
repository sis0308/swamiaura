import React from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'dark' | 'light'; // 'dark' = for light backgrounds (black text), 'light' = for dark backgrounds (white text)
  subtext?: string;
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  variant = 'dark',
  subtext = '— m g r o u p o f c o m p a n y —',
  showSubtitle = true,
}) => {
  const isLight = variant === 'light';
  const textColor = isLight ? 'text-white' : 'text-neutral-950';
  const barColor = isLight ? 'bg-white' : 'bg-neutral-950';
  const subColor = isLight ? 'text-neutral-300' : 'text-neutral-600';

  return (
    <div className={`inline-flex flex-col items-center justify-center select-none ${className}`}>
      {/* Upper horizontal connecting bar across the top of Teezoon */}
      <div className="relative flex flex-col items-center">
        {/* Continuous roof bar */}
        <div className={`w-full h-[2.5px] sm:h-[3px] ${barColor} mb-[1px]`} />
        
        {/* Main Brandmark: Teezoon */}
        <div className="flex items-center tracking-tight leading-none">
          <span
            className={`text-xl sm:text-2xl font-black ${textColor}`}
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: '-0.03em',
            }}
          >
            Teezoon
          </span>
        </div>
      </div>

      {/* Subtitle: — m g r o u p o f c o m p a n y — */}
      {showSubtitle && (
        <span
          className={`text-[8px] sm:text-[9.5px] font-medium tracking-[0.18em] lowercase mt-0.5 whitespace-nowrap ${subColor}`}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {subtext}
        </span>
      )}
    </div>
  );
};
