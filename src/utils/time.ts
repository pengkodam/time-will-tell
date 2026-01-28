export const formatTime = (seconds: number): string => {
    const absSeconds = Math.abs(seconds);
    const m = Math.floor(absSeconds / 60);
    const s = Math.floor(absSeconds % 60);

    const sign = seconds < 0 ? '-' : '';
    const mm = m.toString().padStart(2, '0');
    const ss = s.toString().padStart(2, '0');

    return `${sign}${mm}:${ss}`;
};
