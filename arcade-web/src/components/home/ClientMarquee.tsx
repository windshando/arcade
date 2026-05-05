'use client';

import { 
  Globe, 
  Activity, 
  Wifi, 
  Monitor, 
  Server,
  Box,
  Layers,
  Hexagon,
  Triangle,
  Cpu
} from 'lucide-react';

const clients = [
  { name: 'Apex Gaming', icon: <Hexagon size={40} /> },
  { name: 'Nova Arcades', icon: <Triangle size={40} /> },
  { name: 'Quantum Leisure', icon: <Cpu size={40} /> },
  { name: 'Neon Sphere', icon: <Box size={40} /> },
  { name: 'Cyber Frontier', icon: <Layers size={40} /> },
  { name: 'Vortex FEC', icon: <Activity size={40} /> },
  { name: 'Matrix Resorts', icon: <Server size={40} /> },
  { name: 'Pixel Dynamics', icon: <Monitor size={40} /> },
];

export default function ClientMarquee() {
  return (
    <section className="py-20 relative overflow-hidden bg-background border-t border-b border-card-border/50">
      <style suppressHydrationWarning>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none" />
      
      <div className="container mx-auto px-6 mb-10 text-center relative z-20">
        <p className="text-sm font-bold tracking-[0.2em] uppercase text-primary mb-2">Powered by Global Partners</p>
        <h2 className="text-3xl font-bold opacity-80 text-foreground">Trusted by Leading Entertainment Hubs Worldwide</h2>
      </div>

      <div className="flex w-[200%] md:w-[150%] animate-marquee opacity-60 hover:opacity-100 transition-opacity duration-500">
        <div className="flex w-1/2 justify-around items-center gap-12 px-12">
          {clients.map((client, i) => (
            <div key={i} className="flex flex-col items-center gap-3 grayscale hover:grayscale-0 transition-all duration-300 group">
              <div className="text-slate-400 group-hover:text-primary transition-colors drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]">
                {client.icon}
              </div>
              <span className="text-xs font-bold tracking-widest uppercase text-slate-500 group-hover:text-white transition-colors">
                {client.name}
              </span>
            </div>
          ))}
        </div>
        <div className="flex w-1/2 justify-around items-center gap-12 px-12">
          {clients.map((client, i) => (
            <div key={`dup-${i}`} className="flex flex-col items-center gap-3 grayscale hover:grayscale-0 transition-all duration-300 group">
              <div className="text-slate-400 group-hover:text-primary transition-colors drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]">
                {client.icon}
              </div>
              <span className="text-xs font-bold tracking-widest uppercase text-slate-500 group-hover:text-white transition-colors">
                {client.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
