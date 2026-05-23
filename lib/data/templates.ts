export type Template = {
  id: string
  name: string
  emoji: string
}

// Larger pool — the home page picks a random subset on each visit so the
// suggestions feel fresh, plus the "Surprise me" pill can sample from anywhere.
export const templates: Template[] = [
  { id: "watercolor", name: "Watercolor", emoji: "🎨" },
  { id: "italian-pasta", name: "Italian Pasta", emoji: "🍝" },
  { id: "react-hooks", name: "React Hooks", emoji: "⚛️" },
  { id: "tarot-reading", name: "Tarot Reading", emoji: "🔮" },
  { id: "habit-running", name: "Habit · Running", emoji: "🏃" },
  { id: "sourdough", name: "Sourdough Baking", emoji: "🍞" },
  { id: "knitting", name: "Knitting", emoji: "🧶" },
  { id: "calligraphy", name: "Calligraphy", emoji: "✒️" },
  { id: "origami", name: "Origami", emoji: "📐" },
  { id: "vim-shortcuts", name: "Vim Shortcuts", emoji: "⌨️" },
  { id: "sql-queries", name: "SQL Queries", emoji: "🗃️" },
  { id: "css-animations", name: "CSS Animations", emoji: "🎬" },
  { id: "meditation", name: "Meditation", emoji: "🧘" },
  { id: "daily-journaling", name: "Journaling", emoji: "📓" },
  { id: "cold-showers", name: "Cold Showers", emoji: "🚿" },
  { id: "japanese-tea", name: "Japanese Tea", emoji: "🍵" },
  { id: "coffee-brewing", name: "Coffee Brewing", emoji: "☕" },
  { id: "portrait-drawing", name: "Portrait Drawing", emoji: "✏️" },
  { id: "photography", name: "Photography", emoji: "📸" },
  { id: "storytelling", name: "Storytelling", emoji: "📖" },
  { id: "public-speaking", name: "Public Speaking", emoji: "🎤" },
  { id: "negotiation", name: "Negotiation", emoji: "🤝" },
  { id: "chess-openings", name: "Chess Openings", emoji: "♟️" },
  { id: "plant-care", name: "Plant Care", emoji: "🪴" },
  { id: "breathwork", name: "Breathwork", emoji: "💨" },
]
