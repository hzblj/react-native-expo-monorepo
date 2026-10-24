export const consoleLog = {
  debug: (...args: any[]) => {
    if (!__DEV__) {
      return
    }
    console.debug(...args)
  },
  error: (...args: any[]) => {
    if (!__DEV__) {
      return
    }
    console.error(...args)
  },
  info: (...args: any[]) => {
    if (!__DEV__) {
      return
    }
    console.info(...args)
  },
  json: (...args: any[]) => {
    if (!__DEV__) {
      return
    }
    console.log(JSON.stringify(args, null, 2))
  },
  log: (...args: any[]) => {
    if (!__DEV__) {
      return
    }
    console.log(...args)
  },
  tag:
    (tag: string) =>
    (...args: any[]) => {
      if (!__DEV__) {
        return
      }
      console.log(`[${tag}]:`, ...args)
    },
  warn: (...args: any[]) => {
    if (!__DEV__) {
      return
    }
    console.warn(...args)
  },
}
