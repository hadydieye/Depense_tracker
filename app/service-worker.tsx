/// <reference lib="webworker" />
/**
 * Service Worker pour l'application de gestion de dépenses
 * Gère le cache, les notifications push et le mode hors ligne
 * Développé par Artemis99 (Chef de projet) et scriptseinsei
 */

declare const self: ServiceWorkerGlobalScope

const CACHE_NAME = 'expense-tracker-v3'
const CACHE_ASSETS = [
  '/',
  '/expenses',
  '/budgets',
  '/analytics',
  '/settings',
  '/manifest.json',
  '/icon-192.jpg',
  '/icon-512.jpg',
  '/favicon.jpg'
]

// Installation du Service Worker
self.addEventListener('install', (event: ExtendableEvent) => {
  const onInstall = async () => {
    try {
      const cache = await caches.open(CACHE_NAME)
      console.log('Cache ouvert :', CACHE_NAME)
      await cache.addAll(CACHE_ASSETS)
      await self.skipWaiting()
      console.log('Service Worker installé avec succès')
    } catch (error) {
      console.error('Erreur lors de l\'installation du Service Worker:', error)
      throw error
    }
  }

  event.waitUntil(onInstall())
})

// Activation du Service Worker
self.addEventListener('activate', (event: ExtendableEvent) => {
  const onActivate = async () => {
    try {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression de l\'ancien cache :', cacheName)
            return caches.delete(cacheName)
          }
          return null
        }).filter(Boolean)
      )
      await self.clients.claim()
      console.log('Service Worker activé avec succès')
    } catch (error) {
      console.error('Erreur lors de l\'activation du Service Worker:', error)
      throw error
    }
  }

  event.waitUntil(onActivate())
})

// Gestion des requêtes réseau
self.addEventListener('fetch', (event: FetchEvent) => {
  // Ignorer les requêtes non-GET et les requêtes de développement
  if (event.request.method !== 'GET' || 
      event.request.url.includes('chrome-extension') || 
      event.request.url.includes('sockjs-node') ||
      (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin')) {
    return
  }

  const onFetch = async () => {
    try {
      // Essayer de récupérer depuis le cache d'abord
      const cachedResponse = await caches.match(event.request)
      if (cachedResponse) {
        return cachedResponse
      }

      // Sinon, faire la requête réseau
      const response = await fetch(event.request)
      
      // Vérifier si la réponse est valide
      if (!response || response.status !== 200 || response.type !== 'basic') {
        return response
      }

      // Mettre en cache la réponse pour les requêtes réussies
      const responseToCache = response.clone()
      const cache = await caches.open(CACHE_NAME)
      cache.put(event.request, responseToCache)
      
      return response
    } catch (error) {
      console.error('Erreur lors de la récupération des ressources:', error)
      // En cas d'erreur, on peut essayer de retourner une page de secours
      // ou une réponse personnalisée si nécessaire
      return new Response('Ressource non disponible hors ligne', {
        status: 408,
        statusText: 'Hors ligne',
        headers: { 'Content-Type': 'text/plain' }
      })
    }
  }

  event.respondWith(onFetch())
})

// Gestion de l'installation de l'application
self.addEventListener('beforeinstallprompt', (event: Event) => {
  // Empêcher l'affichage du prompt d'installation par défaut
  event.preventDefault()
  
  // Envoyer un message au client pour afficher notre propre bouton d'installation
  const notifyClient = async () => {
    try {
      const clients = await self.clients.matchAll()
      clients.forEach(client => {
        client.postMessage({
          type: 'CAN_INSTALL_APP',
          deferredPrompt: true
        })
      })
    } catch (error) {
      console.error('Erreur lors de la notification du client:', error)
    }
  }
  
  notifyClient()
})

// Gestion des messages du client
self.addEventListener('message', (event: ExtendableMessageEvent) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  // Gestion des notifications push depuis le client
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, icon, tag } = event.data
    self.registration.showNotification(title, {
      body,
      icon: icon || '/icon-192.jpg',
      badge: '/icon-192.jpg',
      tag: tag || 'budget-alert',
      requireInteraction: false,
      silent: false,
    })
  }
})

// Gestion des notifications push
self.addEventListener('push', (event: PushEvent) => {
  if (!event.data) return

  const data = event.data.json()
  const title = data.title || 'Gestionnaire de Dépenses'
  const options: NotificationOptions = {
    body: data.body || 'Nouvelle notification',
    icon: data.icon || '/icon-192.jpg',
    badge: '/icon-192.jpg',
    tag: data.tag || 'notification',
    requireInteraction: false,
    silent: false,
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

// Gestion du clic sur les notifications
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close()

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      // Si une fenêtre est déjà ouverte, on la focus
      for (const client of clients) {
        if (client.url === self.location.origin && 'focus' in client) {
          return client.focus()
        }
      }
      // Sinon, on ouvre une nouvelle fenêtre
      if (self.clients.openWindow) {
        return self.clients.openWindow('/')
      }
    })
  )
})
