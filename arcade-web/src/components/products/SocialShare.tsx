'use client';
import { Share2 } from 'lucide-react';

export default function SocialShare({ title, text }: { title?: string, text?: string }) {
  
  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: title || 'Check out this Arcade Machine',
          text: text || 'Explore this awesome product in our B2B trade platform.',
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share declined or failed', err);
      }
    } else {
      // Fallback copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (e) {
        alert('Sharing is not supported on this browser.');
      }
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="flex items-center justify-center gap-2 w-full mt-4 bg-card-bg border border-card-border hover:bg-card-border transition-colors text-foreground font-bold py-3 rounded-full text-sm"
    >
      <Share2 size={18} />
      Share with a Friend / Partner
    </button>
  );
}
