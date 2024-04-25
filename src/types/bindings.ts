import type { get_config } from '@/config'

type BartLargeCNNOptions = {
  input_text: string
  max_length: number
}

type BartLargeCNNResponse = {
  summary: string
}

type AI = {
  run(model: '@cf/facebook/bart-large-cnn', options: BartLargeCNNOptions): Promise<BartLargeCNNResponse>
}

export type Bindings = ReturnType<typeof get_config> & {
  telegroq: KVNamespace
  ai: AI
}
