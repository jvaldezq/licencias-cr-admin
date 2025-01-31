import { NextResponse } from 'next/server';
import { getLogs } from '@/services/logs/getLogs';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId') || undefined;
    const assetId = searchParams.get('assetId') || undefined;

    const logs = await getLogs({ eventId, assetId });
    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    console.error('Error fetching logs', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
