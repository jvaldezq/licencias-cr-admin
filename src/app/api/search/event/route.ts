import { NextResponse } from 'next/server';
import { getSearchEvents } from '@/app/api/search/event/getSearchEvents';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    if (!search) {
      return NextResponse.json({ error: 'Invalid inputs' }, { status: 400 });
    }

    const events = await getSearchEvents(search);

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error('Error on search fetching', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
