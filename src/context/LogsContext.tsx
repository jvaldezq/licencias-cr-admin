'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { FormSavingLoader } from '@/components/FormLoader';
import { Dialog } from '@/components/Dialog';
import { useGetLogs } from '@/context/client';
import dayjs from 'dayjs';
import {
  ICashPaymentsAdvance,
  LOG_TITLES_TRANSLATED,
  LogTitleKeys,
} from '@/lib/definitions';

const emptyState = {
  eventId: undefined,
  assetId: undefined,
};

interface showLogsProps {
  eventId?: string;
  assetId?: string;
}

type LogContextType = {
  showLogs: (value: showLogsProps) => void;
};

const LogContext = createContext<LogContextType | undefined>(undefined);

export const useLogContext = () => {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error('useMyContext must be used within a MyContextProvider');
  }
  return context;
};

export const LogContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<showLogsProps>(emptyState);

  const { data, isLoading } = useGetLogs(value);

  useEffect(() => {
    if (value.eventId || value.assetId) {
      setOpen(true);
    }
  }, [value.assetId, value.eventId]);

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      setValue(emptyState);
    }
    setOpen(open);
  };

  return (
    <LogContext.Provider value={{ showLogs: setValue }}>
      <Dialog
        open={open}
        onOpenChange={handleOnOpenChange}
        title="Registros"
        isLoading={isLoading}
        loadingContent={<FormSavingLoader message="Cargando registros" />}
        trigger={null}
        cancelText="Cerrar"
      >
        {!data?.created?.createdBy?.name && data?.logs.length === 0 && (
          <p className="text-primary py-2">Sin registros</p>
        )}
        <div className="divide-y divide-primary text-primary">
          {data?.created?.createdBy?.name && (
            <div className="gap grid grid-cols-2 py-2">
              <p className="col-span-full font-semibold">Creación</p>
              <p>{data?.created?.createdBy?.name}</p>
              <p>{dayjs(data?.created?.createdAt).format('YYYY MMM DD')}</p>
            </div>
          )}

          {data?.logs.map((log, index) => {
            const obj = JSON.parse(log?.message);
            const title = log.title as LogTitleKeys;

            return (
              <div
                className="gap grid grid-cols-2 py-2"
                key={`log-${index}-${log?.changedBy?.name}`}
              >
                <p className="col-span-full font-semibold">
                  {LOG_TITLES_TRANSLATED[title]}
                </p>
                <p>{log?.changedBy?.name}</p>
                <p>{dayjs(log?.createdAt).format('YYYY MMM DD')}</p>
                <div className="col-span-full p-1 rounded-lg bg-primary text-white overflow-scroll grid grid-cols-2 gap-1 mt-2">
                  {obj?.customer?.name && (
                    <p className="flex flex-col gap-1 text-xs">
                      <span className="font-light">Nombre</span>
                      <span className="font-bold">{obj.customer.name}</span>
                    </p>
                  )}
                  {obj?.customer?.testPassed && (
                    <p className="flex flex-col gap-1 text-xs">
                      <span className="font-light">Aprobo prueba?</span>
                      <span className="font-bold">
                        {obj.testPassed ? 'Sí' : 'No'}
                      </span>
                    </p>
                  )}
                  {obj?.customer?.identification && (
                    <p className="flex flex-col gap-1 text-xs">
                      <span className="font-light">Identificación</span>
                      <span className="font-bold">
                        {obj.customer.identification}
                      </span>
                    </p>
                  )}
                  {obj?.customer?.phone && (
                    <p className="flex flex-col gap-1 text-xs">
                      <span className="font-light">Teléfono</span>
                      <span className="font-bold">{obj.customer.phone}</span>
                    </p>
                  )}
                  {obj?.customer?.schedule && (
                    <p className="flex flex-col gap-1 text-xs">
                      <span className="font-light">Horario</span>
                      <span className="font-bold">
                        {obj.customer.schedule.startTime} -{' '}
                        {obj.customer.schedule.endTime}
                      </span>
                    </p>
                  )}
                  {obj?.customer?.testPassed !== undefined && (
                    <p className="flex flex-col gap-1 text-xs">
                      <span className="font-light">Prueba Aprobada</span>
                      <span className="font-bold">
                        {obj.customer.testPassed ? 'Sí' : 'No'}
                      </span>
                    </p>
                  )}
                  {obj?.location?.name && (
                    <p className="flex flex-col gap-1 text-xs">
                      <span className="font-light">Ubicación</span>
                      <span className="font-bold">{obj.location.name}</span>
                    </p>
                  )}
                  {obj?.licenseType?.name && (
                    <p className="flex flex-col gap-1 text-xs">
                      <span className="font-light">Tipo de Licencia</span>
                      <span className="font-bold">{obj.licenseType.name}</span>
                    </p>
                  )}
                  {obj?.date && (
                    <p className="flex flex-col gap-1 text-xs">
                      <span className="font-light">Fecha</span>
                      <span className="font-bold">
                        {new Date(obj.date).toLocaleDateString()}
                      </span>
                    </p>
                  )}
                  {obj?.time && (
                    <p className="flex flex-col gap-1 text-xs">
                      <span className="font-light">Hora</span>
                      <span className="font-bold">{obj.time}</span>
                    </p>
                  )}
                  {obj?.instructor?.name && (
                    <p className="flex flex-col gap-1 text-xs">
                      <span className="font-light">Instructor</span>
                      <span className="font-bold">{obj.instructor.name}</span>
                    </p>
                  )}
                  {obj?.asset?.name && (
                    <p className="flex flex-col gap-1 text-xs">
                      <span className="font-light">Activo</span>
                      <span className="font-bold">{obj.asset.name}</span>
                    </p>
                  )}
                  {obj?.payment?.price !== undefined && (
                    <p className="flex flex-col gap-1 text-xs">
                      <span className="font-light">Precio</span>
                      <span className="font-bold">{obj.payment.price}</span>
                    </p>
                  )}
                  {obj?.payment?.cashAdvance !== undefined && (
                    <p className="flex flex-col gap-1 text-xs">
                      <span className="font-light">Anticipo</span>
                      <span className="font-bold">
                        {obj.payment.cashAdvance}
                      </span>
                    </p>
                  )}
                  {obj?.payment?.paid !== undefined && (
                    <p className="flex flex-col gap-1 text-xs">
                      <span className="font-light">Pagado</span>
                      <span className="font-bold">
                        {obj.payment.paid ? 'Sí' : 'No'}
                      </span>
                    </p>
                  )}
                  {obj?.payment?.paidDate && (
                    <p className="flex flex-col gap-1 text-xs">
                      <span className="font-light">Fecha de Pago</span>
                      <span className="font-bold">
                        {new Date(obj.payment.paidDate).toLocaleDateString()}
                      </span>
                    </p>
                  )}
                  {obj?.payment?.cashPaymentsAdvance?.length > 0 && (
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="font-light">Pagos de Anticipo</span>
                      {obj.payment.cashPaymentsAdvance.map(
                        (payment: ICashPaymentsAdvance) => (
                          <div key={payment?.id} className="font-bold">
                            <span>
                              {payment?.amount} ({payment?.type})
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                  {obj?.hasMedical !== undefined && (
                    <p className="flex flex-col gap-1 text-xs">
                      <span className="font-light">Tiene Médico</span>
                      <span className="font-bold">
                        {obj.hasMedical ? 'Sí' : 'No'}
                      </span>
                    </p>
                  )}
                  {obj?.isInternalReferred !== undefined && (
                    <p className="flex flex-col gap-1 text-xs">
                      <span className="font-light">Referido Interno</span>
                      <span className="font-bold">
                        {obj.isInternalReferred ? 'Sí' : 'No'}
                      </span>
                    </p>
                  )}
                  {obj?.isExternalReferred !== undefined && (
                    <p className="flex flex-col gap-1 text-xs">
                      <span className="font-light">Referido Externo</span>
                      <span className="font-bold">
                        {obj.isExternalReferred ? 'Sí' : 'No'}
                      </span>
                    </p>
                  )}
                  {obj?.hasBeenContacted !== undefined && (
                    <p className="flex flex-col gap-1 text-xs">
                      <span className="font-light">Confirmado</span>
                      <span className="font-bold">
                        {obj.hasBeenContacted ? 'Sí' : 'No'}
                      </span>
                    </p>
                  )}
                  {obj?.noShow !== undefined && (
                    <p className="flex flex-col gap-1 text-xs">
                      <span className="font-light">No se presentó</span>
                      <span className="font-bold">
                        {obj.noShow ? 'Sí' : 'No'}
                      </span>
                    </p>
                  )}
                  {obj?.status !== undefined && (
                    <p className="flex flex-col gap-1 text-xs">
                      <span className="font-light">Estado</span>
                      <span className="font-bold">{obj.status.toString()}</span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Dialog>
      {children}
    </LogContext.Provider>
  );
};
