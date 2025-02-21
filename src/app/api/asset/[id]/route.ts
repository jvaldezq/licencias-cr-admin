import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { logEvent } from '@/services/logs/logEvent';
import { LOG_TITLES } from '@/lib/definitions';

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
    const asset = await prisma.asset.findUnique({
      where: {
        id: params.id,
      },
    });
    return NextResponse.json(asset, { status: 200 });
  } catch (error) {
    console.error('Error fetching asset', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const asset = await prisma.asset.delete({
      select: {
        id: true,
        name: true,
        plate: true,
        status: true,
        location: {
          select: {
            name: true,
          },
        },
        licenseType: {
          select: {
            name: true,
          },
        },
      },
      where: {
        id: params.id,
      },
    });

    await logEvent({
      title: LOG_TITLES.DELETED,
      message: JSON.stringify(asset),
      assetId: asset.id,
    });
    revalidatePath('/assets', 'page');
    return NextResponse.json(asset, { status: 200 });
  } catch (error) {
    console.error('Error deleting asset', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
