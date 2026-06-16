import { Link } from '@/i18n/routing';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 page-wrapper">
      <div className="glass-panel p-12 md:p-20 rounded-3xl max-w-2xl w-full border border-card-border/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-danger mb-4 drop-shadow-sm">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 uppercase tracking-widest">
          Connection Lost
        </h2>
        <p className="text-text-secondary mb-10 text-lg">
          The sector you are looking for has been archived or does not exist in this terminal.
        </p>
        <Link href="/" className="btn-primary py-4 px-10 text-lg shadow-xl shadow-primary/20 hover:-translate-y-1 transition-transform">
          Return to Hub
        </Link>
      </div>
    </div>
  );
}
