'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ThumbsUp, ThumbsDown } from 'lucide-react';
import { voteFaq } from '@/lib/api';

export default function ClientFaqAccordion({ faq }: { faq: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [votedType, setVotedType] = useState<'UP' | 'DOWN' | null>(null);
  
  useEffect(() => {
    // Check if user has already voted
    const storageVoted = localStorage.getItem(`faq_vote_${faq.id}`);
    if (storageVoted === 'UP' || storageVoted === 'DOWN') {
      setVotedType(storageVoted);
    }
  }, [faq.id]);

  const handleVote = async (e: React.MouseEvent, type: 'UP' | 'DOWN') => {
    e.stopPropagation(); // prevent toggling accordion
    if (votedType) return; // already voted

    try {
      setVotedType(type);
      localStorage.setItem(`faq_vote_${faq.id}`, type);
      await voteFaq(faq.id, type);
    } catch (err) {
      console.error('Failed to vote:', err);
      // Revert optimistic update
      setVotedType(null);
      localStorage.removeItem(`faq_vote_${faq.id}`);
    }
  };

  return (
    <div className="glass-panel overflow-hidden transition-all duration-300 border border-card-border mb-3 rounded-2xl">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between p-5 text-left hover:bg-card-border/30 transition-colors"
      >
        <h3 className="font-bold text-foreground text-lg pr-4">{faq.question}</h3>
        {isOpen ? <ChevronUp className="text-primary shrink-0" size={24} /> : <ChevronDown className="text-primary shrink-0" size={24} />}
      </button>

      {isOpen && (
        <div className="px-5 pb-5 pt-2 border-t border-card-border/50 animate-slide-up">
          <div 
            className="text-foreground opacity-80 leading-relaxed font-light mb-6 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: faq.answer }}
          />

          <div className="flex items-center gap-4 pt-4 border-t border-card-border/30">
            <span className="text-xs font-semibold uppercase tracking-widest opacity-50">Was this helpful?</span>
            <div className="flex gap-2">
              <button 
                onClick={(e) => handleVote(e, 'UP')}
                disabled={!!votedType}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  votedType === 'UP' 
                    ? 'bg-green-500/20 text-green-600 border border-green-500/50' 
                    : votedType === 'DOWN' 
                      ? 'opacity-30 cursor-not-allowed hidden'
                      : 'bg-card-border/50 hover:bg-green-500/10 hover:text-green-600'
                }`}
              >
                <ThumbsUp size={14} className={votedType === 'UP' ? 'fill-current' : ''} />
                {votedType === 'UP' ? 'Thanks for voting!' : 'Yes'}
              </button>
              
              <button 
                onClick={(e) => handleVote(e, 'DOWN')}
                disabled={!!votedType}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  votedType === 'DOWN' 
                    ? 'bg-red-500/20 text-red-600 border border-red-500/50' 
                    : votedType === 'UP' 
                      ? 'opacity-30 cursor-not-allowed hidden'
                      : 'bg-card-border/50 hover:bg-red-500/10 hover:text-red-600'
                }`}
              >
                <ThumbsDown size={14} className={votedType === 'DOWN' ? 'fill-current' : ''} />
                {votedType === 'DOWN' ? 'We will improve this.' : 'No'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
