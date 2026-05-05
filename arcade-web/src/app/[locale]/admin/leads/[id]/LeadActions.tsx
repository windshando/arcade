'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { updateLeadStatus } from '@/app/actions';

export default function LeadActions({ leadId, currentStatus }: { leadId: string, currentStatus: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLoading(true);
    const newStatus = e.target.value;
    try {
      await updateLeadStatus(leadId, newStatus);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <select 
        value={currentStatus} 
        onChange={handleStatusChange}
        disabled={loading}
        className={`border-2 rounded-xl px-4 py-2 font-bold focus:outline-none transition-colors disabled:opacity-50 appearance-none text-center cursor-pointer ${
          currentStatus === 'NEW' ? 'bg-blue-500/10 text-blue-500 border-blue-500/30' :
          currentStatus === 'WON' ? 'bg-green-500/10 text-green-500 border-green-500/30' :
          currentStatus === 'LOST' || currentStatus === 'INVALID' ? 'bg-red-500/10 text-red-500 border-red-500/30' :
          'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
        }`}
      >
        <option value="NEW">NEW</option>
        <option value="CONTACTED">CONTACTED</option>
        <option value="QUALIFIED">QUALIFIED</option>
        <option value="QUOTED">QUOTED</option>
        <option value="NEGOTIATING">NEGOTIATING</option>
        <option value="SAMPLE_SENT">SAMPLE_SENT</option>
        <option value="WON">WON</option>
        <option value="LOST">LOST</option>
        <option value="INVALID">INVALID</option>
      </select>
    </div>
  );
}
