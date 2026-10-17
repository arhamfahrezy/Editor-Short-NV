import React from 'react';
import { Composition, staticFile } from 'remotion';
import { MainComposition } from './MainComposition';
import { EndCard } from './EndCard';
import {
  mainCompositionSchema,
  MainCompositionProps,
  Scene,
} from './types';

// Default Storyteller scenes untuk Manhwa Overgeared
export const defaultScenes: Scene[] = [
  {
    id: 1,
    mediaUrl: staticFile('overgeared new.mp4'),
    durationInFrames: 90,
    zoomType: 'punch-in',
    text: 'ORANG PALING SIAL JADI DEWA TEMPA TERKUAT?!',
    highlightWords: ['SIAL', 'DEWA', 'TERKUAT'],
    videoStartFrame: 0,
  },
  {
    id: 2,
    mediaUrl: staticFile('overgeared new.mp4'),
    durationInFrames: 90,
    zoomType: 'pan-down',
    text: 'BEBAN KELUARGA YANG DILILIT UTANG RATUSAN JUTA!',
    highlightWords: ['BEBAN', 'KELUARGA', 'UTANG'],
    videoStartFrame: 90,
  },
  {
    id: 3,
    mediaUrl: staticFile('overgeared new.mp4'),
    durationInFrames: 90,
    zoomType: 'zoom-in',
    text: 'TIAP HARI NGULI DI GAME VR SAMPAI DAPET BUKU KERAMAT!',
    highlightWords: ['NGULI', 'GAME', 'KERAMAT'],
    videoStartFrame: 180,
  },
  {
    id: 4,
    mediaUrl: staticFile('overgeared new.mp4'),
    durationInFrames: 90,
    zoomType: 'punch-in',
    text: 'BOOM! DAPET KELAS PAGAN LEGENDARIS PERTAMA DI DUNIA!',
    highlightWords: ['BOOM!', 'LEGENDARIS', 'PERTAMA'],
    videoStartFrame: 300,
  },
  {
    id: 5,
    mediaUrl: staticFile('overgeared new.mp4'),
    durationInFrames: 90,
    zoomType: 'zoom-in',
    text: 'BIKIN SENJATA S-RANK SENDIRI DAN RATAIN SEMUA BOSS!',
    highlightWords: ['SENJATA', 'S-RANK', 'RATAIN', 'BOSS'],
    videoStartFrame: 450,
  },
  {
    id: 6,
    mediaUrl: staticFile('overgeared new.mp4'),
    durationInFrames: 90,
    zoomType: 'pan-down',
    text: 'KOCAK TAPI BIKIN MERINDING! WAJIB BACA OVERGEARED!',
    highlightWords: ['KOCAK', 'MERINDING', 'OVERGEARED'],
    videoStartFrame: 600,
  },
];

const defaultMainProps: MainCompositionProps = {
  scenes: defaultScenes,
  showWatermark: true,
  watermarkText: '@NarazyVerse',
  outroDurationInFrames: 90,
  outroRating: 'RATING: 9/10',
  outroTitle: 'JUDUL: [Overgeared New]',
  outroCoverImage: staticFile('cover.jpg'),
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Komposisi Utama: 9:16 Vertical Short (1080x1920, 30 FPS) */}
      <Composition
        id="MainComposition"
        component={MainComposition}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={630} // 6 scene x 90 frame + 90 frame outro = 630 frame (21 detik)
        schema={mainCompositionSchema}
        defaultProps={defaultMainProps}
        calculateMetadata={({ props }) => {
          const scenesTotal = (props.scenes || []).reduce(
            (acc: number, s: Scene) => acc + (s.durationInFrames || 0),
            0
          );
          const outroTotal = props.outroDurationInFrames ?? 90;
          return {
            durationInFrames: Math.max(30, scenesTotal + outroTotal),
          };
        }}
      />

      {/* Komposisi Khusus Outro Card untuk Preview Cepat */}
      <Composition
        id="EndCardPreview"
        component={EndCard}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={90}
        defaultProps={{
          rating: 'RATING: 9/10',
          title: 'JUDUL: [Overgeared New]',
          subText: 'BACA SEKARANG DI PLATFORM RESMI!',
        }}
      />
    </>
  );
};
