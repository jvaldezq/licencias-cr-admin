import * as React from 'react';
// import { VideoPlayer } from '@/app/videos/VideoPlayer';

const Videos = async () => {
  return (
    <main className="max-w-screen-2xl mx-auto px-2 pt-24">
      Videos
      <video src="/videos/cuadra_azul_san_ramon.mp4" width="600" controls>
        <source src="/videos/cuadra_azul_san_ramon.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </main>
  );
};

export default Videos;
