import SlideForm from '../SlideForm';

export default function NewSlidePage() {
  return (
    <div className="p-6 md:p-8 w-full max-w-[1600px] mx-auto animate-fade-in space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Create Hero Slide</h1>
        <p className="opacity-70 mt-1">Design a new high-impact slide for your home page.</p>
      </div>

      <SlideForm />
    </div>
  );
}
