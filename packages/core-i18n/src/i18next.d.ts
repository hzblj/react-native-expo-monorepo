// Types `t` from the English resource — https://www.i18next.com/overview/typescript
import 'i18next'

import type en from './languages/en.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: typeof en
    }
  }
}
