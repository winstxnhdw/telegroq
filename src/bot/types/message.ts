type ImageURL = {
  url: string
}

type ImageMessageContent = {
  type: 'image_url'
  image_url: ImageURL
}

type TextMessageContent = {
  type: 'text'
  text: string
}

type UserMessage = {
  role: 'user'
  content: string | (TextMessageContent | ImageMessageContent)[]
}

export type Message =
  | UserMessage
  | {
      role: 'system' | 'assistant'
      content: string
    }
