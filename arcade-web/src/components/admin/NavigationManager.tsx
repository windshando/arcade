'use client';

import React, { useState, useCallback } from 'react';
import { saveNavigationMenu } from '@/app/actions';
import { ChevronUp, ChevronDown, Plus, Trash2, Link as LinkIcon, Settings2 } from 'lucide-react';

// Extracted OUTSIDE the parent component so React preserves identity across renders
function RenderNode({ 
  node, 
  isChild = false, 
  onUpdate, 
  onMoveUp, 
  onMoveDown, 
  onAddChild, 
  onRemove 
}: { 
  node: any; 
  isChild?: boolean; 
  onUpdate: (id: string, field: string, value: any, locale?: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onAddChild: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const labelEn = node.translations?.find((t: any) => t.locale === 'EN')?.label || '';
  const labelZh = node.translations?.find((t: any) => t.locale === 'ZH_CN')?.label || '';

  return (
    <div className={`p-4 rounded-xl border border-card-border mb-3 ${isChild ? 'bg-card-bg/30 ml-8' : 'bg-card-bg/70'}`}>
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex flex-col gap-1 w-full md:w-auto flex-1">
          <div className="flex gap-2">
            <input 
              type="text" 
              defaultValue={labelEn}
              onBlur={e => onUpdate(node.id, 'label', e.target.value, 'EN')}
              onChange={e => onUpdate(node.id, 'label', e.target.value, 'EN')}
              placeholder="English Label" 
              className="bg-background border border-card-border px-3 py-2 rounded-md text-sm flex-1 focus:ring-1 focus:ring-primary"
            />
            <input 
              type="text" 
              defaultValue={labelZh}
              onBlur={e => onUpdate(node.id, 'label', e.target.value, 'ZH_CN')}
              onChange={e => onUpdate(node.id, 'label', e.target.value, 'ZH_CN')}
              placeholder="中文名称" 
              className="bg-background border border-card-border px-3 py-2 rounded-md text-sm flex-1 focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2 items-center">
            <LinkIcon size={16} className="text-gray-500 shrink-0" />
            <input 
              type="text" 
              defaultValue={node.url}
              onBlur={e => onUpdate(node.id, 'url', e.target.value)}
              onChange={e => onUpdate(node.id, 'url', e.target.value)}
              placeholder="/path or https://..." 
              className="bg-background border border-card-border px-3 py-1.5 rounded-md text-sm w-full font-mono text-primary/80"
            />
            <label className="flex items-center gap-2 text-xs shrink-0 pl-2">
              <input type="checkbox" checked={node.isExternal} onChange={e => onUpdate(node.id, 'isExternal', e.target.checked)} className="accent-primary" />
              New Tab
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => onMoveUp(node.id)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"><ChevronUp size={18} /></button>
          <button onClick={() => onMoveDown(node.id)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"><ChevronDown size={18} /></button>
          {!isChild && (
            <button onClick={() => onAddChild(node.id)} className="p-2 hover:bg-primary/20 rounded-lg text-primary tooltip" title="Add Sub-link">
              <Plus size={18} />
            </button>
          )}
          <button onClick={() => onRemove(node.id)} className="p-2 hover:bg-red-500/20 rounded-lg text-red-500"><Trash2 size={18} /></button>
        </div>
      </div>

      {/* Children Render */}
      {node.children && node.children.length > 0 && (
        <div className="mt-4 pt-4 border-t border-card-border/50">
          {node.children.map((child: any) => (
             <RenderNode 
               key={child.id} 
               node={child} 
               isChild={true} 
               onUpdate={onUpdate}
               onMoveUp={onMoveUp}
               onMoveDown={onMoveDown}
               onAddChild={onAddChild}
               onRemove={onRemove}
             />
          ))}
        </div>
      )}
    </div>
  );
}

export default function NavigationManager({ initialMenus }: { initialMenus: any[] }) {
  const [activeMenuKey, setActiveMenuKey] = useState<string>('main-nav');
  const [isSaving, setIsSaving] = useState(false);
  
  const defaultItems = initialMenus?.find((m: any) => m.key === activeMenuKey)?.items || [];
  
  const buildTree = (items: any[]) => {
    const map = new Map();
    items.forEach(i => map.set(i.id, { ...i, children: [], translations: i.translations || [] }));
    const tree: any[] = [];
    items.forEach(i => {
      if (i.parentId) {
        map.get(i.parentId)?.children.push(map.get(i.id));
      } else {
        tree.push(map.get(i.id));
      }
    });
    return tree;
  };

  // Use a ref-based tree to avoid re-renders on every keystroke
  const [tree, setTree] = useState<any[]>(buildTree(defaultItems));

  const handleTabClick = (key: string) => {
    setActiveMenuKey(key);
    setTree(buildTree(initialMenus?.find((m: any) => m.key === key)?.items || []));
  };

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const addRootItem = () => {
    setTree(prev => [...prev, { 
      id: generateId(), 
      url: '/', 
      isExternal: false, 
      translations: [{ locale: 'EN', label: 'New Link' }],
      children: [] 
    }]);
  };

  const addChildItem = useCallback((parentId: string) => {
    const traverseAndAdd = (nodes: any[]): any[] => {
      return nodes.map(node => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [...(node.children || []), {
              id: Math.random().toString(36).substring(2, 9),
              url: '/',
              isExternal: false,
              translations: [{ locale: 'EN', label: 'Sub Link' }],
              children: []
            }]
          };
        }
        if (node.children) {
          return { ...node, children: traverseAndAdd(node.children) };
        }
        return node;
      });
    };
    setTree(prev => traverseAndAdd(prev));
  }, []);

  const removeItem = useCallback((id: string) => {
    const traverseAndFilter = (nodes: any[]): any[] => {
      return nodes.filter(n => n.id !== id).map(n => ({
        ...n,
        children: n.children ? traverseAndFilter(n.children) : []
      }));
    };
    setTree(prev => traverseAndFilter(prev));
  }, []);

  // Use a mutable update to avoid full tree recreation on every keystroke
  const updateItem = useCallback((id: string, field: string, value: any, locale: string = 'EN') => {
    setTree(prev => {
      const traverseAndUpdate = (nodes: any[]): any[] => {
        return nodes.map(node => {
          if (node.id === id) {
            if (field === 'label') {
              const trans = [...node.translations];
              const idx = trans.findIndex((t: any) => t.locale === locale);
              if (idx >= 0) trans[idx] = { ...trans[idx], label: value };
              else trans.push({ locale, label: value });
              return { ...node, translations: trans };
            }
            return { ...node, [field]: value };
          }
          if (node.children) {
            return { ...node, children: traverseAndUpdate(node.children) };
          }
          return node;
        });
      };
      return traverseAndUpdate(prev);
    });
  }, []);

  const moveUp = useCallback((id: string) => {
    const traverseAndMove = (nodes: any[]): any[] => {
      const idx = nodes.findIndex(n => n.id === id);
      if (idx > 0) {
         const newNodes = [...nodes];
         [newNodes[idx - 1], newNodes[idx]] = [newNodes[idx], newNodes[idx - 1]];
         return newNodes;
      }
      return nodes.map(n => ({ ...n, children: n.children ? traverseAndMove(n.children) : [] }));
    };
    setTree(prev => traverseAndMove(prev));
  }, []);

  const moveDown = useCallback((id: string) => {
    const traverseAndMove = (nodes: any[]): any[] => {
      const idx = nodes.findIndex(n => n.id === id);
      if (idx >= 0 && idx < nodes.length - 1) {
         const newNodes = [...nodes];
         [newNodes[idx], newNodes[idx + 1]] = [newNodes[idx + 1], newNodes[idx]];
         return newNodes;
      }
      return nodes.map(n => ({ ...n, children: n.children ? traverseAndMove(n.children) : [] }));
    };
    setTree(prev => traverseAndMove(prev));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const flatList: any[] = [];
      const flatten = (nodes: any[]) => {
        nodes.forEach(n => {
          flatList.push({
            url: n.url,
            isExternal: n.isExternal,
            labelEn: n.translations?.find((t:any) => t.locale === 'EN')?.label,
            labelZh: n.translations?.find((t:any) => t.locale === 'ZH_CN')?.label,
            children: n.children?.map((c:any) => ({
                url: c.url,
                isExternal: c.isExternal,
                labelEn: c.translations?.find((t:any) => t.locale === 'EN')?.label,
                labelZh: c.translations?.find((t:any) => t.locale === 'ZH_CN')?.label,
            })) || []
          });
        });
      };
      
      flatten(tree);

      await saveNavigationMenu(activeMenuKey, flatList);
      alert('Navigation saved perfectly!');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-card-bg border border-card-border rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-background p-4 border-b border-card-border flex gap-2">
        <button 
          onClick={() => handleTabClick('main-nav')} 
          className={`px-6 py-2.5 rounded-xl text-sm font-bold tracking-widest uppercase transition-all ${activeMenuKey === 'main-nav' ? 'bg-primary text-black shadow-[0_0_15px_rgba(var(--primary),0.5)]' : 'hover:bg-white/5 text-gray-400'}`}
        >
          Main Header
        </button>
        <button 
          onClick={() => handleTabClick('footer-nav')} 
          className={`px-6 py-2.5 rounded-xl text-sm font-bold tracking-widest uppercase transition-all ${activeMenuKey === 'footer-nav' ? 'bg-primary text-black shadow-[0_0_15px_rgba(var(--primary),0.5)]' : 'hover:bg-white/5 text-gray-400'}`}
        >
          Footer Links
        </button>
      </div>

      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white mb-1"><Settings2 className="inline mr-2 text-primary" size={24}/> {activeMenuKey === 'main-nav' ? 'Header' : 'Footer'} Configuration</h2>
            <p className="text-sm text-gray-400">Rearrange and edit the primary navigation links of your ecosystem.</p>
          </div>
          <button onClick={addRootItem} className="btn-primary px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
            <Plus size={16} /> Add Link
          </button>
        </div>

        <div className="space-y-4 min-h-[300px]">
          {tree.length === 0 ? (
            <div className="text-center py-12 text-gray-500 font-bold tracking-widest border-2 border-dashed border-card-border rounded-xl">
              NO LINKS CONFIGURED
            </div>
          ) : (
            tree.map(node => (
              <RenderNode 
                key={node.id} 
                node={node} 
                onUpdate={updateItem}
                onMoveUp={moveUp}
                onMoveDown={moveDown}
                onAddChild={addChildItem}
                onRemove={removeItem}
              />
            ))
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-card-border float-end">
          <button 
            disabled={isSaving}
            onClick={handleSave}
            className="btn-primary px-12 py-3 rounded-xl font-bold tracking-widest shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:scale-105 transition-transform"
          >
            {isSaving ? 'SAVING DATA...' : 'DEPLOY NAVIGATION'}
          </button>
        </div>
      </div>
    </div>
  );
}
