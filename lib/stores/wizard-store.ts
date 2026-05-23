import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { WizardAvatarId } from "@/lib/data/wizard-avatars"
import type { WizardRaceId } from "@/lib/data/wizard-races"

export type Wizard = {
  race: WizardRaceId
  avatarId: WizardAvatarId
  name: string
  createdAt: number
}

type WizardState = {
  wizard: Wizard | null
  // Once `true`, the landing-hero is hidden forever — the user has agreed
  // to enter the library and we go straight to wizard creation / dashboard.
  hasSeenLanding: boolean
  // AI-generated identity portrait + the input fingerprint that produced it.
  essence: string | null
  essenceKey: string | null
  createWizard: (input: Omit<Wizard, "createdAt">) => void
  seeLanding: () => void
  setEssence: (description: string, key: string) => void
  clearEssence: () => void
  resetWizard: () => void
}

export const useWizardStore = create<WizardState>()(
  persist(
    (set) => ({
      wizard: null,
      hasSeenLanding: false,
      essence: null,
      essenceKey: null,
      createWizard: (input) =>
        set({
          wizard: { ...input, createdAt: Date.now() },
          // Creating a wizard implicitly means the user has moved past the
          // landing screen — keep the flag in sync.
          hasSeenLanding: true,
          essence: null,
          essenceKey: null,
        }),
      seeLanding: () => set({ hasSeenLanding: true }),
      setEssence: (description, key) =>
        set({ essence: description, essenceKey: key }),
      clearEssence: () => set({ essence: null, essenceKey: null }),
      // Retiring a wizard keeps `hasSeenLanding` true — the user already
      // knows what the app is, no need to re-pitch them.
      resetWizard: () => set({ wizard: null, essence: null, essenceKey: null }),
    }),
    { name: "leaply-wizard" }
  )
)
