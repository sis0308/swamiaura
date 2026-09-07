import React from 'react';
import { MessageCircle, PhoneCall } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  const phoneNumber = '+919876543210';
  const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(
    'Hi TEEZOON! I would like to inquire about your premium T-Shirts.'
  )}`;

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-2.5">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        aria-label="Chat on WhatsApp"
        id="floating-whatsapp-btn"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="text-xs font-semibold tracking-wide hidden md:inline-block">
          Chat on WhatsApp
        </span>
      </a>

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
