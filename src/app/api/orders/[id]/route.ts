import { NextRequest, NextResponse } from 'next/server';
import { fetchFromBackend } from '@/lib/backend-api';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const res = await fetchFromBackend(`/api/v1/orders/${id}`);
    if (!res.ok) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    const order = await res.json();
    return NextResponse.json({ order });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Backend unreachable' },
      { status: 503 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const res = await fetchFromBackend(`/api/v1/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: data.detail || 'Failed to update order status' },
        { status: res.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Order ${id} status updated to ${status}`,
      order: data,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update order' },
      { status: 500 }
    );
  }
}
