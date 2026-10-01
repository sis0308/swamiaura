import React from 'react';
import { MessageCircle, PhoneCall, Instagram, Youtube } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  const phoneNumber = '+917756061273';
  const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(
    'Hi TEEZOON! I would like to inquire about your premium T-Shirts.'
  )}`;
  const instagramUrl = 'https://www.instagram.com/teezoon.in?stkn=MW0xOWY3ZjQwb3djOA==';
  const youtubeUrl = 'https://youtube.com/@teezoon?si=8r9mlRYz0VLKXsGDsi=8r9mlRYz0VLKXsGD';

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-2.5 items-start">
      {/* YouTube Button */}
      <a
        href={youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 bg-[#FF0000] hover:bg-[#CC0000] text-white px-3.5 py-2.5 rounded-full shadow-lg hover:shadow-red-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        aria-label="Subscribe to @teezoon on YouTube"
        id="floating-youtube-btn"
      >
        <Youtube className="w-5 h-5 shrink-0" />
        <span className="text-xs font-semibold tracking-wide hidden md:inline-block">
          YouTube: @teezoon
        </span>
      </a>

      {/* Instagram Button */}
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-95 text-white px-3.5 py-2.5 rounded-full shadow-lg hover:shadow-pink-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        aria-label="Follow @teezoon.in on Instagram"
        id="floating-instagram-btn"
      >
        <Instagram className="w-5 h-5 shrink-0" />
        <span className="text-xs font-semibold tracking-wide hidden md:inline-block">
          Follow @teezoon.in
        </span>
      </a>

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        aria-label="Chat on WhatsApp"
        id="floating-whatsapp-btn"
      >
        <MessageCircle className="w-5 h-5 fill-current shrink-0" />
        <span className="text-xs font-semibold tracking-wide hidden md:inline-block">
          Chat on WhatsApp
        </span>
      </a>

      {/* Phone Call (Mobile Only) */}
      <a
        href={`tel:${phoneNumber}`}
        className="md:hidden flex items-center justify-center w-12 h-12 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full shadow-lg transition-all"
        aria-label="Call Business Directly"
        id="floating-call-btn"
      >
        <PhoneCall className="w-5 h-5" />
      </a>
    </div>
  );
};

