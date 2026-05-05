'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function loginAdmin(prevState: any, formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`LOGIN HTTP ERROR: ${res.status} - ${errorText}`);
      if (res.status === 401) return { error: 'Invalid credentials.' };
      return { error: `Authentication failed (Status ${res.status}): ${errorText}` };
    }

    const data = await res.json();
    if (data.access_token) {
      const cookieStore = await cookies();
      cookieStore.set('admin_token', data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });
      return { success: true };
    }
    
    return { error: 'No token received.' };
  } catch (error: any) {
    console.error(`LOGIN FETCH ERROR details:`, {
      url: `${API_BASE_URL}/auth/login`,
      errorMessage: error.message,
      errorCause: error.cause,
    });
    return { error: `Failed to connect: ${error.message} (${API_BASE_URL})` };
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
}

export async function updateLeadStatus(leadId: string, newStatus: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) throw new Error('Unauthorized');

  await fetch(`${API_BASE_URL}/admin/crm/leads/${leadId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status: newStatus })
  });
}

export async function postLeadNote(leadId: string, formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) throw new Error('Unauthorized');

  const notes = formData.get('notes');
  if (!notes) return;

  await fetch(`${API_BASE_URL}/admin/crm/leads/${leadId}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ notes })
  });
}

export async function getDashboardStats() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    next: { revalidate: 60 } // cache for 60 seconds
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error('Unauthorized');
    throw new Error('Failed to fetch dashboard stats');
  }

  return res.json();
}

export async function createCategory(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) throw new Error('Unauthorized');

  const payload = {
    slug: formData.get('slug'),
    nameEn: formData.get('nameEn') || undefined,
    parentId: formData.get('parentId') || null,
    description: formData.get('description') || undefined,
    coverMediaId: formData.get('coverMediaId') || undefined,
  };

  const res = await fetch(`${API_BASE_URL}/categories/admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to create category');
  }
}

export async function updateCategory(id: string, formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) throw new Error('Unauthorized');

  const payload = {
    slug: formData.get('slug'),
    nameEn: formData.get('nameEn') || undefined,
    parentId: formData.get('parentId') || null,
    description: formData.get('description') || undefined,
    coverMediaId: formData.get('coverMediaId') || undefined,
  };

  const res = await fetch(`${API_BASE_URL}/categories/admin/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to update category');
  }
}

export async function deleteCategory(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_BASE_URL}/categories/admin/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to delete category');
  }
}

export async function createProduct(payload: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_BASE_URL}/products/admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to create product');
  }
  
  revalidatePath('/admin/products');
}

export async function updateProduct(id: string, payload: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_BASE_URL}/products/admin/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to update product');
  }
  
  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${id}`);
}

export async function uploadMediaFile(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_BASE_URL}/media/admin/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to upload media');
  }

  return res.json();
}

export async function saveJobPosting(id: string | null, payload: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) throw new Error('Unauthorized');

  const url = id
    ? `${API_BASE_URL}/recruitment/admin/postings/${id}`
    : `${API_BASE_URL}/recruitment/admin/postings`;

  const res = await fetch(url, {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to save job posting');
  }

  revalidatePath('/admin/recruitment');
  return res.json();
}

export async function saveStaticPage(id: string | null, payload: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) throw new Error('Unauthorized');

  const url = id
    ? `${API_BASE_URL}/pages/admin/${id}`
    : `${API_BASE_URL}/pages/admin`;

  const res = await fetch(url, {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to save page');
  }

  revalidatePath('/admin/pages');
  return res.json();
}

export async function createSlide(payload: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_BASE_URL}/slides/admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to create slide');
  }

  revalidatePath('/admin/slides');
  revalidatePath('/', 'layout');
}

export async function updateSlide(id: string, payload: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_BASE_URL}/slides/admin/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to update slide');
  }

  revalidatePath('/admin/slides');
  revalidatePath('/', 'layout');
}

export async function deleteSlide(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_BASE_URL}/slides/admin/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to delete slide');
  }

  revalidatePath('/admin/slides');
  revalidatePath('/', 'layout');
}


// Advantage Actions
export async function createAdvantage(payload: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_BASE_URL}/advantages/admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to create advantage');
  }

  revalidatePath('/admin/advantages');
  revalidatePath('/', 'layout');
}

export async function updateAdvantage(id: string, payload: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_BASE_URL}/advantages/admin/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to update advantage');
  }

  revalidatePath('/admin/advantages');
  revalidatePath('/', 'layout');
}

export async function deleteAdvantage(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_BASE_URL}/advantages/admin/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to delete advantage');
  }

  revalidatePath('/admin/advantages');
  revalidatePath('/', 'layout');
}

export async function updateAdvantageSort(ids: string[]) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_BASE_URL}/advantages/admin/sort`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ ids })
  });

  if (!res.ok) {
    throw new Error('Failed to update advantage sort order');
  }

  revalidatePath('/admin/advantages');
  revalidatePath('/', 'layout');
}

export async function saveNavigationMenu(key: string, items: any[]) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_BASE_URL}/navigations/admin/${key}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ items })
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to save navigation menu');
  }

  revalidatePath('/admin/navigation');
  revalidatePath('/', 'layout');
}

// Blog Actions
export async function saveBlogPost(id: string | null, payload: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) throw new Error('Unauthorized');

  const url = id
    ? `${API_BASE_URL}/blog/admin/posts/${id}`
    : `${API_BASE_URL}/blog/admin/posts`;

  const res = await fetch(url, {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    console.error('SAVE_BLOG_POST_ERROR:', data);
    throw new Error(data.message || 'Failed to save blog post');
  }

  revalidatePath('/admin/blog');
  revalidatePath('/', 'layout');
  return res.json();
}

export async function deleteBlogPost(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_BASE_URL}/blog/admin/posts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to delete blog post');
  }

  revalidatePath('/admin/blog');
  revalidatePath('/', 'layout');
}
