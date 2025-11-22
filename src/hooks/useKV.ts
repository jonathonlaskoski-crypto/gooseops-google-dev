import { useState, useCallback, Dispatch, SetStateAction } from 'react'

/**
 * LocalStorage-based replacement for GitHub Spark's useKV hook.
 * Provides the same API but uses browser localStorage instead of Spark's cloud KV storage.
 * 
 * This avoids authentication issues while maintaining persistence functionality.
 */
export function useKV<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
    // Create a prefixed key to avoid conflicts
    const storageKey = `gooseops-kv-${key}`

    // Initialize state from localStorage or use initial value
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(storageKey)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.warn(`[useKV] Failed to load key "${key}" from localStorage:`, error)
            return initialValue
        }
    })

    // Wrapped setter that syncs to localStorage
    const setValue: Dispatch<SetStateAction<T>> = useCallback((value) => {
        try {
            setStoredValue((prevValue) => {
                // Allow value to be a function (like useState)
                const valueToStore = value instanceof Function ? value(prevValue) : value

                // Save to localStorage
                try {
                    window.localStorage.setItem(storageKey, JSON.stringify(valueToStore))
                } catch (storageError) {
                    console.error(`[useKV] Failed to save key "${key}" to localStorage:`, storageError)
                }

                return valueToStore
            })
        } catch (error) {
            console.error(`[useKV] Failed to set key "${key}":`, error)
        }
    }, [storageKey, key])

    return [storedValue, setValue]
}
