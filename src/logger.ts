export type TransitionEvent = {
  id: string
  eventType: string
  prevState: string | null
  newState: string
  timestampMs: number
  perfNow: number
  note?: string
}

export class Logger {
  private events: TransitionEvent[] = []

  append(evt: Omit<TransitionEvent, 'id'>) {
    const e: TransitionEvent = { id: String(this.events.length + 1), ...evt }
    this.events.push(e)
  }

  list() {
    return [...this.events]
  }

  clear() {
    this.events = []
  }

  exportJSON() {
    return JSON.stringify(this.events, null, 2)
  }
}
