'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { FormSavingLoader } from '@/components/FormLoader';
import { Dialog } from '@/components/Dialog';
import { useGetLogs } from '@/context/client';
import dayjs from 'dayjs';
// import { LOG_TITLES_TRANSLATED } from '@/lib/definitions';

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
              <p>{data?.created?.createdBy?.name}</p>
              <p>{dayjs(data?.created?.createdAt).format('YYYY MMM DD')}</p>
              <p className="col-span-full font-semibold">Creación</p>
            </div>
          )}

          {/*{data?.logs.map((log) => {*/}
          {/*  return (*/}
          {/*    <div className="gap grid grid-cols-2 py-2" key={log.id}>*/}
          {/*      <p>{log?.changedBy?.name}</p>*/}
          {/*      <p>{dayjs(log?.createdAt).format('YYYY MMM DD')}</p>*/}
          {/*      <p className="col-span-full font-semibold pb-2">*/}
          {/*        {*/}
          {/*          LOG_TITLES_TRANSLATED?.[*/}
          {/*            log.title as keyof typeof LOG_TITLES_TRANSLATED*/}
          {/*          ]*/}
          {/*        }*/}
          {/*      </p>*/}
          {/*    </div>*/}
          {/*  );*/}
          {/*})}*/}
        </div>
      </Dialog>
      {children}
    </LogContext.Provider>
  );
};
