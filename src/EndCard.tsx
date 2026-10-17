import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
} from 'remotion';

interface EndCardProps {
  rating?: string;
  title?: string;
  coverImage?: string;
  subText?: string;
}

export const EndCard: React.FC<EndCardProps> = ({
  rating = 'RATING: 9/10',
  title = 'JUDUL: [Overgeared New]',
  coverImage,
  subText = 'BACA SEKARANG DI PLATFORM RESMI!',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring animations
  const badgeSpring = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 180 },
  });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.5, 1.0]);
  const badgeOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const cardSpring = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: { damping: 13, mass: 0.7, stiffness: 170 },
  });
  const cardScale = interpolate(cardSpring, [0, 1], [0.6, 1.0]);
  const cardOpacity = interpolate(Math.max(0, frame - 4), [0, 8], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const titleSpring = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 200 },
  });
  const titleScale = interpolate(titleSpring, [0, 1], [0.7, 1.0]);
  const titleOpacity = interpolate(Math.max(0, frame - 8), [0, 8], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Background glow pulsing
  const glowPulse = interpolate(
    Math.sin((frame / fps) * 4),
    [-1, 1],
    [0.75, 1.0]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0103',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '220px 60px 130px 60px',
      }}
    >
      {/* Background Gelap Kemerahan dengan Glow Efek */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 45%, rgba(185, 28, 55, ${
            0.55 * glowPulse
          }) 0%, rgba(68, 8, 19, 0.8) 45%, #080103 85%)`,
          zIndex: 1,
        }}
      />

      {/* Dynamic Background Grid Pattern */}
      <AbsoluteFill
        style={{
          backgroundImage:
            'radial-gradient(rgba(255, 255, 255, 0.08) 1.5px, transparent 1.5px)',
          backgroundSize: '40px 40px',
          opacity: 0.4,
          zIndex: 2,
        }}
      />

      {/* Top Section: Rating */}
      <div
        style={{
          zIndex: 10,
          transform: `scale(${badgeScale})`,
          opacity: badgeOpacity,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 32px',
            borderRadius: '50px',
            backgroundColor: 'rgba(255, 215, 0, 0.12)',
            border: '2px solid #FFD700',
            boxShadow: '0 0 25px rgba(255, 215, 0, 0.4)',
          }}
        >
          <span style={{ fontSize: '32px' }}>⭐</span>
          <span
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 900,
              fontSize: '38px',
              color: '#FFE600',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
            }}
          >
            {rating}
          </span>
        </div>
      </div>

      {/* Center Section: Cover Image Card */}
      <div
        style={{
          zIndex: 10,
          transform: `scale(${cardScale})`,
          opacity: cardOpacity,
          width: '560px',
          height: '780px',
          borderRadius: '28px',
          overflow: 'hidden',
          border: '4px solid rgba(255, 230, 0, 0.85)',
          boxShadow:
            '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(235, 34, 75, 0.55)',
          position: 'relative',
          backgroundColor: '#140306',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {coverImage ? (
          <Img
            src={coverImage}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background:
                'linear-gradient(145deg, #2b0b14 0%, #160207 50%, #4a1020 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '30px',
              textAlign: 'center',
              gap: '24px',
            }}
          >
            <div
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 230, 0, 0.15)',
                border: '3px solid #FFE600',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '64px',
                boxShadow: '0 0 30px rgba(255, 230, 0, 0.3)',
              }}
            >
              ⚔️
            </div>
            <div
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 900,
                fontSize: '44px',
                color: '#FFFFFF',
                letterSpacing: '1px',
                lineHeight: 1.2,
                textShadow: '0 4px 14px rgba(0,0,0,0.9)',
              }}
            >
              OVERGEARED
            </div>
            <div
              style={{
                padding: '8px 20px',
                backgroundColor: '#FF2A2A',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '20px',
                color: '#FFFFFF',
                letterSpacing: '1.5px',
              }}
            >
              MUST READ MANHWA
            </div>
          </div>
        )}

        {/* Shine Overlay on Cover Card */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 40%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Bottom Section: Title and Call-to-Action */}
      <div
        style={{
          zIndex: 10,
          transform: `scale(${titleScale})`,
          opacity: titleOpacity,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 900,
            fontSize: '52px',
            color: '#FFFFFF',
            WebkitTextStroke: '2px #000000',
            textShadow: '0 4px 15px rgba(0,0,0,0.9), 0 0 30px #00F0FF',
            letterSpacing: '1.5px',
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 800,
            fontSize: '24px',
            color: '#00F0FF',
            backgroundColor: 'rgba(0, 240, 255, 0.1)',
            padding: '10px 28px',
            borderRadius: '24px',
            border: '1px solid rgba(0, 240, 255, 0.4)',
            letterSpacing: '1.5px',
          }}
        >
          {subText}
        </div>
      </div>
    </AbsoluteFill>
  );
};
