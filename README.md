# Time Will Tell

A simple web app to help speakers track their remaining time with color-coded visual warnings. This is a web port of [hadley/time-will-tell](https://github.com/hadley/time-will-tell).

## Features

- **Large countdown display**: Highly visible from across the room.
- **Color-coded backgrounds**:
  - **Black**: Safe zone - plenty of time remaining.
  - **Yellow**: Warning - approaching the end.
  - **Red**: Danger - wrap it up!
  - **Flashing**: Time's up!
- **Audio Alerts**: Gong sound plays when time is up.
- **Haptic Feedback**: Vibration alerts on supported devices when entering warning zones.
- **Screen Wake Lock**: Keeps the screen awake during the countdown (on supported browsers).
- **Fully Configurable**: Set your total talk duration and warning/danger thresholds.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- npm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Technology Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Deployment**: Optimized for Vercel

## Credits

Gong sound by [juskiddink](https://freesound.org/people/juskiddink/) from [Freesound](https://freesound.org/people/juskiddink/sounds/86773/), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
