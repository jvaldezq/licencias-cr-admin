import * as React from "react";
import {getSession} from "@auth0/nextjs-auth0";
import {fetchUserInfo} from "@/components/Header/service";
import {getSalesByUserId} from "@/services/sales/getSalesByUserId";
import {CRCFormatter} from "@/lib/NumberFormats";
import {SalesTable} from "@/app/sales/SalesTable";

const UserReport = async () => {
    const session = await getSession();
    const user = await fetchUserInfo({userId: session?.user?.sub?.split('|')[1]});
    const data = await getSalesByUserId(user?.id);

    return (<section className="mt-4">
        <div className="grid gap-4 md:grid-cols-3">
            <div
                className="flex flex-col justify-center items-center gap-2 border border-primary/[0.3] border-solid rounded-xl py-4 px-2">
                <p className="text-lg font-bold text-success animate-fade-left animate-once animate-duration-500 animate-delay-0 animate-ease-in">{CRCFormatter(data?.totals?.byType?.SINPE)}</p>
                <h3 className="font-semibold text-sm text-primary/[0.9]">SINPE</h3>
            </div>
            <div
                className="flex flex-col justify-center items-center gap-2 border border-primary/[0.3] border-solid rounded-xl py-4 px-2">
                <p className="text-lg font-bold text-success animate-fade-left animate-once animate-duration-500 animate-delay-300 animate-ease-in">{CRCFormatter(data?.totals?.byType?.CARD)}</p>
                <h3 className="font-semibold text-sm text-primary/[0.9]">Tarjeta de crédito</h3>
            </div>
            <div
                className="flex flex-col justify-center items-center gap-2 border border-primary/[0.3] border-solid rounded-xl py-4 px-2">
                <p className="text-lg font-bold text-success animate-fade-left animate-once animate-duration-500 animate-delay-500 animate-ease-in">{CRCFormatter(data?.totals?.byType?.CASH)}</p>
                <h3 className="font-semibold text-sm text-primary/[0.9]">Efectivo</h3>
            </div>
            <div
                className="flex flex-col justify-center items-center gap-2 border border-primary/[0.8] border-solid rounded-xl py-4 px-2 md:col-start-2">
                <p className="text-lg font-bold text-success animate-fade-left animate-once animate-duration-500 animate-delay-500 animate-ease-in">{CRCFormatter(data?.totals?.overall)}</p>
                <h3 className="font-bold text-sm text-primary/[0.9]">TOTAL</h3>
            </div>
        </div>
        <SalesTable data={data.data} />
    </section>);
}

export default UserReport;