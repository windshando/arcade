import * as LucideIcons from 'lucide-react';
import { Star } from 'lucide-react';

export default function AdvantageGrid({ advantages }: { advantages: any[] }) {
  if (!advantages || advantages.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* High-Tech Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none select-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 uppercase text-foreground">
            Why Choose <span className="text-primary">Arcade Trade</span>
          </h2>
          <p className="text-lg opacity-60 max-w-2xl mx-auto">
            Experience next-generation robotics, premium engineering, and world-class distribution capabilities tailored for your venue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {advantages.map((adv) => {
            const IconComponent = (LucideIcons as any)[adv.iconName] || Star;

            return (
              <div 
                key={adv.id} 
                className="group relative glass-panel p-8 rounded-3xl hover:-translate-y-2 transition-all duration-300 border border-card-border hover:border-primary/50 overflow-hidden"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-inner shadow-black/50 border border-slate-700/50 group-hover:shadow-[0_0_20px_rgba(var(--primary),0.2)] transition-shadow">
                    <IconComponent size={32} />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight mb-3 text-white group-hover:text-primary transition-colors">
                    {adv.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    {adv.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
