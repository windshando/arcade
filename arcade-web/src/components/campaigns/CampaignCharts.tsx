'use client';

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export function CampaignPieChart({ data }: { data: { sent: number, failed: number, opened: number, clicked: number, total: number } }) {
  if (data.total === 0) return <div className="text-center text-sm opacity-50 py-10">No target audience data.</div>;

  // We want to visualize Sent out of Total, Failed out of Total, and Opened relative to Sent
  // A clean pie for statuses
  const statusData = [
    { name: 'Successfully Sent', value: data.sent, color: '#3b82f6' }, // Blue
    { name: 'Failed (Bounced)', value: data.failed, color: '#ef4444' } // Red
  ];

  // A secondary pie for engagement
  const engagementData = [
    { name: 'Opened & Read', value: data.opened, color: '#22c55e' }, // Green
    { name: 'Unopened', value: Math.max(0, data.sent - data.opened), color: '#3b82f6' } // Blue baseline
  ];

  return (
    <div className="grid grid-cols-2 gap-4 h-64">
      <div className="h-full">
         <h4 className="text-center text-xs font-bold opacity-60 uppercase mb-2">Delivery</h4>
         <ResponsiveContainer width="100%" height="100%">
           <PieChart>
             <Pie data={statusData} innerRadius={35} outerRadius={60} paddingAngle={2} dataKey="value" stroke="none">
               {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
             </Pie>
             <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
           </PieChart>
         </ResponsiveContainer>
      </div>
      <div className="h-full">
         <h4 className="text-center text-xs font-bold opacity-60 uppercase mb-2">Engagement</h4>
         <ResponsiveContainer width="100%" height="100%">
           <PieChart>
             <Pie data={engagementData} innerRadius={35} outerRadius={60} paddingAngle={2} dataKey="value" stroke="none">
               {engagementData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
             </Pie>
             <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
           </PieChart>
         </ResponsiveContainer>
      </div>
    </div>
  );
}
