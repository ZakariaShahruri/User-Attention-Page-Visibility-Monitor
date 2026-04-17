# Page Visibility Observability Demo

This is an educational demo showing how modern browsers expose visibility and focus signals and how they map to an explicit state model.

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Run dev server:

```bash
npm run dev
```

Open http://localhost:5173

## What It Does

- Listens to standard web APIs: `document.visibilitychange`, `window.focus`, `window.blur`, `pageshow`, and `pagehide`.
- Maintains an explicit page state: `VISIBLE_FOCUSED`, `VISIBLE_UNFOCUSED`, `HIDDEN`.
- Appends transitions to an append-only log with high-resolution timestamps (`performance.now()`) and wall-clock time.
- UI shows a real-time dashboard, chronological event timeline, export and clear options, and a simple visible time summary (approximate seconds the page has been visible).
- Uses BroadcastChannel (if supported) to mirror events across multiple tabs/windows of the same origin for cross-tab observability.

## Technologies

- **React 18** with TypeScript for the UI.
- **Vite** for fast development and build tooling.
- **CSS** with custom properties for theming and responsive design.

## Limitations and Ethics

- This app only observes browser tab/window lifecycle and focus state. It cannot and does not attempt to read other applications or user content.
- Behavior may vary across browsers, OS, and window managers (e.g., macOS Spaces).
- BroadcastChannel is not supported in all browsers (e.g., older versions).

## Files of Interest

- `src/stateMachine.ts` — core evaluation logic and event wiring
- `src/logger.ts` — append-only event logger
- `src/App.tsx` — UI and controls
- `src/styles.css` — styling with dark theme and state-based colors

## Real-World Relevance

This demo helps explain signals used by analytics, power management, and accessibility features. It is intended for education and transparency.