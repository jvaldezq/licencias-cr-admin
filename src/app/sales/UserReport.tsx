import * as React from "react";
import {getSession} from "@auth0/nextjs-auth0";
import {fetchUserInfo} from "@/components/Header/service";
import {getSalesByUserId} from "@/services/sales/getSalesByUserId";
import {CRCFormatter} from "@/lib/NumberFormats";
import {SalesTable} from "@/app/sales/SalesTable";
import {CreditCard, DollarSign, Wallet} from "lucide-react";
import {SalesFilter} from "@/app/sales/SalesFilter";

interface Props {
    date: string;
}

const UserReport = async (props: Props) => {
    const {date} = props;
    const session = await getSession();
    const user = await fetchUserInfo({userId: session?.user?.sub?.split('|')[1]});
    const selectedDate = date ? atob(date) : undefined;
    const data = await getSalesByUserId(user?.id, selectedDate);

    return (<section className="mt-4">
        <SalesFilter date={date}/>
        <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Wallet className="text-blue-600" size={24}/>
                    </div>
                    <span className="text-sm text-gray-500">SINPE</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{CRCFormatter(data?.totals?.byType?.SINPE || 0)}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-purple-50 rounded-lg">
                        <CreditCard className="text-purple-600" size={24}/>
                    </div>
                    <span className="text-sm text-gray-500">Tarjeta de crédito</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{CRCFormatter(data?.totals?.byType?.CARD || 0)}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-green-50 rounded-lg">
                        <DollarSign className="text-green-600" size={24}/>
                    </div>
                    <span className="text-sm text-gray-500">Efectivo</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{CRCFormatter(data?.totals?.byType?.CASH || 0)}</p>
            </div>

            <div className="mt-4 bg-white rounded-xl shadow-sm p-6 border border-gray-100 col-span-full">
                <div className="flex justify-between items-center">
                    <span className="text-gray-500">TOTAL</span>
                    <p className="text-3xl font-bold text-gray-800">{CRCFormatter(data?.totals?.overall)}</p>
                </div>
            </div>
        </div>
        <SalesTable data={data.data}/>
    </section>);
}

export default UserReport;