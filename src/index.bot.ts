import { bot_factory } from '@/bot'
import { get_config } from '@/config'
import type { Bindings } from '@/types'

type KVGetType = 'text' | 'json' | 'arrayBuffer' | 'stream' | undefined

class KVNamespaceStub implements KVNamespace<string> {
  private store = new Map<string, { value: string; metadata: unknown | null }>()

  private resolveType(
    arg?:
      | 'text'
      | 'json'
      | 'arrayBuffer'
      | 'stream'
      | KVNamespaceGetOptions<'text'>
      | KVNamespaceGetOptions<'json'>
      | KVNamespaceGetOptions<'arrayBuffer'>
      | KVNamespaceGetOptions<'stream'>
      | Partial<KVNamespaceGetOptions<undefined>>,
  ): KVGetType {
    if (!arg) return undefined
    if (typeof arg === 'string') return arg
    if (typeof arg === 'object' && 'type' in arg && arg.type) {
      return arg.type as KVGetType
    }
    return undefined
  }

  private readValue(key: string, type: KVGetType): unknown {
    const entry = this.store.get(key)
    if (!entry) return null

    if (type === 'json') {
      try {
        return JSON.parse(entry.value)
      } catch {
        return null
      }
    }

    return entry.value
  }

  private readWithMetadata<Metadata = unknown>(
    key: string,
    type: KVGetType,
  ): KVNamespaceGetWithMetadataResult<unknown, Metadata> {
    const metadata = (this.store.get(key)?.metadata ?? null) as Metadata | null
    const value = this.readValue(key, type)

    return {
      value: value ?? null,
      metadata,
      cacheStatus: null,
    }
  }

  get(key: string, options?: Partial<KVNamespaceGetOptions<undefined>>): Promise<string | null>
  get(key: string, type: 'text'): Promise<string | null>
  get<ExpectedValue = unknown>(key: string, type: 'json'): Promise<ExpectedValue | null>
  get(key: string, type: 'arrayBuffer'): Promise<ArrayBuffer | null>
  get(key: string, type: 'stream'): Promise<ReadableStream<Uint8Array> | null>
  get(key: string, options?: KVNamespaceGetOptions<'text'>): Promise<string | null>
  get<ExpectedValue = unknown>(key: string, options?: KVNamespaceGetOptions<'json'>): Promise<ExpectedValue | null>
  get(key: string, options?: KVNamespaceGetOptions<'arrayBuffer'>): Promise<ArrayBuffer | null>
  get(key: string, options?: KVNamespaceGetOptions<'stream'>): Promise<ReadableStream<Uint8Array> | null>
  get(key: string[], type: 'text'): Promise<Map<string, string | null>>
  get<ExpectedValue = unknown>(key: string[], type: 'json'): Promise<Map<string, ExpectedValue | null>>
  get(key: string[], options?: Partial<KVNamespaceGetOptions<undefined>>): Promise<Map<string, string | null>>
  get(key: string[], options?: KVNamespaceGetOptions<'text'>): Promise<Map<string, string | null>>
  get<ExpectedValue = unknown>(
    key: string[],
    options?: KVNamespaceGetOptions<'json'>,
  ): Promise<Map<string, ExpectedValue | null>>
  async get(
    key: string | string[],
    options?:
      | 'text'
      | 'json'
      | 'arrayBuffer'
      | 'stream'
      | KVNamespaceGetOptions<'text'>
      | KVNamespaceGetOptions<'json'>
      | KVNamespaceGetOptions<'arrayBuffer'>
      | KVNamespaceGetOptions<'stream'>
      | Partial<KVNamespaceGetOptions<undefined>>,
  ): Promise<unknown> {
    const type = this.resolveType(options)

    if (Array.isArray(key)) {
      const entries = new Map<string, unknown | null>()
      for (const name of key) {
        entries.set(name, this.readValue(name, type))
      }
      return entries
    }

    return this.readValue(key, type)
  }

  async list<Metadata = unknown>(options?: KVNamespaceListOptions): Promise<KVNamespaceListResult<Metadata, string>> {
    const prefix = options?.prefix ?? undefined
    const limit = options?.limit ?? undefined

    let keys = Array.from(this.store.entries())
      .filter(([name]) => (prefix ? name.startsWith(prefix) : true))
      .map(([name, entry]) => {
        const item: KVNamespaceListKey<Metadata, string> = { name }
        if (entry.metadata !== null && entry.metadata !== undefined) {
          item.metadata = entry.metadata as Metadata
        }
        return item
      })

    if (typeof limit === 'number') {
      keys = keys.slice(0, limit)
    }

    return {
      list_complete: true,
      keys,
      cacheStatus: null,
    }
  }

