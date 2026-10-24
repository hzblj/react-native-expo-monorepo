module.exports = function (api) {
  api.cache(true)

  return {
    env: {
      production: {
        plugins: ['transform-remove-console'],
      },
    },
    // babel-preset-expo auto-injects react-native-worklets/plugin (Reanimated 4) when installed.
    presets: [['babel-preset-expo', {jsxRuntime: 'automatic'}]],
  }
}
