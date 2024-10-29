import prisma from '@/lib/prisma';
import {NextRequest, NextResponse} from "next/server";
import {revalidatePath} from "next/cache";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
};

export async function GET(req: NextRequest, {params}: { params: { id: string } }) {
    try {
        const user = await prisma.user.findUnique({
            select: {
                id: true, name: true, access: {
                    select: {
                        id: true, instructor: true, receptionist: true
                    }
                }, location: {
                    select: {
                        id: true, name: true
                    }
                }
            }, where: {
                id: params.id
            }
        });
        return NextResponse.json(user, {status: 200});
    } catch (error) {
        console.log('Error fetching user', error);
        return NextResponse.json({error}, {status: 500});
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        await prisma.userAccess.update({
            where: {
                id: body.access.id
            }, data: {
                instructor: body.access.instructor, receptionist: body.access.receptionist
            }
        })
        const user = await prisma.user.update({
            where: {
                id: body.id
            }, data: {
                locationId: body.location.id,
            }
        });
        revalidatePath('/people', 'page')
        return NextResponse.json(user, {status: 200});
    } catch (error) {
        console.error('Updating user', error);
        return NextResponse.json({error}, {status: 500});
    }
}