  async put(
    key: string,
    value: string | ArrayBuffer | ArrayBufferView | ReadableStream,
    options?: KVNamespacePutOptions,
  ): Promise<void> {
    const storedValue = typeof value === 'string' ? value : String(value)
    this.store.set(key, {
      value: storedValue,
      metadata: options?.metadata ?? null,
    })
  }

  getWithMetadata<Metadata = unknown>(
    key: string,
    options?: Partial<KVNamespaceGetOptions<undefined>>,
  ): Promise<KVNamespaceGetWithMetadataResult<string, Metadata>>
  getWithMetadata<Metadata = unknown>(
    key: string,
    type: 'text',
  ): Promise<KVNamespaceGetWithMetadataResult<string, Metadata>>
  getWithMetadata<ExpectedValue = unknown, Metadata = unknown>(
    key: string,
    type: 'json',
  ): Promise<KVNamespaceGetWithMetadataResult<ExpectedValue, Metadata>>
  getWithMetadata<Metadata = unknown>(
    key: string,
    type: 'arrayBuffer',
  ): Promise<KVNamespaceGetWithMetadataResult<ArrayBuffer, Metadata>>
  getWithMetadata<Metadata = unknown>(
    key: string,
    type: 'stream',
  ): Promise<KVNamespaceGetWithMetadataResult<ReadableStream<Uint8Array>, Metadata>>
  getWithMetadata<Metadata = unknown>(
    key: string,
    options: KVNamespaceGetOptions<'text'>,
  ): Promise<KVNamespaceGetWithMetadataResult<string, Metadata>>
  getWithMetadata<ExpectedValue = unknown, Metadata = unknown>(
    key: string,
    options: KVNamespaceGetOptions<'json'>,
  ): Promise<KVNamespaceGetWithMetadataResult<ExpectedValue, Metadata>>
  getWithMetadata<Metadata = unknown>(
    key: string,
    options: KVNamespaceGetOptions<'arrayBuffer'>,
  ): Promise<KVNamespaceGetWithMetadataResult<ArrayBuffer, Metadata>>
  getWithMetadata<Metadata = unknown>(
    key: string,
    options: KVNamespaceGetOptions<'stream'>,
  ): Promise<KVNamespaceGetWithMetadataResult<ReadableStream<Uint8Array>, Metadata>>
  getWithMetadata<Metadata = unknown>(
    key: string[],
    type: 'text',
  ): Promise<Map<string, KVNamespaceGetWithMetadataResult<string, Metadata>>>
  getWithMetadata<ExpectedValue = unknown, Metadata = unknown>(
    key: string[],
    type: 'json',
  ): Promise<Map<string, KVNamespaceGetWithMetadataResult<ExpectedValue, Metadata>>>
  getWithMetadata<Metadata = unknown>(
    key: string[],
    options?: Partial<KVNamespaceGetOptions<undefined>>,
  ): Promise<Map<string, KVNamespaceGetWithMetadataResult<string, Metadata>>>
  getWithMetadata<Metadata = unknown>(
    key: string[],
    options?: KVNamespaceGetOptions<'text'>,
  ): Promise<Map<string, KVNamespaceGetWithMetadataResult<string, Metadata>>>
  getWithMetadata<ExpectedValue = unknown, Metadata = unknown>(
    key: string[],
    options?: KVNamespaceGetOptions<'json'>,
  ): Promise<Map<string, KVNamespaceGetWithMetadataResult<ExpectedValue, Metadata>>>
  async getWithMetadata(
    key: string | string[],
    options?:
      | 'text'
      | 'json'
      | 'arrayBuffer'
      | 'stream'
      | KVNamespaceGetOptions<'text'>
      | KVNamespaceGetOptions<'json'>
      | KVNamespaceGetOptions<'arrayBuffer'>
      | KVNamespaceGetOptions<'stream'>
      | Partial<KVNamespaceGetOptions<undefined>>,
  ): Promise<unknown> {
    const type = this.resolveType(options)

    if (Array.isArray(key)) {
      const entries = new Map<string, KVNamespaceGetWithMetadataResult<unknown, unknown>>()
      for (const name of key) {
        entries.set(name, this.readWithMetadata(name, type))
      }
      return entries
    }

    return this.readWithMetadata(key, type)
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key)
  }
}

function main() {
  const bot = bot_factory({
    ...get_config(Bun.env),
    telegroq: new KVNamespaceStub(),
    ai: {} as unknown as Bindings['ai'],
    BOT_URL: 'https://example.com',
  })

  bot.catch(console.error)
  bot.start()
}

main()
