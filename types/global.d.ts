// Déclaration des types globaux

interface Window {
  // Propriété utilisée pour la détection iOS
  MSStream: any;
}

// Déclaration des types pour le beforeinstallprompt
declare global {
  interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
      outcome: 'accepted' | 'dismissed';
      platform: string;
    }>;
    prompt(): Promise<void>;
  }

  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export {};
