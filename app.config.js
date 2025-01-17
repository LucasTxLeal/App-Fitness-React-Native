export default {
  name: 'AppFitness',
  slug: 'appfitness',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF'
    }
  },
  web: {
    favicon: './assets/favicon.png'
  },
  extra: {
    apiUrl: process.env.API_URL || 'http://192.168.0.215:3000/api',
  },
  plugins: [
    [
      "expo-build-properties",
      {
        "android": {
          "newArchEnabled": true
        },
        "ios": {
          "newArchEnabled": true
        }
      }
    ]
  ]
};

