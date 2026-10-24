# feature-providers

The app's provider stack, in one place and in a fixed order. Mounted once by the root layout — everything else in the
app assumes these are above it.

## Map

| File | What it is |
| --- | --- |
| `src/Providers/Providers.tsx` | The stack: `GestureHandlerRootView` → `I18nextProvider` → `ThemeProviders` → `SafeAreaProvider`. Also fires the app-wide side-effect hooks (`useAppState`, `useOnlineManager`, `useDeviceInfo`). |
| `src/Providers/ThemeProvider.tsx` | `KaraProvider` with the stored `themePreference` (`light`/`dark`/`system`), and inside it expo-router's `ThemeProvider` fed with Kara's `navigationTheme`, so headers and tab bars take the same colours. |

## Rules

**Order is load-bearing.** Gesture handler must be outermost; `KaraProvider` must sit above anything using `sx` or a
theme token (which is every view) — it carries the theme, the active breakpoint and the reduced-motion preference.
The navigation theme sits *inside* it, because the system half of the palette is only resolvable there.

**The theme preference is applied natively, not only in React.** `KaraProvider` pins the platform appearance to the
preference (`overrideUserInterfaceStyle` on iOS, the default night mode on Android), so `PlatformColor`s in the React
Native tier and the SwiftUI/Compose hosts agree. Change it through `useDeviceStore.use.setThemePreference()`; never
call `Appearance.setColorScheme` yourself.

**The app's own theme (`defineTheme`: colour overrides, fonts, the Android seed, `dynamicColor`) goes to
`KaraProvider`'s `theme` prop here**, declared at module scope so it stays referentially stable. Without one, every
token keeps Kara's default and text is set in the platform's face.

**Mount exactly once, in the app's root layout.** A second mount duplicates the app-state and NetInfo listeners and
re-reads the device facts `useDeviceInfo` has already put in the store.

**A new global provider goes here**, not into a route layout — that is what makes this a feature and keeps `app/`
thin.
