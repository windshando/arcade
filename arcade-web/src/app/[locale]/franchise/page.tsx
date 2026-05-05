import FranchiseApplyButton from './FranchiseApplyButton';

export default async function FranchisePage() {
  let globalOps: any = {};
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/settings/public`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      globalOps = data.global_options || {};
    }
  } catch (err) {}

  return (
    <main className="py-20 px-8 mx-auto max-w-4xl min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 mt-10">Become A <span className="text-primary">Partner</span></h1>
        <p className="text-xl opacity-70 mb-4 font-light max-w-3xl mx-auto">Expand your arcade enterprise with our world-class franchise network. High yields, unparalleled products, ongoing strategy support.</p>
      </div>

      <div className="space-y-12 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-panel p-8 rounded-3xl text-center border border-card-border">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-lg font-bold mb-2">Global Network</h3>
            <p className="text-sm opacity-70">Join an established supply chain spanning 30+ countries with localized support.</p>
          </div>
          <div className="glass-panel p-8 rounded-3xl text-center border border-card-border">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-lg font-bold mb-2">High ROI</h3>
            <p className="text-sm opacity-70">Our partners report average returns of 35%+ within the first 18 months of operation.</p>
          </div>
          <div className="glass-panel p-8 rounded-3xl text-center border border-card-border">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-lg font-bold mb-2">Full Support</h3>
            <p className="text-sm opacity-70">From site selection to marketing campaigns, we provide end-to-end business guidance.</p>
          </div>
        </div>
      </div>

      <FranchiseApplyButton
        recaptchaSiteKey={globalOps.recaptchaSiteKey}
        isRecaptchaEnabled={globalOps.isRecaptchaEnabled === true || globalOps.isRecaptchaEnabled === 'true'}
      />
    </main>
  );
}
