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

  async get_user_id(username: string): Promise<string | undefined> {
    const user_id = await this.kv.get(`id:${username}`, 'text')
    return user_id ?? undefined
  }

  async put_user_id(username: string, id: number): Promise<void> {
    await this.kv.put(`id:${username}`, id.toString())
  }

  async get_history(id: number | string): Promise<Message[]> {
    const history = await this.kv.get<Message[]>(`history:${id}`, 'json')
    return history ?? []
  }

  async put_history(id: number | string, messages: Message[]): Promise<void> {
    await this.kv.put(`history:${id}`, JSON.stringify(messages))
  }

  async delete_history(id: number | string): Promise<void> {
    await this.kv.delete(`history:${id}`)
  }

  async get_system_prompt(id: number | string): Promise<string | undefined> {
    const system_prompt = await this.kv.get(`system:${id}`, 'text')
    return system_prompt ?? undefined
  }

  async get_reply_links(id: number | string): Promise<Reply[]> {
    const reply_links = await this.kv.get<Reply[]>(`ask_human:${id}`, 'json')
    return reply_links ?? []
  }

  async get_reply_link(id: number | string, sent_question_id: number): Promise<Reply | undefined> {
    const replies = await this.get_reply_links(id)
    return replies.find((reply) => reply.sent_question_id === sent_question_id)
  }

  async put_reply_links(id: number | string, reply_links: Reply[]): Promise<void> {
    await this.kv.put(`ask_human:${id}`, JSON.stringify(reply_links))
  }

  async put_reply_link(id: number | string, reply_link: Reply): Promise<void> {
    const replies = await this.get_reply_links(id)
    replies.push(reply_link)
    await this.put_reply_links(id, replies)
  }

  async delete_reply_link(id: number | string, sent_question_id: number): Promise<void> {
    const replies = await this.get_reply_links(id)
    const new_replies = replies.filter((reply) => reply.sent_question_id !== sent_question_id)
    await this.put_reply_links(id, new_replies)
  }

  async get_ask_all_timestamp(id: number | string): Promise<number | undefined> {
    const timestamp = await this.kv.get(`ask_all:${id}`, 'text')

    if (!timestamp) {
      return undefined
    }

    return Number(timestamp)
  }

  async put_ask_all_timestamp(id: number | string, timestamp: number): Promise<void> {
    await this.kv.put(`ask_all:${id}`, timestamp.toString())
  }
}
