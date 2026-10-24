import ExpoStorageModule from 'expo-storage'
import {createMMKV} from 'react-native-mmkv'
import {createJSONStorage, PersistStorage} from 'zustand/middleware'

/** Both values are 32 characters of device-generated randomness — MMKV's maximum under AES-256. */
export const storage = createMMKV({
  encryptionKey: ExpoStorageModule.getEncryptionKey(),
  encryptionType: 'AES-256',
  id: ExpoStorageModule.getStorageKey(),
  mode: 'single-process',
  readOnly: false,
})

type TaggedValue =
  | {__type: 'Date'; value: string}
  | {__type: 'Map'; value: Record<string, unknown>}
  | {__type: 'Set'; value: unknown[]}

const isTaggedValue = (value: unknown): value is TaggedValue =>
  typeof value === 'object' && value !== null && '__type' in value

function replacer(this: Record<string, unknown>, key: string, value: unknown): unknown {
  const original = this[key]

  if (original instanceof Date) {
    return {__type: 'Date', value: original.toISOString()} satisfies TaggedValue
  }

  if (value instanceof Map) {
    return {__type: 'Map', value: Object.fromEntries(value)} satisfies TaggedValue
  }

  if (value instanceof Set) {
    return {__type: 'Set', value: Array.from(value)} satisfies TaggedValue
  }

  return value
}

const reviver = (_: string, value: unknown): unknown => {
  if (!isTaggedValue(value)) {
    return value
  }

  switch (value.__type) {
    case 'Date':
      return new Date(value.value)
    case 'Map':
      return new Map(Object.entries(value.value))
    case 'Set':
      return new Set(value.value)
  }
}

export const createCustomStorage = <S>(): PersistStorage<S> | undefined =>
  createJSONStorage(
    () => ({
      getItem: (name: string) => storage.getString(name) || null,
      removeItem: (name: string) => {
        storage.remove(name)
      },
      setItem: (name: string, value: string) => storage.set(name, value),
    }),
    {replacer, reviver}
  )
