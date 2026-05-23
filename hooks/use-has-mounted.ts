import { useSyncExternalStore } from "react"

// React 19 lints against `setState` in `useEffect`, so we can't use the
// classic `useState(false) + useEffect(setMounted(true))` mount-detection
// pattern. `useSyncExternalStore` is the supported alternative: returns false
// on the server render, true on the client render — no setState anywhere.
const emptySubscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

export function useHasMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot
  )
}
