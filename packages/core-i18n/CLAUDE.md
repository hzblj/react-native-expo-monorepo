# core-i18n

i18next setup with English and Czech. The point of this package is that `t` is **typed from
`en.json`** — an unknown key is a compile error, not a silent runtime fallback.

## Map

| File | What it is |
| --- | --- |
| `src/languages/en.json` | The schema every other language is held to. |
| `src/languages/cs.json` | Czech, compiler-checked against `en.json`'s shape. |
| `src/const.ts` | `resources`, `fallbackLng`, and `lng` — the device language via `expo-localization`, falling back to English for locales the app does not ship. |
| `src/types.ts` | `localizationLanguages` (`as const`) and the `LocalizationLanguage` union derived from it. |
| `src/i18n.ts` | The initialised instance and the typed `changeLanguage`. |
| `src/useTranslation.ts` | The typed `useTranslation` wrapper features import. |
| `src/i18next.d.ts` | Module augmentation that gives i18next the key types. |

## Adding a language

1. Add `src/languages/<code>.json` with exactly `en.json`'s keys — a missing or extra key refuses to
   compile.
2. Register the code in `types.ts` (`localizationLanguages`) and the resource in `const.ts`.

Translations are edited by hand — there is no sync with an external service.
