/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope

export {}

// Déclaration des types manquants
declare global {
  interface ServiceWorkerGlobalScope {
    __WB_MANIFEST: Array<string>
    __WB_DISABLE_DEV_LOGS: boolean
    skipWaiting(): Promise<void>
    clients: {
      claim(): Promise<void>
      matchAll(options?: { includeUncontrolled?: boolean; type?: ClientTypes }): Promise<ReadonlyArray<Client>>
      openWindow(url: string): Promise<WindowClient | null>
      get(id: string): Promise<any>
    }
  }

  interface ExtendableEvent extends Event {
    waitUntil(promise: Promise<any>): void
  }

  interface FetchEvent extends ExtendableEvent {
    readonly clientId: string
    readonly preloadResponse: Promise<any>
    readonly request: Request
    readonly resultingClientId: string
    respondWith(r: Response | Promise<Response>): void
  }

  interface ExtendableMessageEvent extends ExtendableEvent {
    data: any
    lastEventId: string
    origin: string
    ports: ReadonlyArray<MessagePort>
    source: Client | ServiceWorker | MessagePort | null
  }
}
