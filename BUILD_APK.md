# Guide pour générer l'APK Android

## Prérequis

1. **Node.js** (déjà installé)
2. **Java JDK 11 ou supérieur**
   ```bash
   # Vérifier l'installation
   java -version
   ```
3. **Android Studio** (pour le SDK Android)
   - Télécharger depuis : https://developer.android.com/studio
   - Installer Android SDK (API 33 minimum)
   - Configurer les variables d'environnement :
     ```bash
     export ANDROID_HOME=$HOME/Android/Sdk
     export PATH=$PATH:$ANDROID_HOME/emulator
     export PATH=$PATH:$ANDROID_HOME/tools
     export PATH=$PATH:$ANDROID_HOME/tools/bin
     export PATH=$PATH:$ANDROID_HOME/platform-tools
     ```

## Étapes pour générer l'APK

### 1. Installer les dépendances Capacitor

```bash
npm install
```

### 2. Build l'application Next.js

```bash
npm run build
```

### 3. Synchroniser avec Capacitor

```bash
npx cap sync android
```

### 4. Ouvrir dans Android Studio

```bash
npx cap open android
```

### 5. Générer l'APK dans Android Studio

1. Dans Android Studio, allez dans **Build > Build Bundle(s) / APK(s) > Build APK(s)**
2. Attendez la fin de la compilation
3. L'APK sera généré dans : `android/app/build/outputs/apk/debug/app-debug.apk`

### Alternative : Générer l'APK en ligne de commande

```bash
cd android
./gradlew assembleDebug
```

L'APK sera dans : `android/app/build/outputs/apk/debug/app-debug.apk`

## Générer un APK signé (pour publication)

1. Créer une clé de signature :
```bash
keytool -genkey -v -keystore depenses-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias depenses
```

2. Configurer le fichier `android/app/build.gradle` avec les informations de signature

3. Générer l'APK signé :
```bash
cd android
./gradlew assembleRelease
```

L'APK signé sera dans : `android/app/build/outputs/apk/release/app-release.apk`

## Notes importantes

- L'application s'exécute dans le navigateur. Le support d'installation native ou hors-ligne n'est pas activé.
- Les données sont stockées localement (localStorage)
- L'APK généré fonctionnera comme une application native Android
- Pour tester, vous pouvez installer l'APK directement sur un appareil Android

## Dépannage

Si vous rencontrez des erreurs :
1. Vérifiez que Android SDK est correctement installé
2. Vérifiez les variables d'environnement ANDROID_HOME
3. Assurez-vous que Java JDK est installé
4. Vérifiez que le build Next.js s'est bien terminé

