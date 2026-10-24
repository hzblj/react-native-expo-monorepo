// Ambient globals shared by every workspace package.
//
// The Expo app gets these through its generated `expo-env.d.ts`; packages compile
// from their own directory and have no such entry point, so they pull the same
// declarations in here — `process.env` from Expo, `__DEV__` from React Native.

/// <reference types="expo/types" />
/// <reference types="react-native" />
