import React from 'react';
import { interpolate, useCurrentFrame, Easing, AbsoluteFill, Img } from 'remotion';
import { Video } from '@remotion/media';
import { ZoomType } from './types';

interface KenBurnsMediaProps {
  src: string;
  durationInFrames: number;
  zoomType: ZoomType;
  videoStartFrame?: number;
  style?: React.CSSProperties;
}

export const KenBurnsMedia: React.FC<KenBurnsMediaProps> = ({
  src,
  durationInFrames,
  zoomType,
  videoStartFrame = 0,
  style,
}) => {
  const frame = useCurrentFrame();

  let scale = 1.0;
  let translateY = 0;
  let translateX = 0;

  switch (zoomType) {
    case 'zoom-in': {
      // Scale halus dari 1.0 ke 1.12 sepanjang durasi scene
      scale = interpolate(frame, [0, durationInFrames], [1.0, 1.12], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      });
      break;
    }

    case 'punch-in': {
      // Snap cepat scale 1.15 pada 5 frame pertama, lalu tahan perlahan
      if (frame <= 5) {
        scale = interpolate(frame, [0, 5], [1.0, 1.15], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        });
      } else {
        scale = interpolate(frame, [5, durationInFrames], [1.15, 1.19], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.linear,
        });
      }
      break;
    }

    case 'pan-down': {
      // Pergeseran translateY halus untuk panel manhwa panjang dengan sedikit scale aman
      scale = 1.14;
      translateY = interpolate(frame, [0, durationInFrames], [60, -120], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      break;
    }

    case 'zoom-out': {
      // Scale dari 1.15 ke 1.0
      scale = interpolate(frame, [0, durationInFrames], [1.15, 1.0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      });
      break;
    }

    case 'static':
    default: {
      scale = 1.05;
      translateY = 0;
      translateX = 0;
      break;
    }
  }

  const isImage = /\.(png|jpe?g|webp|gif|svg)$/i.test(src);

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        backgroundColor: '#0d0d0d',
        ...style,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
          transformOrigin: 'center center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          willChange: 'transform',
        }}
      >
        {isImage ? (
          <Img
            src={src}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Video
            src={src}
            trimBefore={videoStartFrame}
            volume={1}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};
