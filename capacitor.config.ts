import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.drmoto.app',
  appName: 'DrMoto',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    },
    Filesystem: {
      permissions: ['photos']
    },
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#3880ff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    },
    appId: "com.tuempresa.tiendaonline",
  appName: "Tienda Online",
  webDir: "www",
  bundledWebRuntime: false,
  server: {
    "androidScheme": "https"
  },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#3880ff'
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true
    },
    App: {
      launchUrl: 'drmoto://app'
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  },
  plugins: {
    "Storage": {
      "group": "TiendaOnlineData"
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  },
  "android": {
    "buildOptions": {
      "keystorePath": "release-key.keystore",
      "keystoreAlias": "key-alias"
    },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true
  }
};

export default config;