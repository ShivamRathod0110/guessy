type WorkerMessage =
  | { type: 'init'; word: string; data: [string, number][] }
  | { type: 'lookup'; guess: string }

type WorkerResponse =
  | { type: 'ready' }
  | { type: 'result'; rank: number | '>5000' | 'NOT_FOUND' }

let secretWord = ''
let rankMap = new Map<string, number>()

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const msg = e.data

  if (msg.type === 'init') {
    secretWord = msg.word
    rankMap = new Map(msg.data)
    const response: WorkerResponse = { type: 'ready' }
    self.postMessage(response)
  }

  if (msg.type === 'lookup') {
    const guess = msg.guess.trim().toLowerCase()
    let rank: number | '>5000' | 'NOT_FOUND'

    if (guess === secretWord) {
      rank = 1
    } else if (rankMap.has(guess)) {
      rank = rankMap.get(guess)!
    } else {
      rank = '>5000'
    }

    const response: WorkerResponse = { type: 'result', rank }
    self.postMessage(response)
  }
}