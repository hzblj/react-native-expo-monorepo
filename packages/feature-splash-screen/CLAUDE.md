# feature-splash-screen

The animated hand-off from the native splash screen to the app. Named for what it is — a splash
screen — not for an abstract "app loader".

## Map

| File | What it is |
| --- | --- |
| `src/SplashScreen/SplashScreen.tsx` | Calls `preventAutoHideAsync()` at module scope, renders the themed splash icon over the app, and runs the Reanimated exit (rotate → scale → fade) before unmounting itself. |

## Rules

**It renders on top of the app, inside `Providers`** — the root layout mounts it as a sibling of the
navigation stack, so the tree behind it is already mounted while the animation plays.

**`preventAutoHideAsync()` runs at import time, deliberately** — waiting for an effect would let the
native splash disappear first and flash the empty app.

**The static side must stay in sync**: the icons and background colours here come from
`core-resources` + Kara's theme, and must match the `expo-splash-screen` plugin config in
`apps/expo-demo/app.config.ts`. Changing one without the other produces a visible jump.

Animation values follow Kara's `duration` tokens from `~/core.ui` where the scale has the step; the spin is
the hand-off's own choreography and keeps its own constants. The animated layers are Kara's `Box`, which turns into
an `Animated.View` when it gets an animated `style`.
