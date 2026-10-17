import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Montserrat';
import { MainCompositionProps, Scene } from './types';
import { KenBurnsMedia } from './KenBurnsMedia';
import { DynamicCaption } from './DynamicCaption';
import { OverlayLayer } from './OverlayLayer';
import { EndCard } from './EndCard';

// Load Google Font Montserrat untuk ketebalan 700/800/900 yang tajam dan dinamis
const { fontFamily } = loadFont('normal', {
  weights: ['700', '800', '900'],
  subsets: ['latin'],
});

export const MainComposition: React.FC<MainCompositionProps> = ({
  scenes,
  showWatermark = true,
  watermarkText = '@NarazyVerse',
  outroDurationInFrames = 90,
  outroRating = 'RATING: 9/10',
  outroTitle = 'JUDUL: [Overgear New]',
  outroCoverImage,
}) => {
  // Hitung start frame kumulatif untuk setiap scene
  let accumulatedFrames = 0;
  const sceneTimeline = scenes.map((scene) => {
    const from = accumulatedFrames;
    accumulatedFrames += scene.durationInFrames;
    return {
      scene,
      from,
      durationInFrames: scene.durationInFrames,
    };
  });

  const scenesTotalDuration = accumulatedFrames;
  const outroFrom = scenesTotalDuration;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000000',
        fontFamily,
      }}
    >
      {/* Rangkaian Scene Utama (Manhwa Dynamic Storytelling) */}
      {sceneTimeline.map(({ scene, from, durationInFrames }, idx) => (
        <Sequence
          key={scene.id}
          from={from}
          durationInFrames={durationInFrames}
          name={`Scene-${scene.id}`}
        >
          {/* Kamera Efek (KenBurns: zoom-in, punch-in, pan-down) */}
          <KenBurnsMedia
            src={scene.mediaUrl}
            durationInFrames={durationInFrames}
            zoomType={scene.zoomType}
            videoStartFrame={scene.videoStartFrame ?? 0}
          />

          {/* Subtitle Dinamis dengan teks Intro ekstra besar & Subtitle per-kata */}
          <DynamicCaption
            text={scene.text}
            highlightWords={scene.highlightWords}
            isIntro={idx === 0}
          />
        </Sequence>
      ))}

      {/* Watermark & Vignette Overlay di seluruh durasi video */}
      <Sequence
        from={0}
        durationInFrames={scenesTotalDuration + outroDurationInFrames}
        name="Overlays"
      >
        <OverlayLayer
          watermarkText={watermarkText}
          showWatermark={showWatermark}
        />
      </Sequence>

      {/* Outro Card Scene (Durasi 3 detik = 90 frames) */}
      <Sequence
        from={outroFrom}
        durationInFrames={outroDurationInFrames}
        name="Outro-EndCard"
      >
        <EndCard
          rating={outroRating}
          title={outroTitle}
          coverImage={outroCoverImage}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
