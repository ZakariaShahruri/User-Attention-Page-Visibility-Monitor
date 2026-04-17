import React, { useEffect, useMemo, useState } from 'react'
import { Logger } from './logger'
import { createStateMachine, PageState } from './stateMachine'

const logger = new Logger()

function download(filename: string, text: string) {
  const blob = new Blob([text], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function App() {
  const [, setTick] = useState(0)
  const [events, setEvents] = useState(() => logger.list())
  const [bcSupported] = useState(() => typeof window.BroadcastChannel !== 'undefined')

  const sm = useMemo(() => createStateMachine(logger, { onTransition: () => setEvents(logger.list()) }), [])

  useEffect(() => {
    sm.setup()

    // BroadcastChannel to mirror events across tabs
    let bc: BroadcastChannel | null = null
    if (bcSupported) {
      bc = new BroadcastChannel('page-visibility-demo')
      bc.onmessage = (m) => {
        if (m.data?.type === 'PING') {
          // ignore
        }
        // When other tab logs, re-read logger (we don't send events between tabs in this simple demo)
        setEvents(logger.list())
      }
    }

    // Periodic tick to update UI performance counter
    const id = setInterval(() => setTick((t) => t + 1), 1000)
    return () => {
      clearInterval(id)
      bc?.close()
    }
  }, [])

  const currentState = sm.getState() || 'HIDDEN'

  function handleClear() {
    logger.clear()
    setEvents(logger.list())
  }

  function handleExport() {
    download('visibility_events.json', logger.exportJSON())
  }

  function totalVisibleTime() {
    const ev = logger.list()
    let total = 0
    let lastVisibleStart: number | null = null
    for (const e of ev) {
      if (e.newState === 'VISIBLE_FOCUSED' || e.newState === 'VISIBLE_UNFOCUSED') {
        lastVisibleStart = lastVisibleStart ?? e.timestampMs
      } else if (e.newState === 'HIDDEN') {
        if (lastVisibleStart != null) {
          total += e.timestampMs - lastVisibleStart
          lastVisibleStart = null
        }
      }
    }
    // if still visible
    if (lastVisibleStart != null) total += Date.now() - lastVisibleStart
    return Math.round(total / 1000)
  }

  return (
    <div className="container">
      <header>
        <h1>Page Visibility Observability Demo</h1>
        <p className="muted">Shows how browser signals map to activity states.</p>
      </header>

      <section className="dashboard">
        <div className={`state-card ${currentState.toLowerCase()}`}>
          <div className="state-label">State</div>
          <div className="state-value">{currentState}</div>
        </div>

        <div className="controls">
          <button onClick={handleClear}>Clear Logs</button>
          <button onClick={handleExport}>Export Logs</button>
          <div className="summary">Visible seconds (approx): {totalVisibleTime()}</div>
          <div className="summary">BroadcastChannel: {bcSupported ? 'available' : 'not available'}</div>
        </div>
      </section>

      <section>
        <h2>Event Timeline</h2>
        <div className="timeline">
          {events.length === 0 && <div className="muted">No events yet — interact with the page (switch tabs, minimize, blur).</div>}
          {events.map((e) => (
            <div className="event" key={e.id}>
              <div className="ev-time">{new Date(e.timestampMs).toLocaleTimeString()}</div>
              <div className="ev-body">
                <strong>{e.eventType}</strong>
                <div className="ev-details">{e.prevState} → {e.newState}</div>
                <div className="ev-note">{e.note}</div>
                <div className="ev-meta">perf: {Math.round(e.perfNow)} ms</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="ethics">
        <h3>Ethics & Limitations</h3>
        <ul>
          <li>This demo only observes browser-level state (visibility, focus, lifecycle).</li>
          <li>It cannot detect or read activity in other applications or windows.</li>
          <li>Behavior can vary across browsers and OS (e.g. macOS Spaces).</li>
        </ul>
      </section>
    </div>
  )
}
