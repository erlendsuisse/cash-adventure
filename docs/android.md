# Android app

The Android app wraps the same Vite build as the website, using Capacitor 7
(Capacitor 8 needs Node 22). App id: `com.erlendsuisse.cashadventure` - this
is permanent once published, so change it in `capacitor.config.ts` before the
first upload if you want a different one.

## Tools (already installed on this machine)

- Java 21: `~/opt/jdk-21*`
- Android SDK: `~/Android/Sdk` (platform 35, build tools)

## Everyday commands

| Command | What it does |
|---|---|
| `npm run android:sync` | Builds the game and copies it into `android/` |
| `npm run android:apk` | Builds a test APK: `android/app/build/outputs/apk/debug/app-debug.apk` |
| `npm run android:bundle` | Builds the release bundle (.aab) for Google Play (needs signing, below) |

Install the test APK on a phone: copy it over and open it (allow "install
unknown apps"), or with a USB cable and USB debugging on:
`~/Android/Sdk/platform-tools/adb install -r android/app/build/outputs/apk/debug/app-debug.apk`

## What is different in the app

- The narrator uses Android's own text-to-speech (`@capacitor-community/text-to-speech`),
  because Android's WebView has no Web Speech API.
- Fonts are bundled (no requests to Google), so the game works offline.
- Icons and launch screen come from `assets/logo.png`:
  `npx @capacitor/assets generate --android --iconBackgroundColor '#1f1a14' --splashBackgroundColor '#1f1a14'`
- Gambling was retold as skill contests (darts, arm-wrestling, a games hall)
  to keep the store age rating kid-friendly.

## Publishing to Google Play

1. Create a Google Play developer account ($25 once).
2. Create an upload key (keep it safe and backed up, never commit it):
   `~/opt/jdk-21*/bin/keytool -genkey -v -keystore ~/keys/cash-adventure-upload.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000`
3. Add signing to `android/app/build.gradle` (`signingConfigs.release` reading
   the keystore path and passwords from `~/.gradle/gradle.properties`), then
   run `npm run android:bundle`.
4. In the Play Console: create the app, fill in the content rating
   questionnaire (no gambling, mild cartoon peril), Families/target audience,
   data safety (no data collected), a privacy policy URL, store listing text,
   screenshots and the 512px icon (`assets/logo.png` scaled).
5. Upload the .aab to an internal testing track first, test on real devices,
   then promote to production.
