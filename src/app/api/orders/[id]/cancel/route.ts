import { NextRequest, NextResponse } from 'next/server';
import { fetchFromBackend } from '@/lib/backend-api';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    let reason = 'Customer requested cancellation';
    try {
      const body = await request.json();
      if (body?.reason) reason = body.reason;
    } catch {
      // body is optional
    }

    const res = await fetchFromBackend(`/api/v1/orders/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.message || data.detail || 'Cannot cancel this order.',
        },
        { status: res.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message || `Order ${id} has been cancelled`,
      order: data.order,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Backend unreachable',
      },
      { status: 500 }
    );
  }
}
