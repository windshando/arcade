"use client";

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Link } from '@/i18n/routing';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export default function ProductListClient({ initialProducts }: { initialProducts: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => {
      if (!searchTerm) return true;
      const lowerTerm = searchTerm.toLowerCase();
      const matchSlug = p.slug?.toLowerCase().includes(lowerTerm);
      const matchSku = p.sku?.toLowerCase().includes(lowerTerm);
      // We'll also check english name from translations
      const matchName = p.translations?.some((t: any) => t.name.toLowerCase().includes(lowerTerm));
      
      return matchSlug || matchSku || matchName;
    });
  }, [initialProducts, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 bg-background/50 backdrop-blur border border-card-border rounded-2xl p-4">
        <label className="text-sm font-semibold opacity-70">Filters:</label>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by name, slug, or SKU..."
            className="w-full pl-10 pr-4 py-2 border border-card-border rounded-xl bg-card-bg focus:outline-none focus:border-primary text-sm shadow-inner"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-card-border/50">
            <tr>
              <th className="py-4 px-6 font-semibold opacity-80 text-sm w-24">Status</th>
              <th className="py-4 px-6 font-semibold opacity-80 text-sm w-24">Image</th>
              <th className="py-4 px-6 font-semibold opacity-80 text-sm">Product Info</th>
              <th className="py-4 px-6 font-semibold opacity-80 text-sm">Category</th>
              <th className="py-4 px-6 font-semibold opacity-80 text-sm">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {filteredProducts.map((p: any) => {
              const mainName = p.translations?.[0]?.name || p.slug;
              return (
                <tr key={p.id} className="hover:bg-card-border/30 transition-colors">
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                      p.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-500' :
                      'bg-card-border text-foreground'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {p.mediaItems && p.mediaItems.length > 0 ? (
                      <div 
                        className="w-16 h-16 rounded-xl bg-cover bg-center border border-card-border"
                        style={{ backgroundImage: `url(${API_BASE_URL}/media/public/${p.mediaItems[0].mediaFile.storageKey})` }}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-card-border/30 flex items-center justify-center text-[10px] opacity-50 font-bold uppercase text-center leading-tight p-1">No<br/>Image</div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-foreground">{mainName}</div>
                    <div className="text-xs opacity-60 mt-1 uppercase tracking-wider">{p.slug} | {p.sku || 'NO SKU'}</div>
                  </td>
                  <td className="py-4 px-6 font-medium opacity-80 text-sm">
                    {p.category?.slug || '-'}
                  </td>
                  <td className="py-4 px-6 text-sm opacity-70">
                    {new Date(p.updatedAt).toISOString().split('T')[0]}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link href={`/admin/products/${p.id}`} className="text-primary hover:text-primary-hover font-bold text-sm bg-primary/10 px-4 py-2 rounded-lg transition-colors">
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center opacity-60">No products found for "{searchTerm}"</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
