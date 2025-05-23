import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import Header from '@/components/Header/Header';
import { QueryWrapper } from '@/components/QueryWrapper';
import { LogContextProvider } from '@/context/LogsContext';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Licencia Costa Rica',
  description:
    'Plataforma administrativa para la gestión de licencias de conducir en Costa Rica',
};

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  width: 'device-width',
  userScalable: false,
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body className="h-dvh bg-gray-50">
        <QueryWrapper>
          <UserProvider>
            <LogContextProvider>
              <Header />
              {children}
              <Toaster/>
            </LogContextProvider>
          </UserProvider>
        </QueryWrapper>
      </body>
    </html>
  );
};

export default RootLayout;
