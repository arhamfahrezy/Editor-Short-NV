import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

interface DynamicCaptionProps {
  text: string;
  highlightWords: string[];
  isIntro?: boolean;
  style?: React.CSSProperties;
}

// Helper membersihkan tanda baca untuk mencocokkan kata highlight
const cleanWord = (w: string) => w.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

export const DynamicCaption: React.FC<DynamicCaptionProps> = ({
  text,
  highlightWords,
  isIntro = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(/\s+/).filter(Boolean);

  // Jika scene intro (Scene 1): teks super besar, mencolok, berenergi tinggi!
  if (isIntro) {
    const highlightPalette = ['#FFE600', '#00F0FF', '#FF2A2A', '#FFE600'];
    const normalizedHighlights = highlightWords.map((hw) => cleanWord(hw));

    const introSpring = spring({
      frame,
      fps,
      config: { damping: 10, mass: 0.4, stiffness: 220 },
    });
    const scale = interpolate(introSpring, [0, 1], [0.8, 1.0]);
    const opacity = interpolate(frame, [0, 4], [0, 1], {
      extrapolateRight: 'clamp',
    });

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
          gap: '14px 18px',
          zIndex: 35,
          pointerEvents: 'none',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          opacity,
          ...style,
        }}
      >
        {words.map((rawWord, idx) => {
          const cleaned = cleanWord(rawWord);
          const highlightIndex = normalizedHighlights.findIndex(
            (hw) => hw === cleaned || cleaned.includes(hw) || hw.includes(cleaned)
          );
          const isHighlight = highlightIndex !== -1;
          const highlightColor = isHighlight
            ? highlightPalette[highlightIndex % highlightPalette.length]
            : '#FFFFFF';

          const wordFrame = Math.max(0, frame - Math.min(idx * 2, 10));
          const wSpring = spring({
            frame: wordFrame,
            fps,
            config: { damping: 11, mass: 0.4, stiffness: 220 },
          });
          const wScale = interpolate(wSpring, [0, 1], [0.8, 1.0]);

          return (
            <span
              key={`${rawWord}-${idx}`}
              style={{
                display: 'inline-block',
                fontFamily: "'Montserrat', 'Impact', 'Arial Black', sans-serif",
                fontWeight: 900,
                // Ukuran teks intro ekstra besar agar langsung mengait perhatian penonton
                fontSize: '68px',
                lineHeight: 1.2,
                textTransform: 'uppercase',
                color: highlightColor,
                WebkitTextStroke: '6px #000000',
                textShadow: isHighlight
                  ? `0 6px 14px rgba(0,0,0,0.95), 0 0 25px ${highlightColor}aa`
                  : '0 6px 14px rgba(0,0,0,0.9)',
                transform: `scale(${wScale})`,
                letterSpacing: '1.5px',
                willChange: 'transform',
              }}
            >
              {rawWord}
            </span>
          );
        })}
      </div>
    );
  }

  // Scene 2 dan seterusnya: Menampilkan subtitle PER KATA (1 kata fokus bergantian aktif)
  // dengan teks putih tebal dan garis tepi/stroke hitam pekat
  const totalDurationFrames = 90; // disesuaikan per scene
  const wordCount = Math.max(1, words.length);
  const framesPerWord = totalDurationFrames / wordCount;
  const currentWordIndex = Math.min(
    Math.floor(frame / framesPerWord),
    wordCount - 1
  );

  const activeWord = words[currentWordIndex] || words[0];
  const wordStartFrame = currentWordIndex * framesPerWord;
  const wordLocalFrame = frame - wordStartFrame;

  const wordSpring = spring({
    frame: wordLocalFrame,
    fps,
    config: { damping: 12, mass: 0.4, stiffness: 240 },
  });
  const wordScale = interpolate(wordSpring, [0, 1], [0.85, 1.05]);

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
        zIndex: 35,
        pointerEvents: 'none',
        ...style,
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
            fontFamily: "'Montserrat', 'Impact', 'Arial Black', sans-serif",
            fontWeight: 900,
            fontSize: '74px',
            lineHeight: 1.2,
            textTransform: 'uppercase',
            color: '#FFFFFF', // Teks putih
            WebkitTextStroke: '6px #000000', // Line hitam tebal
            textShadow: '0 8px 18px rgba(0, 0, 0, 0.95), 0 2px 4px #000000',
            letterSpacing: '2px',
          }}
        >
          {activeWord}
        </span>
      </div>
    </div>
  );
};
