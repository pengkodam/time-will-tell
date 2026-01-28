import { useEffect, useState, useRef } from 'react';
import { useTalkTimer, type TimerZone } from './hooks/useTalkTimer';
import { formatTime } from './utils/time';
import './index.css';

// SVG Icons
const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const ResetIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.96l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.26-1.13.59-1.62.96l-2.39-.96c-.21-.08-.47.01-.59.22L5.16 8.87a.49.49 0 0 0 .12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.23.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.96l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.26 1.13-.59 1.62-.96l2.39.96c.21.08.47-.01.59-.22l1.92-3.32a.49.49 0 0 0-.12-.61l-2.03-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </svg>
);

function App() {
  const { remainingTime, status, zone, config, start, pause, reset, updateConfig } = useTalkTimer();
  const [showSettings, setShowSettings] = useState(false);

  // Sound refs
  const gongRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    gongRef.current = new Audio('/gong.wav');
  }, []);

  // Handle Zone Side Effects (Audio & Haptics)
  const prevZoneRef = useRef<TimerZone>(zone);

  useEffect(() => {
    const prevZone = prevZoneRef.current;

    if (prevZone !== zone) {
      if (zone === 'overtime') {
        // Play Gong
        gongRef.current?.play().catch(e => console.log('Audio play failed', e));
        // Simple Vibrate
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      } else if (zone === 'danger') {
        if (navigator.vibrate) navigator.vibrate(500);
      } else if (zone === 'warning') {
        if (navigator.vibrate) navigator.vibrate(200);
      }
      prevZoneRef.current = zone;
    }
  }, [zone]);

  // Wake Lock
  useEffect(() => {
    let wakeLock: any = null;
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator) {
        try {
          wakeLock = await (navigator as any).wakeLock.request('screen');
        } catch (err) {
          console.log('Wake Lock error:', err);
        }
      }
    };

    if (status === 'running') {
      requestWakeLock();
    }

    return () => {
      if (wakeLock) wakeLock.release();
    };
  }, [status]);

  // Styling Helpers
  const getBackgroundColor = () => {
    switch (zone) {
      case 'safe': return 'var(--color-safe)';
      case 'warning': return 'var(--color-warning)';
      case 'danger': return 'var(--color-danger)';
      case 'overtime': return '#FFFFFF'; // Flashing handled in logic below
    }
  };

  const getTextColor = () => {
    if (zone === 'overtime') return 'var(--color-danger)'; // Red text on White/Flash
    if (zone === 'warning') return 'var(--color-text-dark)'; // Black text on Yellow
    return 'var(--color-text-light)'; // White text on Black/Red
  };

  const isFlash = zone === 'overtime' && Math.floor(Date.now() / 500) % 2 === 0;

  return (
    <div
      className="full-screen flex-center"
      style={{
        backgroundColor: isFlash ? 'var(--color-danger)' : getBackgroundColor(),
        color: isFlash ? 'var(--color-text-light)' : getTextColor(),
        transition: 'background-color 0.4s ease, color 0.4s ease',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* Settings Modal */}
      {showSettings && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 100,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white'
        }}>
          <div style={{
            background: '#1a1a1a',
            padding: '2rem',
            borderRadius: '16px',
            minWidth: '300px'
          }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Settings</h2>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#888' }}>Total Duration (min)</label>
              <input
                type="number"
                value={config.duration / 60}
                onChange={(e) => updateConfig({ duration: Number(e.target.value) * 60 })}
                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #333', background: '#333', color: 'white' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#888' }}>Warning at (min remaining)</label>
              <input
                type="number"
                value={config.warningThreshold / 60}
                onChange={(e) => updateConfig({ warningThreshold: Number(e.target.value) * 60 })}
                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #333', background: '#333', color: 'white' }}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#888' }}>Danger at (min remaining)</label>
              <input
                type="number"
                value={config.dangerThreshold / 60}
                onChange={(e) => updateConfig({ dangerThreshold: Number(e.target.value) * 60 })}
                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #333', background: '#333', color: 'white' }}
              />
            </div>

            <button
              onClick={() => setShowSettings(false)}
              style={{ width: '100%', padding: '12px', background: 'var(--color-danger)', color: 'white', borderRadius: '8px', fontWeight: 'bold' }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Main Timer Display */}
      <div style={{
        fontSize: 'clamp(4rem, 20vw, 15rem)',
        fontWeight: '700',
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1
      }}>
        {formatTime(remainingTime)}
      </div>

      {/* Controls */}
      <div style={{
        position: 'absolute',
        bottom: '3rem',
        display: 'flex',
        gap: '2rem',
        opacity: status === 'idle' || status === 'paused' ? 1 : 0.3,
        transition: 'opacity 0.3s ease'
      }}>
        <button
          onClick={() => status === 'running' ? pause() : start()}
          style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            color: 'currentColor',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          {status === 'running' ? <PauseIcon /> : <PlayIcon />}
        </button>

        <button
          onClick={reset}
          disabled={status === 'running'}
          style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            color: 'currentColor',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: status === 'running' ? 0.5 : 1,
            cursor: status === 'running' ? 'not-allowed' : 'pointer'
          }}
        >
          <ResetIcon />
        </button>

        <button
          onClick={() => setShowSettings(true)}
          style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            color: 'currentColor',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <SettingsIcon />
        </button>
      </div>
    </div>
  );
}

export default App;
