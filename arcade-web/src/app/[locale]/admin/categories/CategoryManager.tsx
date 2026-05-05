"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { FolderTree, Settings, Plus, Trash2, Edit2 } from 'lucide-react';
import { createCategory, updateCategory, deleteCategory } from '@/app/actions';

export default function CategoryManager({ initialCategories }: { initialCategories: any[] }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingToParent, setAddingToParent] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Build Tree
  const rootCategories = initialCategories.filter(c => !c.parentId);
  
  const handleActionWrapper = async (actionFn: Promise<any>) => {
    setErrorMsg(null);
    try {
      await actionFn;
      startTransition(() => {
        router.refresh();
      });
      setEditingId(null);
      setAddingToParent(null);
    } catch (e: any) {
      setErrorMsg(e.message || "An error occurred");
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this category? Backend will block if there are products or subcategories inside.')) return;
    handleActionWrapper(deleteCategory(id));
  };

  const CategoryForm = ({ parentId, existingCat = null }: { parentId?: string | null, existingCat?: any }) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      if (existingCat) {
        handleActionWrapper(updateCategory(existingCat.id, formData));
      } else {
        if (parentId) formData.append('parentId', parentId);
        handleActionWrapper(createCategory(formData));
      }
    };

    return (
      <form onSubmit={handleSubmit} className="flex gap-2 items-center w-full mt-2 bg-black/5 p-2 rounded-lg border border-card-border">
        <input 
          name="slug" 
          defaultValue={existingCat?.slug || ''} 
          placeholder="Category Slug" 
          required 
          className="bg-background border border-card-border px-3 py-1.5 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary flex-1" 
        />
        <input 
          name="nameEn" 
          defaultValue={existingCat?.translations?.[0]?.name || ''} 
          placeholder="English Name" 
          className="bg-background border border-card-border px-3 py-1.5 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary flex-1" 
        />
        <input 
          name="description" 
          defaultValue={existingCat?.translations?.[0]?.description || ''} 
          placeholder="Category Description" 
          className="bg-background border border-card-border px-3 py-1.5 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary flex-2 hidden xl:block" 
        />
        <input 
          name="coverMediaId" 
          defaultValue={existingCat?.coverMediaId || ''} 
          placeholder="Cover Media ID (Optional)" 
          className="bg-background border border-card-border px-3 py-1.5 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary flex-1 hidden md:block" 
        />
        <button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50">
          Save
        </button>
        <button 
          type="button" 
          onClick={() => { setEditingId(null); setAddingToParent(null); }} 
          className="px-3 py-1.5 hover:bg-black/10 rounded-md text-sm transition-colors"
        >
          Cancel
        </button>
      </form>
    );
  };

  const renderTree = (parentId: string | null, depth = 0) => {
    const children = initialCategories.filter(c => c.parentId === parentId).sort((a, b) => a.sortOrder - b.sortOrder);
    
    if (children.length === 0 && depth > 0) return null;

    return (
      <ul className={`space-y-2 ${depth > 0 ? "ml-8 border-l border-primary/20 pl-4 mt-2" : ""}`}>
        {children.map(category => (
          <li key={category.id} className="relative">
            {editingId === category.id ? (
              <CategoryForm existingCat={category} parentId={category.parentId} />
            ) : (
              <div className="flex items-center justify-between group py-2 px-3 hover:bg-primary/5 rounded-lg transition-colors border border-transparent hover:border-card-border">
                <div className="flex items-center gap-3">
                  <FolderTree className="text-primary/60" size={18} />
                  <span className="font-semibold">{category.slug}</span>
                  <span className="text-sm opacity-50 px-2 bg-black/5 rounded-md">
                    {category.translations?.[0]?.name || "No English Name"}
                  </span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setAddingToParent(category.id)} className="p-1.5 hover:bg-black/10 rounded-md text-xs font-medium flex items-center gap-1" title="Add Subcategory">
                    <Plus size={14} /> Add Sub
                  </button>
                  <button onClick={() => setEditingId(category.id)} className="p-1.5 hover:bg-blue-500/10 text-blue-500 rounded-md" title="Edit">
                     <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(category.id)} className="p-1.5 hover:bg-red-500/10 text-red-500 rounded-md" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
            
            {/* Render children recursively */}
            {renderTree(category.id, depth + 1)}

            {/* Inline add subcategory form */}
            {addingToParent === category.id && (
              <div className="ml-8 mt-2">
                <CategoryForm parentId={category.id} />
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="w-full">
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6 font-medium text-sm">
          Error: {errorMsg}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-card-border/50">
        <h2 className="font-bold flex items-center gap-2">
          <Settings size={20} className="text-primary" /> Structure Tree
        </h2>
        {addingToParent !== 'root' && (
          <button 
            onClick={() => setAddingToParent('root')} 
            className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
          >
            <Plus size={16} /> New Root Category
          </button>
        )}
      </div>

      {addingToParent === 'root' && (
         <div className="mb-6"><CategoryForm parentId={null} /></div>
      )}

      {initialCategories.length === 0 && addingToParent !== 'root' && (
        <div className="text-center py-12 opacity-50 border-2 border-dashed border-card-border rounded-xl">
          <FolderTree size={48} className="mx-auto mb-4 opacity-30" />
          <p>No categories exist yet. Try creating a root category.</p>
        </div>
      )}

      <div className="category-tree-container">
        {renderTree(null, 0)}
      </div>
    </div>
  );
}
