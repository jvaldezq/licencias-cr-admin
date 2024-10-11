import {IEventForm} from "@/lib/definitions";

export const createTest = async (data: IEventForm) => {
    console.log('createTest', data);
    return "CREATE_TEST";
}