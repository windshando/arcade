'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Phone, MessageCircle, X } from 'lucide-react';

export default function FloatingContactWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [globalOps, setGlobalOps] = useState<any>({});

  // Hide on admin pages
  if (pathname.includes('/admin')) return null;

  useEffect(() => {
    // Fetch public settings for contact info
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/settings/public`);
        if (res.ok) {
          const data = await res.json();
          setGlobalOps(data.global_options || {});
        }
      } catch (err) {}
    };
    fetchSettings();
  }, []);

  const whatsapp = globalOps.contactWhatsapp || '1234567890';
  const phone = globalOps.contactPhone || '1234567890';

  return (
    <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="flex flex-col gap-3 animate-fade-in-up">
          <a
            href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:-translate-y-1 transition-transform"
          >
            <span className="font-bold text-sm">WhatsApp</span>
            <MessageCircle size={20} />
          </a>
          <a
            href={`tel:${phone.replace(/[^\d+]/g, '')}`}
            className="flex items-center gap-3 bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-lg hover:-translate-y-1 transition-transform"
          >
            <span className="font-bold text-sm">Call Us</span>
            <Phone size={20} />
          </a>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-card-bg border border-card-border shadow-xl rounded-full flex items-center justify-center text-foreground hover:bg-card-border transition-colors duration-200"
      >
        {isOpen ? <X size={24} /> : <Phone size={24} className="opacity-80" />}
      </button>
    </div>
  );
}
