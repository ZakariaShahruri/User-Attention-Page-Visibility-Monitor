import { Logger } from './logger'

export type PageState = 'VISIBLE_FOCUSED' | 'VISIBLE_UNFOCUSED' | 'HIDDEN'

type Handlers = {
  onTransition?: (prev: PageState | null, next: PageState, reason: string) => void
}

export function createStateMachine(logger: Logger, handlers: Handlers = {}) {
  let current: PageState | null = null

  function nowPerf() {
    return performance.now()
  }

  function emit(prev: PageState | null, next: PageState, reason: string) {
    logger.append({
      eventType: 'STATE_TRANSITION',
      prevState: prev,
      newState: next,
      timestampMs: Date.now(),
      perfNow: nowPerf(),
      note: reason,
    })
    handlers.onTransition?.(prev, next, reason)
  }

  function evaluate() {
    const vis = document.visibilityState // 'visible' or 'hidden'
    const hasFocus = document.hasFocus()
    const next: PageState = vis === 'hidden' ? 'HIDDEN' : hasFocus ? 'VISIBLE_FOCUSED' : 'VISIBLE_UNFOCUSED'
    if (next !== current) {
      const prev = current
      current = next
      emit(prev, next, `visibility=${vis} focus=${hasFocus}`)
    }
  }

  // Attach listeners
  function setup() {
    // visibility
    document.addEventListener('visibilitychange', () => evaluate())
    // focus/blur at window level
    window.addEventListener('focus', () => evaluate())
    window.addEventListener('blur', () => evaluate())
    // page lifecycle
    window.addEventListener('pageshow', () => evaluate())
    window.addEventListener('pagehide', () => evaluate())
    // initial evaluation
    evaluate()
  }

  function getState() {
    return current
  }

  return { setup, getState, evaluate }
}
