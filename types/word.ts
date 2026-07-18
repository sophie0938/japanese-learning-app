export type WordLevel = "N5" | "N4" | "N3" | "N2" | "N1"

export interface Word {
  id: string
  word: string
  meaning: string
  example: string
  level: WordLevel
}
