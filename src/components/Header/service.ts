import prisma from "@/lib/prisma";
import {IUser} from "@/lib/definitions";

interface SearchParamsProps {
    userId: string;
}

export const fetchUserInfo = async (searchParams: SearchParamsProps): Promise<IUser> => {
    try {
        const { userId } = searchParams;

        if (!userId) {
            return {} as IUser;
        }

        const user = await prisma.user.findFirst({
            select: {
                id: true,
                name: true,
                location: true,
                access: true,
            },
            where: {
                authId: {
                    equals: userId,
                },
            },
        });

        return user as IUser;
    } catch (error) {
        console.error("Error fetching user info:", error);
        return {} as IUser;
    }
};