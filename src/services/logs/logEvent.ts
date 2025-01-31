import prisma from '@/lib/prisma';
import { getSession } from '@auth0/nextjs-auth0';

interface Props {
  title: string;
  message: string;
  assetId?: string;
  eventId?: string;
}
export async function logEvent(props: Props) {
  try {
    const session = await getSession();
    const userId = session?.user?.sub?.split('|')[1];
    const user = await prisma.user.findUnique({
      where: {
        authId: userId,
      },
      select: {
        id: true,
      },
    });
    await prisma.log.create({
      data: {
        ...props,
        changedById: user?.id || '',
      },
    });
  } catch (error) {
    console.error('Error logging event:', error);
  }
}
