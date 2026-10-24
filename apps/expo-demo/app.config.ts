import {ExpoConfig} from 'expo/config'

/**
 * Expo transpiles this file on its own and infers CommonJS from the emitted code. Type-only imports
 * are erased, so they keep it CommonJS — a value `import` would flip it to ESM, where importing JSON
 * needs an import attribute. Hence the `require` for the version.
 */
const packageJson = require('./package.json')

type Stage = 'development' | 'preview' | 'production'

const STAGE = (process.env.EXPO_PUBLIC_STAGE ?? 'production') as Stage
const APP_NAME = 'Expo demo'
const SCHEME = 'com.expo.demo'
const SPLASH_BACKGROUND_LIGHT = '#ffffff'
const SPLASH_BACKGROUND_DARK = '#000000'

const assets = (stage: Stage) => ({
  dark: `./assets/${stage}/ios-dark.png`,
  foregroundImage: `./assets/${stage}/adaptive-icon.png`,
  icon: `./assets/${stage}/ios-light.png`,
  splashImageDark: `./assets/${stage}/splash-icon-dark.png`,
  splashImageLight: `./assets/${stage}/splash-icon-light.png`,
  tinted: `./assets/${stage}/ios-tinted.png`,
})

const envConfig: {
  [key: string]: {
    scheme: string
    icon: string
    dark: string
    tinted: string
    splashImageLight: string
    splashImageDark: string
    foregroundImage: string
    name: string
  }
} = {
  development: {
    ...assets('development'),
    name: `[Development]: ${APP_NAME}`,
    scheme: `${SCHEME}.development`,
  },
  preview: {
    ...assets('preview'),
    name: `[PREVIEW]: ${APP_NAME}`,
    scheme: `${SCHEME}.preview`,
  },
  production: {
    ...assets('production'),
    name: APP_NAME,
    scheme: SCHEME,
  },
}

const config = envConfig[STAGE]
const version = packageJson.version

export default {
  android: {
    adaptiveIcon: {
      backgroundColor: SPLASH_BACKGROUND_LIGHT,
      foregroundImage: config.foregroundImage,
      monochromeImage: config.foregroundImage,
    },
    package: config.scheme,
  },
  experiments: {
    typedRoutes: true,
  },
  icon: config.icon,
  ios: {
    bundleIdentifier: config.scheme,
    icon: {
      dark: config.dark,
      light: config.icon,
      tinted: config.tinted,
    },
    infoPlist: {
      CADisableMinimumFrameDurationOnPhone: true,
    },
    supportsTablet: false,
  },
  name: 'expo-demo',
  orientation: 'portrait',
  plugins: [
    'expo-router',
    'expo-localization',
    'expo-image',
    // The app's icons: every SVG in core-resources/icons becomes an iOS asset-catalog image and an Android vector
    // drawable at prebuild, and its name a type in types/native-icons.d.ts.
    [
      '@hzblj/kara-ui',
      {icons: {source: '../../packages/core-resources/icons', types: '../../types/native-icons.d.ts'}},
    ],
    'react-native-nitro-fetch',
    [
      'expo-splash-screen',
      {
        backgroundColor: SPLASH_BACKGROUND_LIGHT,
        dark: {
          backgroundColor: SPLASH_BACKGROUND_DARK,
          image: config.splashImageDark,
        },
        image: config.splashImageLight,
        imageWidth: 200,
        resizeMode: 'contain',
      },
    ],
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
        },
      },
    ],
    [
      'core-expo-plugins/ios-add-pods',
      {
        modules: [
          {
            name: 'SecureCore',
            path: '../../../packages/platform-secure-core/swift-secure-core',
          },
        ],
      },
    ],
    'core-expo-plugins/android-main-application',
    [
      'core-expo-plugins/android-app-build-gradle',
      {
        implementations: [
          'implementation("io.insert-koin:koin-core")',
          'implementation("io.insert-koin:koin-android:4.0.4")',
          'implementation project(":kotlin-secure-core")',
        ],
      },
    ],
    [
      'core-expo-plugins/android-settings-gradle',
      {
        modules: [
          {
            name: 'kotlin-secure-core',
            path: '../../../packages/platform-secure-core/kotlin-secure-core',
          },
        ],
      },
    ],
  ],
  scheme: config.scheme,
  slug: 'expo-demo',
  userInterfaceStyle: 'automatic',
  version,
} as ExpoConfig
