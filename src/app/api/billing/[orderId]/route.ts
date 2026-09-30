import { NextRequest, NextResponse } from 'next/server';
import { fetchFromBackend } from '@/lib/backend-api';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await context.params;
  try {
    const res = await fetchFromBackend(`/api/v1/billing/${orderId}`);
    if (!res.ok) {
      return NextResponse.json({ error: 'Bill not found for order' }, { status: 404 });
    }
    const bill = await res.json();
    return NextResponse.json({ bill });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Backend unreachable' },
      { status: 503 }
    );
  }
}
