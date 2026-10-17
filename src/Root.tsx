import React from 'react';
import { Composition } from 'remotion';
import { MainComposition } from './MainComposition';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 
        Komposisi Utama: Format 9:16 Vertical Short (1080x1920, 30 FPS).
        Durasi: 1611 frames (~53.7 detik) persis sesuai durasi asli overgeared new.mp4
        tanpa memotong durasi video maupun VO narasi sedikit pun.
      */}
      <Composition
        id="MainComposition"
        component={MainComposition}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={1611}
      />
    </>
  );
};
