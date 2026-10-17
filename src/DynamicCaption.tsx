import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import subtitlesData from './subtitles.json';

interface WordItem {
  word: string;
  start: number;
  end: number;
  startFrame: number;
  endFrame: number;
}

export const DynamicCaption: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Detik 1 sampai 4 (Frame 0 sampai 120):
  // Subtitle keluar sesuai VO dengan warna mencolok: KUNING, MERAH, PUTIH, OREN dengan outline hitam
  if (frame < 120) {
    const introWords = [
      { text: 'APA', color: '#FFE600' },       // Kuning
      { text: 'JADINYA', color: '#FFE600' },   // Kuning
      { text: 'KALAU', color: '#FFFFFF' },     // Putih
      { text: 'ORANG', color: '#FFFFFF' },     // Putih
      { text: 'PALING', color: '#FF2A2A' },    // Merah
      { text: 'AMPAS', color: '#FF2A2A' },     // Merah
      { text: 'DI', color: '#FF8C00' },        // Oren
      { text: 'DUNIA', color: '#FF8C00' },     // Oren
      { text: 'NYATA', color: '#FF8C00' },     // Oren
      { text: 'TIBA-TIBA', color: '#FFE600' }, // Kuning
      { text: 'JADI', color: '#FF2A2A' },      // Merah
    ];

    const introSpring = spring({
      frame,
      fps,
      config: { damping: 11, mass: 0.45, stiffness: 220 },
    });
    const containerScale = interpolate(introSpring, [0, 1], [0.85, 1.0]);

    return (
      <div
        style={{
          position: 'absolute',
          bottom: '24%',
          left: '4%',
          right: '4%',
          width: '92%',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px 16px',
          zIndex: 40,
          pointerEvents: 'none',
          transform: `scale(${containerScale})`,
          transformOrigin: 'center center',
        }}
      >
        {introWords.map((item, idx) => {
          // Kata muncul berurutan sesuai VO dengan stagger frame halus
          const wordFrame = Math.max(0, frame - Math.min(idx * 8, 80));
          const wSpring = spring({
            frame: wordFrame,
            fps,
            config: { damping: 12, mass: 0.4, stiffness: 240 },
          });
          const wScale = interpolate(wSpring, [0, 1], [0.75, 1.0]);
          const opacity = interpolate(wordFrame, [0, 4], [0, 1], {
            extrapolateRight: 'clamp',
          });

          return (
            <span
              key={`${item.text}-${idx}`}
              style={{
                display: 'inline-block',
                fontFamily: "'Montserrat', 'Arial Black', sans-serif",
                fontWeight: 900,
                fontSize: '66px',
                lineHeight: 1.2,
                textTransform: 'uppercase',
                color: item.color,
                WebkitTextStroke: '6px #000000',
                textShadow: `0 6px 16px rgba(0,0,0,0.95), 0 0 25px ${item.color}77`,
                transform: `scale(${wScale})`,
                opacity,
                letterSpacing: '1.5px',
                willChange: 'transform, opacity',
              }}
            >
              {item.text}
            </span>
          );
        })}
      </div>
    );
  }

  // Detik ke-5 dan seterusnya (Frame 120 ke atas):
  // Subtitle keluar PER KATA dengan warna PUTIH JELAS dan OUTLINE HITAM
  const allWords = subtitlesData.words as WordItem[];

  // Cari kata yang sedang aktif pada frame saat ini (hanya yang setelah frame 120)
  const currentWord = allWords.find(
    (w) => frame >= w.startFrame && frame < w.endFrame
  );

  if (!currentWord || currentWord.startFrame < 120) {
    return null;
  }

  // Animasi spring pop setiap kali kata baru muncul
  const wordLocalFrame = frame - currentWord.startFrame;
  const wordSpring = spring({
    frame: wordLocalFrame,
    fps,
    config: { damping: 10, mass: 0.35, stiffness: 260 },
  });
  const wordScale = interpolate(wordSpring, [0, 1], [0.8, 1.08]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '25%',
        left: '5%',
        right: '5%',
        width: '90%',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 40,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          transform: `scale(${wordScale})`,
          transformOrigin: 'center center',
          textAlign: 'center',
          willChange: 'transform',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            fontFamily: "'Montserrat', 'Arial Black', sans-serif",
            fontWeight: 900,
            fontSize: '84px',
            lineHeight: 1.15,
            textTransform: 'uppercase',
            color: '#FFFFFF', // Putih Jelas
            WebkitTextStroke: '7px #000000', // Outline Hitam Tebal
            textShadow: '0 8px 24px rgba(0, 0, 0, 0.95), 0 2px 4px #000000',
            letterSpacing: '2.5px',
          }}
        >
          {currentWord.word}
        </span>
      </div>
    </div>
  );
};
