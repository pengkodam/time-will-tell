# CLAUDE.md

This file provides guidance for working with the Time Will Tell web application.

## Build Commands

All commands should be run from the `web-app` directory:
- `npm install`: Install dependencies.
- `npm run dev`: Start development server.
- `npm run build`: Build for production.
- `npm run lint`: Run ESLint.
- `npm run preview`: Preview production build locally.

## Architecture

This is a React web application built with TypeScript and Vite.

**Core Components:**
- `App.tsx`: Main application component, handles UI and side effects (sounds, haptics, wake lock).
- `hooks/useTalkTimer.ts`: Core timer logic using a custom hook. Manages time, status, and zones.
- `utils/time.ts`: Helper for formatting seconds into MM:SS.

**Timer Zones:**
The timer transitions through color-coded zones based on remaining time:
- Safe (Black)
- Warning (Yellow)
- Danger (Red)
- Overtime (Flashing Red/White)

**Web APIs used:**
- `navigator.vibrate`: For haptic feedback.
- `Audio`: For the gong sound.
- `Screen Wake Lock API`: To keep the screen awake.

## Code Style

- React with Functional Components and Hooks.
- TypeScript for type safety.
- CSS variables for theme colors (defined in `index.css`).
- Linting with ESLint (`npm run lint`).
