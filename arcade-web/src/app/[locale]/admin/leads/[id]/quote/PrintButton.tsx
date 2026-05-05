'use client';

export default function PrintInvoiceButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="btn-primary py-3 px-8 text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 print:hidden uppercase tracking-widest font-black"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
      Save as PDF / Print Quote
    </button>
  );
}
