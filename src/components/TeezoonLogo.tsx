import React from 'react';

interface TeezoonLogoProps {
  className?: string;
  variant?: 'dark' | 'light'; // 'dark' is black text (transparent bg for light mode), 'light' is white text (for dark headers/footers)
}

export const TeezoonLogo: React.FC<TeezoonLogoProps> = ({
  className = '',
  variant = 'dark',
}) => {
  const color = variant === 'light' ? 'text-white' : 'text-neutral-950';

  return (
    <div className={`inline-flex flex-col items-center justify-center ${color} select-none ${className}`}>
      {/* Upper horizontal connecting roof bar spanning over Teezoon with end pillar caps */}
      <div className="w-full flex items-stretch">
        <div className="w-full flex flex-col">
          {/* Top Bar */}
          <div className="w-full h-[2.5px] sm:h-[3px] bg-current" />
          
          {/* Wordmark with end serif pillars */}
          <div className="flex items-center justify-between gap-[1px] relative pt-0.5">
            {/* Left drop pillar from bar for 'T' */}
            <div className="w-[3px] sm:w-[3.5px] h-4 sm:h-5 bg-current -mt-0.5" />

            {/* Brand text styled identically to reference image */}
            <div
              className="text-lg sm:text-2xl font-black tracking-tight leading-none px-1"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                letterSpacing: '-0.02em',
              }}
            >
              <span className="font-extrabold">Teezoo</span>
              <span className="font-extrabold">n</span>
            </div>

            {/* Right drop pillar from bar for end frame */}
            <div className="w-[3px] sm:w-[3.5px] h-4 sm:h-5 bg-current -mt-0.5" />
          </div>
        </div>
      </div>

      {/* Subtitle: — m g r o u p o f c o m p a n y — */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 w-full mt-0.5">
        <span className="h-[1.5px] w-3 sm:w-5 bg-current opacity-80" />
        <span
          className="text-[8px] sm:text-[9.5px] tracking-[0.2em] sm:tracking-[0.22em] lowercase font-semibold opacity-90 whitespace-nowrap"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          m group of company
        </span>
        <span className="h-[1.5px] w-3 sm:w-5 bg-current opacity-80" />
      </div>
    </div>
  );
};
