export async function loadSimilarityData(
  word: string
): Promise<[string, number][] | null> {
  const url = `${import.meta.env.BASE_URL}data/words/${word}.json`

  try {
    const response = await fetch(url)
    if (!response.ok) return null
    const data = await response.json()
    return data as [string, number][]
  } catch {
    return null
  }
}

export async function loadWordBank(): Promise<string[]> {
  const url = `${import.meta.env.BASE_URL}data/words/../word_bank.json`

  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to load word bank')
  return response.json()
}