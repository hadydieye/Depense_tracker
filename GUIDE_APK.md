# 📱 Guide complet pour générer l'APK Android

## Méthode 1 : Utiliser Capacitor (Recommandé)

### Prérequis

1. **Node.js** (déjà installé ✅)
2. **Java JDK 11+**
   ```bash
   # Installer sur Linux (Kali/Debian)
   sudo apt update
   sudo apt install openjdk-11-jdk
   
   # Vérifier
   java -version
   ```
3. **Android Studio** (optionnel mais recommandé)
   - Télécharger : https://developer.android.com/studio
   - Installer Android SDK (API 33 minimum)

### Installation automatique

```bash
# Rendre le script exécutable
chmod +x install-capacitor.sh

# Exécuter le script
./install-capacitor.sh
```

### Installation manuelle

```bash
# 1. Installer Capacitor
npm install --save-dev @capacitor/cli
npm install @capacitor/core @capacitor/app @capacitor/haptics @capacitor/keyboard @capacitor/status-bar @capacitor/android

# 2. Initialiser Capacitor
npx cap init "Gestionnaire de Dépenses" "com.artemis99.depenses" --web-dir="out"

# 3. Build l'application
npm run build

# 4. Ajouter Android
npx cap add android

# 5. Synchroniser
npx cap sync android
```

### Générer l'APK

#### Option A : Avec Android Studio (Recommandé)

```bash
# Ouvrir dans Android Studio
npm run android:open

# Dans Android Studio :
# 1. Build > Build Bundle(s) / APK(s) > Build APK(s)
# 2. L'APK sera dans : android/app/build/outputs/apk/debug/app-debug.apk
```

#### Option B : En ligne de commande

```bash
cd android
./gradlew assembleDebug

# L'APK sera dans : android/app/build/outputs/apk/debug/app-debug.apk
```

## Méthode 2 : Utiliser PWA Builder (Alternative simple)

Si Capacitor pose problème, vous pouvez utiliser PWA Builder :

1. Aller sur : https://www.pwabuilder.com/
2. Entrer l'URL de votre application déployée
3. Cliquer sur "Build My PWA"
4. Sélectionner "Android" et télécharger le package
5. Suivre les instructions pour générer l'APK

## Méthode 3 : Utiliser Bubblewrap (TWA - Trusted Web Activity)

```bash
# Installer Bubblewrap
npm install -g @bubblewrap/cli

# Initialiser
bubblewrap init --manifest=https://votre-domaine.com/manifest.json

# Build
bubblewrap build
```

## Configuration requise

### Variables d'environnement (si vous utilisez Android Studio)

Ajoutez dans `~/.bashrc` ou `~/.zshrc` :

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Puis rechargez :
```bash
source ~/.bashrc  # ou source ~/.zshrc
```

## Générer un APK signé (pour publication sur Play Store)

1. **Créer une clé de signature** :
```bash
keytool -genkey -v -keystore depenses-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias depenses
```

2. **Configurer dans `android/app/build.gradle`** :
```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('../depenses-release-key.jks')
            storePassword 'votre-mot-de-passe'
            keyAlias 'depenses'
            keyPassword 'votre-mot-de-passe'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

3. **Générer l'APK signé** :
```bash
cd android
./gradlew assembleRelease
```

L'APK signé sera dans : `android/app/build/outputs/apk/release/app-release.apk`

## Dépannage

### Erreur : "ANDROID_HOME not set"
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Erreur : "Java not found"
```bash
sudo apt install openjdk-11-jdk
```

### Erreur : "Gradle not found"
Le Gradle wrapper est inclus dans le projet Android généré par Capacitor.

### L'APK ne se génère pas
1. Vérifiez que `npm run build` s'est bien terminé
2. Vérifiez que `npx cap sync android` s'est bien terminé
3. Vérifiez les logs dans Android Studio

## Notes importantes

- ⚠️ L'application doit être buildée en mode export statique (déjà configuré)
- ⚠️ Le Service Worker fonctionnera dans l'APK
- ⚠️ Les données localStorage seront persistantes dans l'APK
- ⚠️ Pour tester, installez l'APK directement sur un appareil Android

## Structure après installation

```
/
├── android/              # Projet Android (généré par Capacitor)
│   ├── app/
│   │   └── build/
│   │       └── outputs/
│   │           └── apk/  # APK généré ici
│   └── ...
├── capacitor.config.ts   # Configuration Capacitor
└── out/                  # Build Next.js (utilisé par Capacitor)
```

## Support

Pour plus d'aide :
- Documentation Capacitor : https://capacitorjs.com/docs
- Documentation Android : https://developer.android.com/

