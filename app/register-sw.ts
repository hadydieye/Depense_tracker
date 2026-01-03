'use client';

export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker enregistré avec succès:', registration.scope);
        })
        .catch(error => {
          console.error('Erreur lors de l\'enregistrement du ServiceWorker:', error);
        });
    });
  }
}