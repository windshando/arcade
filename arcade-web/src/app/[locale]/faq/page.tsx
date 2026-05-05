'use client';

import React, { useEffect, useState } from 'react';
import { getPublicFaqs } from '@/lib/api';
import ClientFaqAccordion from '@/components/faq/ClientFaqAccordion';
import { Search } from 'lucide-react';

export default function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locale, setLocale] = useState('EN');

  useEffect(() => {
    params.then((p) => {
      const loc = p.locale === 'zh-CN' ? 'ZH_CN' : 'EN';
      setLocale(loc);
      getPublicFaqs(loc)
        .then(setCategories)
        .catch(console.error)
        .finally(() => setLoading(false));
    });
  }, [params]);

  // Client-side filtering logic
  const filteredCategories = categories.map(cat => ({
    ...cat,
    faqs: cat.faqs.filter((faq: any) => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.faqs.length > 0);

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center font-bold tracking-widest text-primary animate-pulse">LOADING...</div>;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-20 min-h-screen animate-fade-in">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-foreground mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-xl opacity-70 mb-10 max-w-2xl mx-auto">
          Find answers to common questions about our arcade machines, shipping, warranties, and customization.
        </p>

        {/* Auto Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-primary opacity-70" size={20} />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 glass-panel border border-primary/20 rounded-2xl text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-xl text-lg font-medium"
            placeholder="What do you need help with?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="text-center py-20 opacity-60">
          <h2 className="text-2xl font-bold mb-2">No results found</h2>
          <p>We couldn't match any questions to "{searchQuery}". Try different keywords!</p>
        </div>
      ) : (
        <div className="space-y-16">
          {filteredCategories.map(category => (
            <section key={category.id}>
              <div className="mb-6 border-b border-card-border pb-2 flex items-center gap-3">
                <div className="w-8 h-1 bg-primary rounded-full"></div>
                <h2 className="text-2xl font-extrabold tracking-wide uppercase text-foreground">
                  {category.name}
                </h2>
              </div>
              <div className="space-y-3">
                {category.faqs.map((faq: any) => (
                  <ClientFaqAccordion key={faq.id} faq={faq} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
