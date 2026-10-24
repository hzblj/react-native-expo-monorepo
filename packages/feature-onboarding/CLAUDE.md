# feature-onboarding

The first-run screen. It owns the one piece of state that decides which half of the app a user can
reach.

## Map

| File | What it is |
| --- | --- |
| `src/Onboarding/Onboarding.tsx` | The screen; its button calls `setOnboarding('completed')` on the user store. |

## Rules

**Completion is a store write, not navigation.** The root layout gates its route groups on
`useUserStore.use.onboarding()` — `start` shows `(public)`, `completed` shows `(protected)`. Calling
`router.replace` here instead would fight that guard.

**The flag is persisted**, so changing the shape of `onboardingSlice` needs a `USER_STORE_VERSION`
bump in `core-store`.

Compose from `core-*` only; the route file in `app/(public)/index.tsx` stays a one-line re-export.
