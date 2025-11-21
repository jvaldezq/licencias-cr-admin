import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { randomBytes } from 'crypto';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

export async function POST() {
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
        payment: {
          select: {
            price: true,
            cashAdvance: true,
          },
        },
      },
    });

    // Filter for paid events: hasPaid = (price - cashAdvance) <= 0
    const paidParticipants = events.filter((event) => {
      const price = event.payment?.price || 0;
      const cashAdvance = event.payment?.cashAdvance || 0;
      return price - cashAdvance <= 0;
    });

    if (paidParticipants.length === 0) {
      return NextResponse.json(
        { error: 'No hay participantes elegibles para el sorteo' },
        { status: 400 }
      );
    }

    // Use cryptographically secure random selection
    const randomIndex = Math.floor(
      (randomBytes(4).readUInt32BE(0) / 0xffffffff) * paidParticipants.length
    );

    const winner = paidParticipants[randomIndex];

    const result = {
      id: winner.id,
      customerName: winner.customer.name,
      customerPhone: winner.customer.phone,
      assetName: winner.asset?.name || 'N/A',
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error generating raffle', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
