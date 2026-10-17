import React from 'react';
import { AbsoluteFill } from 'remotion';

interface OverlayLayerProps {
  watermarkText?: string;
  showWatermark?: boolean;
}

export const OverlayLayer: React.FC<OverlayLayerProps> = ({
  watermarkText = '@NarazyVerse',
  showWatermark = true,
}) => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        zIndex: 40,
      }}
    >
      {/* Vignette halus di tepi frame agar fokus penonton tetap di tengah panel manhwa */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.3) 75%, rgba(0,0,0,0.75) 100%)',
        }}
      />

      {/* Gradient halus di atas & bawah untuk memperjelas watermark dan caption */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '240px',
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '400px',
          background:
            'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Watermark teks statis di tengah-atas */}
      {showWatermark && (
        <div
          style={{
            position: 'absolute',
            top: '110px',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              padding: '8px 24px',
              backgroundColor: 'rgba(0, 0, 0, 0.35)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: '24px',
                color: '#FFFFFF',
                opacity: 0.5,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                textShadow: '0 2px 6px rgba(0,0,0,0.6)',
              }}
            >
              {watermarkText}
            </span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
