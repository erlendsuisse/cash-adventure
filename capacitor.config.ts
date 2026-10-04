import type { CapacitorConfig } from '@capacitor/cli'

// The Android (and later iOS) app wraps the same Vite build that the web version serves.
const config: CapacitorConfig = {
  appId: 'com.erlendsuisse.cashadventure', // permanent once published on Google Play
  appName: 'Cash Adventure',
  webDir: 'dist',
  android: {
    backgroundColor: '#1f1a14',
  },
}

export default config
