import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { updateClass } from '@/services/events/eventClass';
import { updateTest } from '@/services/events/eventTest';
import { eventDelete } from '@/services/events/eventDelete';
import { CLASS_TYPE } from '@/lib/definitions';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const event = await prisma.event.findUnique({
      select: {
        id: true,
        type: true,
        typeId: true,
        notes: true,
        customer: {
          select: {
            id: true,
            name: true,
            identification: true,
            phone: true,
            schedule: true,
            testPassed: true,
          },
        },
        location: true,
        locationId: true,
        licenseType: true,
        licenseTypeId: true,
        date: true,
        time: true,
        instructor: true,
        instructorId: true,
        asset: true,
        assetId: true,
        createdById: true,
        payment: {
          select: {
            id: true,
            price: true,
            cashAdvance: true,
            paid: true,
            paidDate: true,
            cashPaymentsAdvance: true,
          },
        },
        hasMedical: true,
        isInternalReferred: true,
        isExternalReferred: true,
      },
      where: {
        id: params.id,
      },
    });
    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error('Error fetching event', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();

    if (
      !body ||
      !body.customer ||
      !body.payment ||
      !body.createdById ||
      !body.date ||
      !body.locationId
    ) {
      return NextResponse.json({ error: 'Invalid inputs' }, { status: 400 });
    }

    let res;
    if (body?.typeId === CLASS_TYPE.CLASS) {
      res = await updateClass(params.id, body);
    } else {
      res = await updateTest(params.id, body);
    }

    revalidatePath('/events', 'page');
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error('Updating event', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  try {
    const res = await eventDelete(params.id);

    revalidatePath('/events', 'page');
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error('Completing event', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
