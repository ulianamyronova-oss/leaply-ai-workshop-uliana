// The six "races" the user can pick at character creation. Mapped to
// real IT/product roles plus a fantasy title so the workshop voters
// recognize themselves on the screen.
export const WIZARD_RACES = [
  {
    id: "designer",
    label: "Designer",
    title: "The Illuminator",
    essence: "Shapes form and feel into being",
  },
  {
    id: "developer",
    label: "Developer",
    title: "The Codecaster",
    essence: "Binds glyphs into living systems",
  },
  {
    id: "pm",
    label: "Product Manager",
    title: "The Pathwarden",
    essence: "Guides quests through every storm",
  },
  {
    id: "marketer",
    label: "Marketer",
    title: "The Story-Singer",
    essence: "Summons crowds with whispered words",
  },
  {
    id: "researcher",
    label: "Researcher",
    title: "The Truth-Seeker",
    essence: "Listens until the world speaks back",
  },
  {
    id: "analyst",
    label: "Data Analyst",
    title: "The Pattern-Reader",
    essence: "Finds order in tides of numbers",
  },
] as const

export type WizardRace = (typeof WIZARD_RACES)[number]
export type WizardRaceId = WizardRace["id"]
