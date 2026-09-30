import { NextRequest, NextResponse } from 'next/server';
import { fetchFromBackend } from '@/lib/backend-api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tableId = searchParams.get('tableId');
  const sessionToken = searchParams.get('sessionToken') || '';
  const all = searchParams.get('all') === 'true';

  try {
    let endpoint = '/api/v1/orders';
    const params = new URLSearchParams();
    if (!all && sessionToken) {
      params.set('session_token', sessionToken);
    }
    if (tableId) {
      params.set('table_id', tableId);
    }
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }

    const res = await fetchFromBackend(endpoint);
    if (!res.ok) {
      return NextResponse.json({ orders: [] });
    }
    const orders = await res.json();
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ orders: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await fetchFromBackend('/api/v1/orders', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: data.detail || 'Failed to place order' },
        { status: res.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order created successfully!',
      order: data,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Invalid request payload';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
