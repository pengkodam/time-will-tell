# Time Will Tell (Web)

A simple web application to help speakers track their remaining time with color-coded visual warnings. This is a port of the [original iOS app](https://github.com/hadley/time-will-tell).

## Features

- **Large countdown display**: Highly visible from across the room.
- **Color-coded backgrounds**:
  - **Black**: Safe zone - plenty of time remaining.
  - **Yellow**: Warning - approaching the end.
  - **Red**: Danger - wrap it up!
  - **Flashing**: Time's up!
- **Haptic vibration alerts**: Vibrates when entering warning zones (on supported devices/browsers).
- **Gong sound**: Optional gong sound when time is up.
- **Configurable**: Easily set talk duration and warning thresholds.
- **Screen Wake Lock**: Prevents the screen from dimming or locking during countdown (on supported browsers).
- **Mobile Friendly**: Designed to work well on mobile browsers.

## Getting Started

### Local Development

1. Navigate to the web-app directory:
   ```bash
   cd web-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
cd web-app
npm run build
```

The build artifacts will be in the `web-app/dist/` directory.

## Deployment

This app is optimized for deployment on [Vercel](https://vercel.com). When connecting your repository to Vercel, set the **Root Directory** to `web-app`. Vercel will then automatically detect the Vite configuration.

## Credits

- Original iOS app by [Hadley Wickham](https://github.com/hadley).
- Gong sound by [juskiddink](https://freesound.org/people/juskiddink/) from [Freesound](https://freesound.org/people/juskiddink/sounds/86773/), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
