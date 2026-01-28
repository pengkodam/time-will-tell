# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Time Will Tell is a talk timer web application.

## Build Commands

Install dependencies:
```bash
npm install
```

Start development server:
```bash
npm run dev
```

Build the project:
```bash
npm run build
```

Run linting:
```bash
npm run lint
```

## Architecture

This is a React application built with TypeScript and Vite.

**Core Components:**
- `App.tsx`: Main entry point and UI layout. Handles side effects like audio, haptics, and wake lock.
- `hooks/useTalkTimer.ts`: Core timer logic and state management.
- `utils/time.ts`: Formatting utilities for the timer display.

**Timer Zones:**
The timer transitions through color-coded zones based on remaining time:
- Safe (Black) -> Warning (Yellow) -> Danger (Red) -> Overtime (Flashing Red/White)

## Code Style

This project uses ESLint for code quality and follows standard React/TypeScript patterns.
