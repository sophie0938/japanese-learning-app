import type { Word } from "@/types/word"
import { supabase } from "@/lib/supabase"

export async function getWords(): Promise<Word[]> {
  const { data, error } = await supabase
    .from("words")
    .select("*")
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Failed to fetch words:", error)
    return []
  }

  return data ?? []
}

export async function getWordById(id: string): Promise<Word | undefined> {
  const { data, error } = await supabase
    .from("words")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Failed to fetch word:", error)
    return undefined
  }

  return data
}