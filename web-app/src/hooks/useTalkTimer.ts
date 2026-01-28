import { useState, useEffect, useRef, useCallback } from 'react';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export type TimerZone = 'safe' | 'warning' | 'danger' | 'overtime';

export interface TimerConfig {
    duration: number; // in seconds
    warningThreshold: number; // seconds remaining
    dangerThreshold: number; // seconds remaining
}

export interface TimerState {
    remainingTime: number; // seconds
    status: TimerStatus;
    zone: TimerZone;
}

const DEFAULT_CONFIG: TimerConfig = {
    duration: 15 * 60, // 15 minutes
    warningThreshold: 3 * 60, // 3 minutes remaining
    dangerThreshold: 60, // 1 minute remaining
};

export const useTalkTimer = () => {
    const [config, setConfig] = useState<TimerConfig>(DEFAULT_CONFIG);
    const [status, setStatus] = useState<TimerStatus>('idle');
    const [remainingTime, setRemainingTime] = useState(config.duration);

    const timerRef = useRef<number | null>(null);
    const lastTickRef = useRef<number>(0);

    // Calculate zone based on current remaining time and config
    const getZone = (seconds: number): TimerZone => {
        if (seconds <= 0) return 'overtime';
        if (seconds <= config.dangerThreshold) return 'danger';
        if (seconds <= config.warningThreshold) return 'warning';
        return 'safe';
    };

    const zone = getZone(remainingTime);

    const tick = useCallback(() => {
        const now = Date.now();
        const delta = (now - lastTickRef.current) / 1000;
        lastTickRef.current = now;

        setRemainingTime((prev) => {
            const newVal = prev - delta;

            // Check for completion/overtime transitions if needed
            // Logic for sounds/haptics can hook into effect based on zone change

            return newVal;
        });
    }, []);

    const start = useCallback(() => {
        if (status === 'running') return;

        // If starting from idle, reset remaining to duration
        if (status === 'idle') {
            setRemainingTime(config.duration);
        }

        setStatus('running');
        lastTickRef.current = Date.now();

        timerRef.current = window.setInterval(tick, 100); // Update frequently for smooth time, but 100ms is enough
    }, [status, config.duration, tick]);

    const pause = useCallback(() => {
        if (status !== 'running') return;
        setStatus('paused');
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, [status]);

    const reset = useCallback(() => {
        pause();
        setStatus('idle');
        setRemainingTime(config.duration);
    }, [pause, config.duration]);

    const updateConfig = useCallback((newConfig: Partial<TimerConfig>) => {
        setConfig((prev) => {
            const next = { ...prev, ...newConfig };
            // If idle, update displayed time immediately
            if (status === 'idle') {
                setRemainingTime(next.duration);
            }
            return next;
        });
    }, [status]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    return {
        remainingTime,
        status,
        zone,
        config,
        start,
        pause,
        reset,
        updateConfig
    };
};
