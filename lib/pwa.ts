// Install support removed — provide a noop hook to avoid import errors
"use client"

export function useInstall() {
  return {
    isInstallable: false,
    isInstalled: false,
    installApp: async () => false,
  }
}
