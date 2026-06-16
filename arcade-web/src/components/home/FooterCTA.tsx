'use client';

import { Link } from '@/i18n/routing';
import { ArrowUpRight, Cpu, Shield, Zap } from 'lucide-react';

export default function FooterCTA() {
  return (
    <section className="relative overflow-hidden bg-surface-elevated py-32 border-t border-card-border">
      {/* Background Cyber-Tech Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-primary/5 opacity-50" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
        
        {/* Glow Spheres */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-danger/10 rounded-full blur-[150px]" />
      </div>

      <div className="page-wrapper relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
        
        {/* Left Side: Copy */}
        <div className="max-w-3xl text-center lg:text-left">
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase text-foreground mb-6 leading-[1.1]">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-warning">Dominate</span> <br className="hidden md:block"/> Your Market?
          </h2>
          <p className="text-xl md:text-2xl text-text-secondary mb-10 max-w-2xl font-medium tracking-wide">
            Equip your venue with industrial-grade, maximum-ROI amusement tech that players can't ignore. Let's engineer your success.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
            <Link 
              href="/#contact" // Assuming we have a contact section or quote page
              className="group flex items-center gap-3 bg-primary text-on-dark px-8 py-4 rounded-xl font-bold tracking-widest uppercase text-sm transition-all hover:bg-primary-hover hover:scale-105 shadow-[0_0_30px_rgba(var(--primary),0.3)] hover:shadow-[0_0_50px_rgba(var(--primary),0.6)]"
            >
              Get a Custom Quote <ArrowUpRight size={20} className="group-hover:rotate-45 transition-transform" />
            </Link>
            
            <Link 
              href="/products" 
              className="group flex items-center gap-3 bg-surface-overlay backdrop-blur-md text-foreground border border-border-subtle px-8 py-4 rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-card-bg transition-all"
            >
              Explore Full Catalog
            </Link>
          </div>
        </div>

        {/* Right Side: Trust Badges / Stats */}
        <div className="w-full lg:w-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-6">
          <div className="glass-panel bg-surface-overlay border border-border-subtle p-6 rounded-2xl flex items-center gap-4 hover:border-primary/50 transition-colors">
             <div className="bg-primary/20 p-3 rounded-lg text-primary">
               <Shield size={24} />
             </div>
             <div>
               <h4 className="text-foreground font-bold tracking-wider uppercase text-sm">3-Year Warranty</h4>
               <p className="text-xs text-text-secondary mt-1">Industrial grade hardware guaranteed.</p>
             </div>
          </div>
          
          <div className="glass-panel bg-surface-overlay border border-border-subtle p-6 rounded-2xl flex items-center gap-4 hover:border-primary/50 transition-colors">
             <div className="bg-primary/20 p-3 rounded-lg text-primary">
               <Zap size={24} />
             </div>
             <div>
               <h4 className="text-foreground font-bold tracking-wider uppercase text-sm">Plug & Play Setup</h4>
               <p className="text-xs text-text-secondary mt-1">Pre-configured for global voltages.</p>
             </div>
          </div>

          <div className="glass-panel bg-surface-overlay border border-border-subtle p-6 rounded-2xl flex items-center gap-4 hover:border-primary/50 transition-colors">
             <div className="bg-primary/20 p-3 rounded-lg text-primary">
               <Cpu size={24} />
             </div>
             <div>
               <h4 className="text-foreground font-bold tracking-wider uppercase text-sm">Lifetime Support</h4>
               <p className="text-xs text-text-secondary mt-1">24/7 technical hotline access.</p>
             </div>
          </div>
        </div>

      </div>
    </section>
  );
}
