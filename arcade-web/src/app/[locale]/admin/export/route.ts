import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  if (!['leads', 'customers', 'products'].includes(type as string)) {
    return new NextResponse('Invalid export type', { status: 400 });
  }

  try {
    const url = `${API_BASE_URL}/export/admin/${type}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('NestJS CSV Export Error:', response.status, errText);
      throw new Error(`Backend failed to build CSV: [${response.status}] ${errText}`);
    }

    const csvData = await response.text();

    return new NextResponse(csvData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="arcade_${type}_${Date.now()}.csv"`
      }
    });
  } catch (e: any) {
    return new NextResponse(e.message || 'Export error', { status: 500 });
  }
}
