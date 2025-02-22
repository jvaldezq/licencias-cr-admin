import prisma from '@/lib/prisma';

export const getSearchEvents = async (search: string) => {
  return await prisma.event.findMany({
    select: {
      id: true,
      status: true,
      date: true,
      noShow: true,
      hasBeenContacted: true,
      hasMedical: true,
      customer: {
        select: {
          name: true,
          identification: true,
          phone: true,
          testPassed: true,
        },
      },
      payment: true,
    },
    orderBy: {
      date: 'desc',
    },
    where: {
      OR: [
        {
          notes: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          customer: {
            OR: [
              {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                identification: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                phone: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ],
          },
        },
      ],
    },
  });
};
