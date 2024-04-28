import type { Message, Reply } from '@/bot/types'

export class KV {
  private kv: KVNamespace

  constructor(kv: KVNamespace) {
    this.kv = kv
  }

  async get_members(): Promise<string[]> {
    const usernames = await this.kv.get('members', 'text')
    return usernames?.split('\n') ?? []
  }

  async get_user_id(username: string): Promise<string | null> {
    return this.kv.get(`id:${username}`, 'text')
  }

  async put_user_id(username: string, id: number): Promise<void> {
    await this.kv.put(`id:${username}`, id.toString())
  }

  async get_history(username: string): Promise<Message[] | null> {
    return this.kv.get(`history:${username}`, 'json')
  }

  async put_history(username: string, messages: Message[]): Promise<void> {
    await this.kv.put(`history:${username}`, JSON.stringify(messages))
  }

  async delete_history(username: string): Promise<void> {
    await this.kv.delete(`history:${username}`)
  }

  async get_system_prompt(username: string): Promise<string> {
    const system_prompt = await this.kv.get(`system:${username}`, 'text')
    return system_prompt ?? ''
  }

  async get_reply_link(id: number | string): Promise<Reply | null> {
    return this.kv.get(`ask_human:${id}`, 'json')
  }

  async put_reply_link(id: number | string, reply_link: Reply): Promise<void> {
    await this.kv.put(`ask_human:${id}`, JSON.stringify(reply_link))
  }

  async delete_reply_link(id: number | string): Promise<void> {
    await this.kv.delete(`ask_human:${id}`)
  }
}
