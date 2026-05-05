const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Use AbortSignal to timeout requests after 5 seconds to prevent build hanging
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const errorData = await response.json().catch(() => ({}));
      console.error(`fetchAPI ERROR: URL: ${url} | STATUS: ${response.status} | ERROR:`, errorData);
      throw new Error(errorData.message || `API request failed: ${url} with status ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error(`fetchAPI FATAL: URL: ${url} | ERROR:`, error.message);
    throw error;
  }
}

// Product API layer
export async function getPublicProducts(locale: string, params?: { categorySlug?: string, isFeatured?: boolean }) {
  let url = `/products/public?locale=${locale}`;
  if (params?.categorySlug) url += `&categorySlug=${params.categorySlug}`;
  if (params?.isFeatured) url += `&isFeatured=true`;
  return fetchAPI(url, { next: { revalidate: 60 } });
}

export async function getPublicProductDetail(slug: string, locale: string) {
  return fetchAPI(`/products/public/${slug}?locale=${locale}`, { next: { revalidate: 60 } });
}

export async function getPublicCategories(locale: string) {
  return fetchAPI(`/categories/public?locale=${locale}`, { cache: 'no-store' });
}

// Blog API Layer
export async function getPublicPosts(locale: string) {
  return fetchAPI(`/blog/public/posts?locale=${locale}`, { next: { revalidate: 3600 } });
}

export async function getPublicPostDetail(slug: string, locale: string) {
  return fetchAPI(`/blog/public/posts/${slug}?locale=${locale}`, { next: { revalidate: 3600 } });
}

// Static Pages API Layer
export async function getPublicPage(slug: string, locale: string) {
  return fetchAPI(`/pages/public/${slug}?locale=${locale}`, { next: { revalidate: 3600 * 24 } });
}

// Inquiry Form Post
export async function postContactInquiry(data: any) {
  return fetchAPI(`/inquiries/public/contact`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function postQuoteInquiry(data: any) {
  return fetchAPI(`/inquiries/public/quote`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// FAQ API Layer
export async function getPublicFaqs(locale: string) {
  return fetchAPI(`/faq/public?locale=${locale}`, { next: { revalidate: 60 } }); // Revalidate 60s for updated vote ranks
}

export async function voteFaq(id: string, voteType: 'UP' | 'DOWN') {
  return fetchAPI(`/faq/public/${id}/vote`, {
    method: 'POST',
    body: JSON.stringify({ voteType })
  });
}

// Promotions API Layer
export async function getPublicPromotion(slug: string) {
  // Using cache: 'no-store' to ensure the server dynamically increments viewCount accurately every hit
  return fetchAPI(`/promotions/public/${slug}`, { cache: 'no-store' });
}

export async function getPublicSlides(locale: string) {
  return fetchAPI(`/slides/public?locale=${locale}`, { next: { revalidate: 3600 } });
}

export async function getPublicAdvantages(locale: string) {
  // Use cache: no-store to ensure updates are visible to visitors
  return fetchAPI(`/advantages/public?locale=${locale}`, { cache: 'no-store' });
}

// Navigation API Layer
export async function getPublicNavigation(key: string, locale: string) {
  const url = `/navigations/public/${key}?locale=${locale}`;
  return fetchAPI(url, { next: { revalidate: 60 } });
}

export async function getAdminNavigations() {
  const { cookies } = await import('next/headers');
  const token = (await cookies()).get('admin_token')?.value;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_BASE_URL}/navigations/admin`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch navigations');
  return res.json();
}
