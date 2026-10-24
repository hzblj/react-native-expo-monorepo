# core-ui

The UI domain. Kara (`@hzblj/kara-ui`) is the design system — tokens, theme, the `sx` engine, every component and the
router pieces — and this package is the one door to it: it re-exports Kara, and it is where the app's own components
live beside it.

## Map

| Path | What it is |
| --- | --- |
| `src/index.ts` | `export * from '@hzblj/kara-ui'` and `'@hzblj/kara-ui/router'` (`Tabs`, `navigationTheme`, `ZoomTransition`), then the app's own components. |

## Rules

**Features import UI from `~/core.ui`, never from Kara.** Biome enforces it everywhere outside this package. One import
path means a Kara component can be wrapped, replaced or extended here without touching a call site.

**Build from Kara's primitives, not around them.** An own component composes Kara's atoms and takes `sx` props and
theme tokens (`useAppTheme`, `duration`, `easing`), so it reads as part of the same system on both platforms. Reach for
`@hzblj/kara-ui/swift-ui` / `jetpack-compose` or `@expo/ui` only for a native view Kara does not have, and only here.

**Name it so it cannot shadow Kara.** `export *` lets a local export of the same name silently win; pick a distinct
name, or re-export Kara's under another one on purpose.

**A component moves here once a second feature needs it.** Until then it lives in the feature's own folder.

**Native views need a host.** Anything built on Kara's native tier renders only inside `Screen` or `Island`; the
React Native tier (`Box`, `Rn*`) needs none. Document which one a component is.

The [Kara docs](https://www.kara.janblazej.dev/docs) cover every component, the tokens and the theming guide.
