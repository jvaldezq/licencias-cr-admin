'use client';
import {ReactNode} from "react"
import {
    Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet"
import {IUser} from "@/lib/definitions";
import Link from "next/link";
import {usePathname} from 'next/navigation'
import {LocationsIcon} from "@/assets/icons/LocationsIcon";
import {CarIcon} from "@/assets/icons/CarIcon";
import {LicenseIcon} from "@/assets/icons/LicenseIcon";
import {CalendarIcon} from "@/assets/icons/CalendarIcon";


interface Props {
    trigger: ReactNode;
    user: IUser;
}

export const HeaderMenu = (props: Props) => {
    const {trigger, user} = props;
    const path = usePathname()
    const isSelected = 'bg-secondary text-white font-bold [&>svg>path]:fill-white';

    return <Sheet>
        <SheetTrigger className="rounded p-2 hover:bg-primary/[0.1]">{trigger}</SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
            <SheetHeader>
                <SheetTitle className="font-semibold text-base">Licencia Costa Rica</SheetTitle>
            </SheetHeader>
            <div className="grow flex flex-col gap-4">
                <SheetClose asChild>
                    <Link className={`text-sm flex gap-2 py-3 px-2 rounded text-primary hover:font-bold ${path === '/' && isSelected}`}
                          key="calendar" href="/">
                        <CalendarIcon/> Calendario
                    </Link>
                </SheetClose>
                {user?.access?.admin && <>
                    <p className="font-light text-xs pb-1 border-b border-primary/[0.2] text-primary/[0.7] border-solid">Administrador</p>
                    <SheetClose asChild>
                        <Link
                            className={`text-sm flex gap-2 py-3 px-2 rounded text-primary hover:font-bold ${path === '/locations' && isSelected}`}
                            key="assets" href="/locations">
                            <LocationsIcon/> Sedes
                        </Link>
                    </SheetClose>
                    <SheetClose asChild>
                        <Link
                            className={`text-sm flex gap-2 py-3 px-2 rounded text-primary hover:font-bold ${path === '/assets' && isSelected}`}
                            key="assets" href="/assets">
                            <CarIcon/> Vehículos
                        </Link>
                    </SheetClose>
                    <SheetClose asChild>
                        <Link
                            className={`text-sm flex gap-2 py-3 px-2 rounded text-primary hover:font-bold ${path === '/licenses' && isSelected}`}
                            key="licenses" href="/licenses">
                            <LicenseIcon/> Licencias (Tipos)
                        </Link>
                    </SheetClose>
                </>}
            </div>
            <SheetFooter>
                <Link className="font-light text-sm text-primary/[0.8] hover:text-primary" key="logout"
                      href="/api/auth/logout">
                    Logout
                </Link>
            </SheetFooter>
        </SheetContent>
    </Sheet>


};