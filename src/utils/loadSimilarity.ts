export async function loadSimilarityData(
  word: string
): Promise<[string, number][]> {
  const url = `${import.meta.env.BASE_URL}data/words/${word}.json`
  
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`Failed to load similarity data for "${word}"`)
  }
  
  const data = await response.json()
  return data as [string, number][]
}

export async function loadWordBank(): Promise<string[]> {
  const url = `${import.meta.env.BASE_URL}data/word_bank.json`
  
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error('Failed to load word bank')
  }
  
  return response.json()
}