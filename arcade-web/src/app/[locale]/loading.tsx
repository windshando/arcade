export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 animate-pulse">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
      </div>
      <h2 className="text-xl font-bold tracking-widest uppercase text-primary">Loading System...</h2>
    </div>
  );
}
