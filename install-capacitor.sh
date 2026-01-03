#!/bin/bash
# Script d'installation de Capacitor pour générer l'APK
# Développé par Artemis99 (Chef de projet) et scriptseinsei

echo "🚀 Installation de Capacitor pour Android..."

# Installer Capacitor
echo "📦 Installation des packages Capacitor..."
npm install --save-dev @capacitor/cli
npm install @capacitor/core @capacitor/app @capacitor/haptics @capacitor/keyboard @capacitor/status-bar @capacitor/android

# Initialiser Capacitor
echo "⚙️  Configuration de Capacitor..."
npx cap init "Gestionnaire de Dépenses" "com.artemis99.depenses" --web-dir="out"

# Build l'application
echo "🔨 Build de l'application Next.js..."
npm run build

# Ajouter la plateforme Android
echo "📱 Ajout de la plateforme Android..."
npx cap add android

# Synchroniser
echo "🔄 Synchronisation avec Android..."
npx cap sync android

echo "✅ Installation terminée !"
echo ""
echo "Pour ouvrir dans Android Studio :"
echo "  npm run android:open"
echo ""
echo "Pour générer l'APK :"
echo "  cd android && ./gradlew assembleDebug"

