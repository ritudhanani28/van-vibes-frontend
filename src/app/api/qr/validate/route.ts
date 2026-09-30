import { NextRequest, NextResponse } from 'next/server';
import { fetchFromBackend } from '@/lib/backend-api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tableId = searchParams.get('table') || '';
  const token = searchParams.get('token') || '';

  if (!tableId || !token) {
    return NextResponse.json(
      {
        valid: false,
        error: 'Missing table ID or QR security token. Please scan the official table QR code.',
      },
      { status: 400 }
    );
  }

  try {
    const [valRes, settingsRes] = await Promise.all([
      fetchFromBackend('/api/v1/tables/validate-qr', {
        method: 'POST',
        body: JSON.stringify({ tableId, token }),
      }),
      fetchFromBackend('/api/v1/settings'),
    ]);

    const valData = await valRes.json();
    if (!valRes.ok || !valData.valid || !valData.table) {
      return NextResponse.json(
        {
          valid: false,
          error: valData.message || 'Invalid or expired QR code.',
        },
        { status: 403 }
      );
    }

    const cafe = settingsRes.ok ? await settingsRes.json() : null;

    return NextResponse.json({
      valid: true,
      cafe,
      table: valData.table,
      message: 'QR code verified successfully',
    });
  } catch (err) {
    return NextResponse.json(
      { valid: false, error: err instanceof Error ? err.message : 'Backend unreachable' },
      { status: 503 }
    );
  }
}
