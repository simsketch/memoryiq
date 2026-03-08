const OPENROUTER_URL = 'https://openrouter.ai/api/v1'

interface Metadata {
  category: string
  tags: string[]
  people: string[]
  action_items: string[]
  sentiment: string
}

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const res = await fetch(`${OPENROUTER_URL}/embeddings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      },
      body: JSON.stringify({
        model: 'openai/text-embedding-3-small',
        input: text,
      }),
    })
    if (!res.ok) throw new Error(`OpenRouter embedding failed: ${res.status}`)
    const data = await res.json()
    return data.data[0].embedding
  } catch (err) {
    // Fallback to OpenAI SDK
    const { default: OpenAI } = await import('openai')
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    })
    return response.data[0].embedding
  }
}

const EXTRACT_SYSTEM_PROMPT = `You are a metadata extractor. Extract structured information from the thought text provided. Return ONLY raw JSON — no markdown, no explanation, no code fences. The JSON must have exactly these fields:

{
  "category": one of: idea | decision | person_note | task | reference | observation | question,
  "tags": string[],
  "people": string[],
  "action_items": string[],
  "sentiment": positive | neutral | negative
}`

export async function extractMetadata(text: string): Promise<Metadata> {
  try {
    const res = await fetch(`${OPENROUTER_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: EXTRACT_SYSTEM_PROMPT },
          { role: 'user', content: text },
        ],
      }),
    })
    if (!res.ok) throw new Error(`OpenRouter chat failed: ${res.status}`)
    const data = await res.json()
    const raw = data.choices[0].message.content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()
    return JSON.parse(raw)
  } catch (err) {
    // Fallback to OpenAI SDK
    const { default: OpenAI } = await import('openai')
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: EXTRACT_SYSTEM_PROMPT },
        { role: 'user', content: text },
      ],
    })
    const raw = (response.choices[0].message.content || '{}')
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()
    return JSON.parse(raw)
  }
}

export async function processThought(text: string) {
  const [embedding, metadata] = await Promise.all([
    generateEmbedding(text),
    extractMetadata(text),
  ])
  return { embedding, metadata }
}
