import * as React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { getSession } from '@auth0/nextjs-auth0';
import { fetchUserInfo } from '@/components/Header/service';

const Videos = async () => {
  const session = await getSession();
  const user = await fetchUserInfo({
    userId: session?.user?.sub?.split('|')[1],
  });
  const fullAccess = user?.access?.receptionist || user?.access?.admin;

  return (
    <main className="max-w-screen-2xl mx-auto px-2 pt-24">
      <h1 className="font-semibold text-3xl text-secondary animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in mb-4">
        Videos
      </h1>

      <Accordion type="single" collapsible>
        {(user?.location?.name === 'San Ramón' || fullAccess) && (
          <AccordionItem value="san-ramon">
            <AccordionTrigger>San Ramón</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <VideoWrapper
                  src="https://firebasestorage.googleapis.com/v0/b/carrocr-6bcb0.appspot.com/o/cuadra_azul_san_ramon.mp4?alt=media&token=d89da324-a73f-47d5-af99-24cd4e4af68d"
                  title="Cuadraciclo"
                />
                <VideoWrapper
                  src="https://firebasestorage.googleapis.com/v0/b/carrocr-6bcb0.appspot.com/o/plantel_b1.mp4?alt=media&token=6d5babc6-2793-46af-85aa-9cde9551bfaf"
                  title="Plantel B1"
                />
                <VideoWrapper
                  src="https://firebasestorage.googleapis.com/v0/b/carrocr-6bcb0.appspot.com/o/motos_san_ramon.mp4?alt=media&token=8d6ccc04-1087-40d6-9304-e3144e917aad"
                  title="Motos"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {(user?.location?.name === 'Ciudad Vial' || fullAccess) && (
          <AccordionItem value="ciudad-vial">
            <AccordionTrigger>Ciudad Vial</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <VideoWrapper
                  src="https://firebasestorage.googleapis.com/v0/b/carrocr-6bcb0.appspot.com/o/altos_ciudad.mp4?alt=media&token=682aafa6-928b-42a4-afad-13b882889073"
                  title="Altos"
                />
                <VideoWrapper
                  src="https://firebasestorage.googleapis.com/v0/b/carrocr-6bcb0.appspot.com/o/plantel_ciudad.mp4?alt=media&token=4fbee1e5-e4cd-4602-9b88-279ccec93158"
                  title="Plantel"
                />
                <VideoWrapper
                  src="https://firebasestorage.googleapis.com/v0/b/carrocr-6bcb0.appspot.com/o/completo_ciudad.mp4?alt=media&token=3e822755-53c1-42a7-bb25-dd6c9cab791d"
                  title="Completo"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </main>
  );
};

export default Videos;

interface VideoWrapperProps {
  src: string;
  title: string;
}

const VideoWrapper = (props: VideoWrapperProps) => {
  const { src, title } = props;
  return (
    <div className="justify-center items-center flex flex-col p-4 rounded-lg gap-2">
      <p className="text-primary font-bold text-lg">{title}</p>
      <video src={src} controls className="rounded-lg border border-primary" controlsList="nodownload">
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
