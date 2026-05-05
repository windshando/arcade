'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill so it doesn't crash on the Next.js Server Side Rendering (SSR)
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <p className="p-4 text-sm opacity-50">Loading editor...</p>,
});

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'video'],
    ['clean']
  ],
};

export default function RichTextEditor({ name, placeholder = "", defaultValue = "" }: { name: string, placeholder?: string, defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="bg-background rounded-lg text-foreground">
      {/* Hidden input securely captures the rich HTML output for the standard FormData submission */}
      <input type="hidden" name={name} value={value} />
      <div className="rounded-lg overflow-hidden border border-card-border">
        <ReactQuill 
          theme="snow" 
          value={value} 
          onChange={setValue} 
          modules={modules}
          placeholder={placeholder}
          className="h-48 pb-10" 
        />
      </div>
    </div>
  );
}
