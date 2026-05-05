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
    <div className="p-8 animate-fade-in pb-32 max-w-6xl mx-auto">
      <AdvantageForm initialData={advantage} isEditing={true} />
    </div>
  );
}
