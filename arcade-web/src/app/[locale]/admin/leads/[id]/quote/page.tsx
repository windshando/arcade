import { fetchAdminAPI } from '@/lib/adminApi';
import { Link } from '@/i18n/routing';
import PrintInvoiceButton from './PrintButton';

export default async function LeadQuotePdfPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const lead = await fetchAdminAPI(`/admin/crm/leads/${resolvedParams.id}`);
  
  const d = new Date();
  const dateStr = d.toLocaleDateString();
  const validUntil = new Date(d.setDate(d.getDate() + 30)).toLocaleDateString(); // 30 Day validity
  
  return (
    <div className="bg-white text-black min-h-screen font-sans print:p-0 print:bg-white print:m-0 w-full overflow-x-hidden">
      
      {/* Hide the top panel when printing */}
      <div className="p-4 bg-gray-100 print:hidden flex justify-between items-center print-hide border-b shadow-sm mb-8">
         <Link href={`/admin/leads/${lead.id}`} className="text-primary font-bold hover:underline">
            ← Back to Lead Details
         </Link>
         <PrintInvoiceButton />
      </div>

      <div className="max-w-[210mm] mx-auto p-12 bg-white print:shadow-none print:max-w-none print:w-full print:m-0"
           style={{ minHeight: '297mm' }}>
         
         <div className="flex justify-between items-start border-b-4 border-black pb-8 mb-8">
            <div className="space-y-1">
               <h1 className="text-4xl font-black uppercase tracking-tighter">Official Quote</h1>
               <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Arcade Master Inc.</p>
            </div>
            <div className="text-right">
               <div className="font-bold text-xl mb-2">Quote #{lead.id.substring(lead.id.length - 8).toUpperCase()}</div>
               <div className="text-sm text-gray-600">Date: {dateStr}</div>
               <div className="text-sm text-gray-600">Valid Until: {validUntil}</div>
            </div>
         </div>

         <div className="grid grid-cols-2 gap-12 mb-12">
            <div>
               <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Customer Details</p>
               <h2 className="text-2xl font-bold">{lead.contactName || 'Valued Customer'}</h2>
               {lead.companyName && <p className="text-lg font-medium text-gray-700">{lead.companyName}</p>}
               <p className="text-gray-600">{lead.contactEmail}</p>
               <p className="text-gray-600">{lead.contactPhone}</p>
               {lead.countryCode && <p className="text-gray-600 font-bold mt-2">Destination: {lead.countryCode}</p>}
            </div>
            <div className="text-right">
               <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Vendor Details</p>
               <h2 className="text-xl font-bold">Arcade Master Manufacturing</h2>
               <p className="text-gray-600">Global Trade Operations Center</p>
               <p className="text-gray-600">sales@arcademaster.com</p>
               <p className="text-gray-600">Tel: +1 (800) 555-0199</p>
            </div>
         </div>

         <div className="border border-gray-300 rounded mb-12 overflow-hidden">
            <table className="w-full text-left">
               <thead className="bg-gray-100 border-b border-gray-300">
                  <tr>
                     <th className="p-4 uppercase tracking-widest text-xs">Item Description</th>
                     <th className="p-4 uppercase tracking-widest text-xs text-center border-l border-gray-300">Requested QTY</th>
                     <th className="p-4 uppercase tracking-widest text-xs text-right border-l border-gray-300">Price Per Unit</th>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td className="p-6 align-top max-w-sm border-b border-gray-200">
                        <p className="text-lg font-bold mb-2">{lead.product?.translations?.[0]?.name || 'Custom Arcade Machine Inquiry'}</p>
                        {lead.message && (
                           <div className="text-sm text-gray-600 italic bg-gray-50 p-4 border-l-4 border-gray-300 rounded">
                             "{lead.message}"
                           </div>
                        )}
                        <ul className="mt-4 space-y-1 text-sm text-gray-600">
                           {lead.product?.voltage && <li>Voltage Standard: {lead.product.voltage}</li>}
                           {lead.product?.dimensions && <li>Dimensions: {lead.product.dimensions}</li>}
                        </ul>
                     </td>
                     <td className="p-6 align-top text-center font-mono text-lg border-l border-b border-gray-200">
                        {lead.requestedQuantity || 'TBD'}
                     </td>
                     <td className="p-6 align-top text-right font-mono text-lg border-l border-b border-gray-200">
                        <div className="text-gray-400 text-sm italic">Pending Sales Negotiation</div>
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>

         <div className="grid grid-cols-2 gap-12 mt-12 pt-8 border-t-2 border-dashed border-gray-300">
            <div>
               <h3 className="font-bold uppercase tracking-widest mb-4">Terms & Conditions</h3>
               <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
                  <li>Payment requires 30% wire transfer deposit via T/T to initiate manufacturing.</li>
                  <li>Balance of 70% must be paid before container loading.</li>
                  <li>Standard FOB Shenzhen incoterms apply unless otherwise negotiated.</li>
                  <li>All prices exclude local import tariffs and port destination fees.</li>
               </ul>
            </div>
            <div className="flex justify-end items-end">
               <div className="w-64 border-b-2 border-black pb-2 text-center">
                  <div className="font-handwriting text-3xl mb-2 text-blue-900 transform -rotate-2">Authorized Sig</div>
                  <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Authorized Signature</p>
               </div>
            </div>
         </div>
         
         <div className="mt-16 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
            Generated securely by Arcade Master CRM platform. Confidential Document.
         </div>
      </div>
    </div>
  );
}
