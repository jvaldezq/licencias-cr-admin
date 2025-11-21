'use client';
import { ReactNode } from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { IUser } from '@/lib/definitions';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LocationsIcon } from '@/assets/icons/LocationsIcon';
import { CarIcon } from '@/assets/icons/CarIcon';
import { LicenseIcon } from '@/assets/icons/LicenseIcon';
import { CalendarIcon } from '@/assets/icons/CalendarIcon';
import { PeopleIcon } from '@/assets/icons/PeopleIcon';
import { SalesIcon } from '@/assets/icons/SalesIcon';
import { Banknote, Contact, Video, Gift } from 'lucide-react';

interface Props {
  trigger: ReactNode;
  user: IUser;
}

export const HeaderMenu = (props: Props) => {
  const { trigger, user } = props;
  const path = usePathname();
  const isSelected =
    'bg-secondary text-white font-bold [&>svg>path]:fill-white [&>svg>g]:stroke-white';

  return (
    <Sheet aria-describedby="Header menu">
      <SheetTrigger
        className="rounded p-2 hover:bg-primary/[0.1]"
        aria-describedby="trigger"
      >
        {trigger}
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex flex-col"
        aria-describedby="Main Menu"
      >
        <SheetHeader>
          <SheetTitle
            className="font-semibold text-base"
            aria-describedby="Licencia Costa Rica"
          >
            Licencia Costa Rica
          </SheetTitle>
        </SheetHeader>
        <div className="grow flex flex-col gap-4">
          <SheetClose asChild aria-describedby="Citas">
            <Link
              className={`text-sm flex gap-2 py-3 px-2 rounded text-primary hover:font-bold items-center ${path === '/events' && isSelected}`}
              key="calendar"
              href="/events"
            >
              <CalendarIcon /> Pruebas prácticas / clases
            </Link>
          </SheetClose>
          {(user?.access?.admin || user?.access?.receptionist) && (
            <SheetClose asChild aria-describedby="Citas">
              <Link
                className={`text-sm flex gap-2 py-3 px-2 rounded text-primary hover:font-bold items-center ${path === '/sales' && isSelected}`}
                key="calendar"
                href="/sales"
              >
                <SalesIcon />
                Reporte Ventas
              </Link>
            </SheetClose>
          )}
          <SheetClose asChild aria-describedby="Vehículos">
            <Link
              className={`text-sm flex gap-2 py-3 px-2 rounded text-primary hover:font-bold items-center ${path === '/assets' && isSelected}`}
              key="assets"
              href="/assets"
            >
              <CarIcon /> Vehículos
            </Link>
          </SheetClose>

          {(user?.access?.admin || user?.access?.receptionist) && (
            <SheetClose asChild aria-describedby="Price">
              <Link
                className={`text-sm flex gap-2 py-3 px-2 rounded text-primary hover:font-bold items-center ${path === '/prices' && isSelected}`}
                key="price"
                href="/prices"
              >
                <Banknote />
                Precios
              </Link>
            </SheetClose>
          )}

          <SheetClose asChild aria-describedby="Videos">
            <Link
              className={`text-sm flex gap-2 py-3 px-2 rounded text-primary hover:font-bold items-center ${path === '/videos' && isSelected}`}
              key="calendar"
              href="/videos"
            >
              <Video /> Videos
            </Link>
          </SheetClose>

          <SheetClose asChild aria-describedby="Proveedores">
            <Link
              className={`text-sm flex gap-2 py-3 px-2 rounded text-primary hover:font-bold items-center ${path === '/suppliers' && isSelected}`}
              key="calendar"
              href="/suppliers"
            >
              <Contact /> Proveedores
            </Link>
          </SheetClose>

          {user?.access?.admin && (
            <>
              <p className="font-light text-xs pb-1 border-b border-primary/[0.2] text-primary/[0.7] border-solid">
                Administrador
              </p>
              <SheetClose asChild aria-describedby="Promo Navideña">
                <Link
                  className={`text-sm flex gap-2 py-3 px-2 rounded text-primary hover:font-bold items-center ${path === '/promo-navidena' && isSelected}`}
                  key="promo-navidena"
                  href="/promo-navidena"
                >
                  <Gift className="text-amber-600" /> Promo Navideña
                </Link>
              </SheetClose>

              <SheetClose asChild aria-describedby="Sedes">
                <Link
                  className={`text-sm flex gap-2 py-3 px-2 rounded text-primary hover:font-bold items-center ${path === '/locations' && isSelected}`}
                  key="assets"
                  href="/locations"
                >
                  <LocationsIcon /> Sedes
                </Link>
              </SheetClose>

              <SheetClose asChild aria-describedby="Licencias (Tipos)">
                <Link
                  className={`text-sm flex gap-2 py-3 px-2 rounded text-primary hover:font-bold items-center ${path === '/licenses' && isSelected}`}
                  key="licenses"
                  href="/licenses"
                >
                  <LicenseIcon /> Licencias (Tipos)
                </Link>
              </SheetClose>
              <SheetClose asChild aria-describedby="Planilla">
                <Link
                  className={`text-sm flex gap-2 py-3 px-2 rounded text-primary hover:font-bold items-center ${path === '/people' && isSelected}`}
                  key="people"
                  href="/people"
                >
                  <PeopleIcon /> Planilla
                </Link>
              </SheetClose>
              {/*<SheetClose asChild aria-describedby="schools">*/}
              {/*  <Link*/}
              {/*    className={`text-sm flex gap-2 py-3 px-2 rounded text-primary hover:font-bold items-center ${path === '/schools' && isSelected}`}*/}
              {/*    key="schools"*/}
              {/*    href="/schools"*/}
              {/*  >*/}
              {/*    <GraduationCap /> Escuelas*/}
              {/*  </Link>*/}
              {/*</SheetClose>*/}
            </>
          )}
        </div>
        <SheetFooter aria-describedby="footer">
          <a
            className="font-light text-sm text-primary/[0.8] hover:text-primary"
            key="logout"
            href="/api/auth/logout"
          >
            Cerrar sesión
          </a>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
