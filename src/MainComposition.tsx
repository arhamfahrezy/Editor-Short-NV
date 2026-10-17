import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
} from 'remotion';
import { Video, Audio } from '@remotion/media';
import { loadFont } from '@remotion/google-fonts/Montserrat';
import { DynamicCaption } from './DynamicCaption';
import { OverlayLayer } from './OverlayLayer';

// Load font Montserrat dengan bobot 700, 800, 900
const { fontFamily } = loadFont('normal', {
  weights: ['700', '800', '900'],
  subsets: ['latin'],
});

// Titik pergantian scene hasil analisis tepat dari overgeared new.mp4
export const SCENE_CUT_FRAMES = [
  160,  // 5.33s
  280,  // 9.33s
  429,  // 14.30s
  577,  // 19.23s
  665,  // 22.17s
  745,  // 24.83s
  892,  // 29.73s
  996,  // 33.20s
  1129, // 37.63s
  1254, // 41.80s
  1404, // 46.80s
  1508, // 50.27s
];

export const MainComposition: React.FC = () => {
  const frame = useCurrentFrame();

  // Hitung efek camera zoom dinamis halus tanpa memotong video
  // Kamera perlahan zoom-in halus pada intro 0-120 frame
  let scale = 1.0;
  if (frame < 120) {
    scale = interpolate(frame, [0, 120], [1.0, 1.06], {
      extrapolateRight: 'clamp',
    });
  } else {
    // Punch mikro halus setiap kali ada pergantian scene
    const nearestCut = SCENE_CUT_FRAMES.find(
      (c) => frame >= c && frame < c + 6
    );
    if (nearestCut) {
      const punchFrame = frame - nearestCut;
      scale = interpolate(punchFrame, [0, 2, 6], [1.05, 1.02, 1.0], {
        extrapolateRight: 'clamp',
      });
    }
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000000',
        fontFamily,
        overflow: 'hidden',
      }}
    >
      {/* 
        RAW VIDEO & VO NARASI PENUH:
        JANGAN POTONG DURASI VIDEO & JANGAN POTONG VO NARASI.
        Video diputar penuh dari detik 0 hingga akhir 53.7 detik (1611 frames)
        tanpa potongan sedikit pun.
      */}
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        <Video
          src={staticFile('overgeared new.mp4')}
          volume={1}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </AbsoluteFill>

      {/* SFX di setiap pergantian scene */}
      {SCENE_CUT_FRAMES.map((cutFrame) => (
        <Sequence
          key={`sfx-${cutFrame}`}
          from={cutFrame}
          durationInFrames={15}
          name={`SFX-Scene-${cutFrame}`}
        >
          <Audio src={staticFile('whoosh.wav')} volume={0.65} />
        </Sequence>
      ))}

      {/* Watermark & Vignette Overlay */}
      <OverlayLayer watermarkText="@NarazyVerse" showWatermark={true} />

      {/* 
        SUBTITLE DINAMIS:
        - Detik 1-4: keluar sesuai VO warna mencolok kuning, merah, putih, oren dengan outline hitam.
        - Detik 5+: keluar perkata dengan warna putih jelas dan outline hitam.
      */}
      <DynamicCaption />
    </AbsoluteFill>
  );
};
