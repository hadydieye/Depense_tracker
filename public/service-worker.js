/* Background/offline behavior disabled.
  All offline/background-worker behavior removed from the project.
*/

// No operation.

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

// Gestion du clic sur les notifications
self.addEventListener('notificationclick', (event) => {
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

