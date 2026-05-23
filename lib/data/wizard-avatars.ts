// Hand-drawn portraits live in `/public/avatars/{id}.png` and are referenced
// here by id. Filenames must match exactly — see public/avatars/README.md.
export const WIZARD_AVATARS = [
  {
    id: "witch-violet",
    src: "/avatars/witch-violet.png",
    label: "The Violet Witch",
  },
  {
    id: "elf-mage",
    src: "/avatars/elf-mage.png",
    label: "The Starry Elf",
  },
  {
    id: "cat-sage",
    src: "/avatars/cat-sage.png",
    label: "The Gray Cat Sage",
  },
  {
    id: "cat-shadow",
    src: "/avatars/cat-shadow.png",
    label: "The Black Cat Mage",
  },
] as const

export type WizardAvatar = (typeof WIZARD_AVATARS)[number]
export type WizardAvatarId = WizardAvatar["id"]
