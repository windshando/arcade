import { fetchAdminAPI } from '@/lib/adminApi';
import SlideForm from '../SlideForm';
import { notFound } from 'next/navigation';

export default async function EditSlidePage({ params }: { params: any }) {
  const { id } = await params;
  
  let slide;
  try {
    slide = await fetchAdminAPI(`/slides/admin/${id}`);
  } catch (error) {
    notFound();
  }

  return (
    <div className="p-8 animate-fade-in pb-32 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Edit Hero Slide</h1>
        <p className="opacity-70 mt-1">Refine your homepage slide content and layout.</p>
      </div>

      <SlideForm initialData={slide} isEditing={true} />
    </div>
  );
}
