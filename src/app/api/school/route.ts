import {NextResponse} from 'next/server';
import prisma from '@/lib/prisma';
import {revalidatePath} from "next/cache";
import {createSchool} from "@/services/schools/createSchool";
import {updateSchool} from "@/services/schools/updateSchool";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const school = await createSchool(body);
        revalidatePath('/schools', 'page')
        return NextResponse.json(school, {status: 200});
    } catch (error) {
        console.error('Creating school', error);
        return NextResponse.json({error}, {status: 500});
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const school = updateSchool(body.id, body);
        revalidatePath('/schools', 'page')
        return NextResponse.json(school, {status: 200});
    } catch (error) {
        console.error('Updating school', error);
        return NextResponse.json({error}, {status: 500});
    }
}