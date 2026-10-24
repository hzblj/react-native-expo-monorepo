# core-resources

Static assets shared across packages. No code and no entry point — files are referenced by path, not imported from an
index.

## Map

| Path | What it is |
| --- | --- |
| `icons/` | The app's icons, one SVG per icon, the file name is the icon name. Kara's config plugin turns them into native assets at prebuild. |
| `png/` | Shared images — the light/dark splash icons used by `feature-splash-screen`. |

## Rules

**Reference images through the `~/core.resources/*` alias**, e.g. `require('~/core.resources/png/splash-icon-light.png')`.

**Icons are never imported.** `apps/expo-demo/app.config.ts` points `['@hzblj/kara-ui', {icons: {source}}]` at
`icons/`: at prebuild every SVG becomes a template image set in the iOS asset catalog and a vector drawable on Android,
and whenever the config is read (`expo start`, `expo prebuild`) their names are written to `types/native-icons.d.ts`.
Call sites name an icon (`<Tabs.Screen icon="home" />`, `<Icon name="home" />`) and an unknown name fails to compile.

**An SVG is paths only**: `<path>` elements in one `<svg>` with a numeric `viewBox`, optionally `fill-rule="evenodd"`.
Flatten groups, clips, masks and strokes before exporting — anything else fails the prebuild. The colour in the file is
ignored; the platform tints it. `<name>.ios.svg` / `<name>.android.svg` replace `<name>.svg` on one platform.

**A new or changed icon needs a clean prebuild** (`yarn ios:dev` / `yarn android:dev`): the assets are native
resources, so neither Metro nor an OTA update can add one.

The two current icons (`home`, `home-filled`) are Material Symbols, Apache 2.0.

The app sets text in the platform's face (SF Pro / Roboto), so there are no fonts here. An app face goes into a
`fonts/` folder, the `expo-font` plugin config and the theme's `fonts` (`defineTheme`) together.
