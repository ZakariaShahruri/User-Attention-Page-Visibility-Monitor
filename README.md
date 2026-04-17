# Page Visibility Observability Demo

This is an educational demo showing how modern browsers expose visibility and focus signals and how they map to an explicit state model.

Quick start

1. Install dependencies:

```bash
npm install
```

2. Run dev server:

```bash
npm run dev
```

Open http://localhost:5173

What it does

- Listens to standard web APIs: `document.visibilitychange`, `window.focus`, `window.blur`, `pageshow`, and `pagehide`.
- Maintains an explicit page state: `VISIBLE_FOCUSED`, `VISIBLE_UNFOCUSED`, `HIDDEN`.
- Appends transitions to an append-only log with high-resolution timestamps (`performance.now()`) and wall-clock time.
- UI shows a real-time dashboard, chronological event timeline, export and clear options, and a simple visible time summary.

Limitations & Ethics

- This app only observes browser tab/window lifecycle and focus state. It cannot and does not attempt to read other applications or user content.
- Behavior may vary across browsers, OS, and window managers (e.g., macOS Spaces).

Files of interest

- `src/stateMachine.ts` — core evaluation logic and event wiring
- `src/logger.ts` — append-only event logger
- `src/App.tsx` — UI and controls

Real-world relevance

This demo helps explain signals used by analytics, power management, and accessibility features. It is intended for education and transparency.
# User-Attention-Page-Visibility-Monitor