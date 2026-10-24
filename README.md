# React Native Expo Monorepo Starter

A Turborepo monorepo for Expo apps whose UI is [Kara](https://www.kara.janblazej.dev): **real SwiftUI and Jetpack
Compose views**, styled by one token-typed `sx` engine, so call sites never branch on platform and never write a raw
value.

Expo SDK 57 · React Native 0.86 · React 19.2 · Kara UI 0.13 · TypeScript 7 · Yarn 4 · Turborepo 2

## Getting started

```bash
yarn install
yarn ios:dev      # or: yarn android:dev — clean prebuild + run
```

After the first build, `yarn ios` / `yarn android` is enough until something native changes (a plugin, an icon, a
package with native code, `platform-secure-core`); then run the `:dev` variant again.

Prerequisites: Node 22+, Yarn 4 (via Corepack, pinned by `packageManager`), Xcode / Android Studio. Kara ships native
code, so the app needs a development build: Expo Go cannot run it.

## Scripts

| Command | What it does |
| --- | --- |
| `yarn start` | Metro with the dev client |
| `yarn ios` / `yarn android` | Run the demo app |
| `yarn ios:dev` / `yarn android:dev` | Clean prebuild + run |
| `yarn ios:preview` / `yarn android:preview` | Clean prebuild + run the preview stage |
| `yarn typecheck` | `tsc` per package |
| `yarn lint` / `yarn lint:fix` | Biome + `tsc` across the workspace |
| `yarn biome:check` / `yarn biome:fix` / `yarn format` | Lint / autofix / format |
| `yarn doctor` | `expo-doctor` on the app |
| `yarn clean` | Drop Turbo caches and the native projects |

Builds run through EAS: `yarn app build:development`, `build:preview`, per platform with `:ios` / `:android`. Stages
are `development`, `preview`, `production`, driven by `EXPO_PUBLIC_STAGE` and validated by `core-config` at startup.

## Structure

```
apps/expo-demo/          the only deployable target: routes, app.config.ts, native projects
packages/
  core-ui/               Kara, re-exported, plus the app's own components built from it
  core-store/            Zustand stores, persisted to encrypted MMKV
  core-hooks/            app state, connectivity, device info
  core-i18n/             i18next, typed from en.json
  core-config/           Zod-validated env config
  core-services/         Logger, Fetcher (nitro-fetch)
  core-resources/        shared images and the app's SVG icons
  feature-home/ -onboarding/ -splash-screen/ -providers/
  expo-storage/          local Expo native module (storage + encryption keys, install id)
  platform-secure-core/  Swift + Kotlin libraries, no JS
  core-expo-plugins/     TypeScript config plugins that link those libraries
types/                   ambient globals and the generated icon names
```

Dependencies point one way: `app → feature-* → core-*`. Features never import each other; shared code moves down.
Every package carries a `CLAUDE.md` with its file map and its rules.

## UI: Kara through `core-ui`

The design system is [`@hzblj/kara-ui`](https://www.npmjs.com/package/@hzblj/kara-ui): tokens, theme, the `sx` engine
and every component. The app reaches it through `~/core.ui` only, which re-exports Kara and is where the app's own
components live beside it, built from the same primitives. Biome rejects `@hzblj/kara-ui` (and `@expo/ui`) imported
anywhere else.

```tsx
import {Screen, Text, VStack} from '~/core.ui'

<Screen>
  <VStack bg="surface.primary" borderRadius="large" p="s16" shadow="card" wide>
    <Text variant="headline">Hello World</Text>
  </VStack>
</Screen>
```

Native views (`Text`, `VStack`, `Button`, …) render only inside a `Screen` or an `Island`; the `Box` and `Rn*`
components are plain React Native with the same `sx` props. Colours and type are the platform's by default. See the
[Kara docs](https://www.kara.janblazej.dev/docs) for every component, the tokens and the guides.

**Icons** are the app's own SVGs in `packages/core-resources/icons`. Kara's config plugin turns each into an iOS
asset-catalog image and an Android vector drawable at prebuild, and writes their names to `types/native-icons.d.ts`, so
`<Tabs.Screen icon="home" />` only type-checks for an icon that exists. No icon font.

## Networking

`Fetcher` in `~/core.services` wraps [`react-native-nitro-fetch`](https://fetch.margelo.com): a drop-in `fetch` on
URLSession (iOS) and Cronet (Android), with HTTP/2 and HTTP/3, plus prefetching for the next screen or the next app
launch.

```ts
const response = await Fetcher.fetch('https://api.example.com/items')
```

## Native security core

Secrets and crypto live in compiled Swift/Kotlin rather than the JS bundle, following
[Jacob Arvidsson's App.js 2025 talk](https://github.com/theurbancoder/secure-app-demo). `platform-secure-core` supplies
the MMKV storage id, the encryption key and an install id; `expo-storage` bridges them to JS. No key is a literal: each
is generated from the platform CSPRNG on first launch and kept in the iOS Keychain or under an Android Keystore master
key.

## Internationalization

English and Czech ship out of the box. `en.json` is the schema every other language is held to, and `t` is typed from
it: an unknown or missing key is a compile error, not a silent fallback. The device language is picked up at startup
via `expo-localization`, falling back to English.

## Code style

Biome (`@hzblj/biome-config` + its React Native preset): 2-space indent, 120 columns, single quotes, no semicolons,
sorted imports and object keys. TypeScript strict, named exports, `type` over `interface`.

## License

MIT.
