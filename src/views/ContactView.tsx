import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ChevronDown,
  HelpCircle
} from 'lucide-react';

const FAQS = [
  {
    q: 'How long does delivery take across India?',
    a: 'We dispatch all orders within 24 business hours via Express Air couriers (Bluedart, Delhivery). Delivery typically takes 2 to 4 business days depending on your metro or regional city.'
  },
  {
    q: 'What is 240 GSM combed cotton and why does it matter?',
    a: 'GSM stands for Grams per Square Meter. Standard t-shirts use 140–160 GSM, which is thin and loses shape easily. Our 240 GSM heavyweight combed cotton provides an architectural drape, opaque finish, and exceptional longevity.'
  },
  {
    q: 'Can I exchange my size if it doesn’t fit properly?',
    a: 'Yes! We offer a 7-day hassle-free doorstep exchange policy. Simply message our WhatsApp support (+91 98765 43210) with your order ID and desired size.'
  },
  {
    q: 'Do you offer Cash on Delivery (COD)?',
    a: 'Yes, Cash on Delivery is available across 25,000+ pin codes in India with no extra surprise charges on orders over ₹999.'
  },
  {
    q: 'Can we order customized T-Shirts for colleges or companies?',
    a: 'Absolutely. We handle custom Screen Printing, Japanese Embroidery, and DTG prints for orders starting from 20 units with tier discount pricing.'
  }
];

export const ContactView: React.FC = () => {
  const { showToast } = useCart();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Order Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      showToast('Please fill all required fields', '', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Message Dispatched!', 'Our team will reach out to you within 2 hours.', 'success');
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24 text-left">
      {/* Header Banner */}
      <div className="bg-neutral-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
            Customer Care & Flagship Studio
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white">
            Get In Touch With SWAMI THREADS
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl">
            Whether you need sizing advice, order tracking updates, or custom merchandise production, our team is always ready.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        
        {/* 2-Column Info & Message Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm space-y-8">
            <div>
              <h2 className="text-2xl font-extrabold font-display text-neutral-950">
                SWAMI THREADS APPAREL
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Direct Communication Channels
              </p>
            </div>

            <div className="space-y-6 text-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-semibold uppercase">Telephone Hotline</p>
                  <a href="tel:+919876543210" className="text-base font-extrabold text-neutral-950 hover:underline">
                    +91 98765 43210
                  </a>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Mon - Sat: 9 AM - 9 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-semibold uppercase">WhatsApp Business</p>
                  <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="text-base font-extrabold text-emerald-700 hover:underline">
                    +91 98765 43210
                  </a>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Instant order booking & status</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-semibold uppercase">Official Email</p>
                  <a href="mailto:contact@swamithreads.com" className="text-base font-bold text-neutral-950 hover:underline">
                    contact@swamithreads.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-semibold uppercase">Flagship Studio & Office</p>
                  <p className="text-sm font-medium text-neutral-800 mt-0.5">
                    42 Fashion Boulevard, 100ft Road, Indiranagar, Bengaluru, Karnataka 560038
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-semibold uppercase">Studio Working Hours</p>
                  <p className="text-xs text-neutral-700 mt-0.5">
                    Monday – Saturday: 09:00 AM – 09:00 PM<br />
                    Sunday: 10:00 AM – 06:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Mobile Action Buttons */}
            <div className="pt-4 border-t border-neutral-100 grid grid-cols-2 gap-3">
              <a
                href="tel:+919876543210"
                className="bg-neutral-900 hover:bg-black text-white text-center py-3.5 px-4 rounded-xl text-xs font-bold tracking-wide transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>CALL NOW</span>
              </a>

              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-center py-3.5 px-4 rounded-xl text-xs font-bold tracking-wide transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WHATSAPP</span>
              </a>
            </div>
          </div>

          {/* Right: Interactive Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-neutral-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-2xl font-extrabold font-display text-neutral-950">
                Send Us A Direct Message
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                We typically respond within 2 business hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold text-emerald-950">
                  Message Sent Successfully!
                </h4>
                <p className="text-xs text-emerald-800">
                  Thank you for reaching out. A representative has been assigned to your query.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-bold underline text-neutral-900"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Roy"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs bg-neutral-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 XXXXX"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs bg-neutral-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="ananya@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs bg-neutral-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Subject
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs bg-neutral-50"
                    >
                      <option value="Order Inquiry">Order Status & Delivery</option>
                      <option value="Sizing Help">Sizing & Fit Consultation</option>
                      <option value="Bulk Order">Bulk / Corporate Merchandising</option>
                      <option value="Exchange">Exchange / Returns Request</option>
                      <option value="Other">Other Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Provide details about your query or requirement..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs bg-neutral-50 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-neutral-950 hover:bg-black text-white py-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>DISPATCH MESSAGE</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200 shadow-sm space-y-6">
          <div className="space-y-1 text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
              Got Questions?
            </span>
            <h3 className="text-2xl font-extrabold font-display text-neutral-950">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="divide-y divide-neutral-200 max-w-3xl mx-auto pt-4">
            {FAQS.map((faq, index) => (
              <div key={index} className="py-4">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between text-left text-sm font-bold text-neutral-900 hover:text-black gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <p className="text-xs text-neutral-600 mt-2.5 leading-relaxed pr-6">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
