import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: {
        hasPromo: true,
      },
      select: {
        id: true,
        customer: {
          select: {
            name: true,
            phone: true,
          },
        },
        asset: {
          select: {
            name: true,
          },
        },
        date: true,
        payment: {
          select: {
            price: true,
            cashAdvance: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Filter for paid events: hasPaid = (price - cashAdvance) <= 0
    const paidParticipants = events
      .filter((event) => {
        const price = event.payment?.price || 0;
        const cashAdvance = event.payment?.cashAdvance || 0;
        return price - cashAdvance <= 0;
      })
      .map((event) => ({
        id: event.id,
        customerName: event.customer.name,
        customerPhone: event.customer.phone,
        assetName: event.asset?.name || 'N/A',
        eventDate: event.date,
      }));

    return NextResponse.json(paidParticipants, { status: 200 });
  } catch (error) {
    console.error('Error fetching promo participants', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
