import prisma from "@/lib/prisma";
import {IUser} from "@/lib/definitions";

export const fetchUsers = async (): Promise<IUser[]> => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                location: true,
                access: true,
            },
        });
        return users as IUser[];
    } catch (error) {
        console.error("Error fetching user", error);
        return [] as IUser[];
    }
};