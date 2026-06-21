import { fetchAdminAPI } from '@/lib/adminApi';
import AdvantageForm from '../AdvantageForm';
import { notFound } from 'next/navigation';

export default async function EditAdvantagePage({ params }: { params: any }) {
  const { id } = await params;
  
  let advantage;
  try {
    advantage = await fetchAdminAPI(`/advantages/admin/${id}`);
  } catch (error) {
    notFound();
  }

  return (
    <div className="p-6 md:p-8 w-full max-w-[1600px] mx-auto animate-fade-in space-y-6">
      <AdvantageForm initialData={advantage} isEditing={true} />
    </div>
  );
}
