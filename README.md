# telegroq

[![main.yml](https://github.com/winstxnhdw/telegroq/actions/workflows/main.yml/badge.svg)](https://github.com/winstxnhdw/telegroq/actions/workflows/main.yml)
[![deploy.yml](https://github.com/winstxnhdw/telegroq/actions/workflows/deploy.yml/badge.svg)](https://github.com/winstxnhdw/telegroq/actions/workflows/deploy.yml)
[![formatter.yml](https://github.com/winstxnhdw/telegroq/actions/workflows/formatter.yml/badge.svg)](https://github.com/winstxnhdw/telegroq/actions/workflows/formatter.yml)

`telegroq` is a serverless invite-only AI-powered chat bot on Telegram, made purely for fun.

## Features

- Question answering with `llama-3.3-70b-versatile`
- Random and anonymous question answering with fellow invitees
- Anonymous question answering with [LTYGUY](https://github.com/LTYGUY/)
- Secured endpoints for adding and removing members/admins

## Technologies

- [Hono](https://hono.dev/)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Cloudflare Workers KV](https://developers.cloudflare.com/kv/)
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
- [OpenAPI Swagger](https://swagger.io/specification/)
- [grammY](https://grammy.dev/)
- [Groq](https://groq.com/)

## Development

Setup environment variables.

```bash
{
  echo "BOT_TOKEN=$BOT_TOKEN"
  echo "GROQ_API_KEY=$GROQ_TOKEN"
  echo "AUTH_TOKEN=$AUTH_TOKEN"
} >> .dev.vars
```

Install all dependencies.

```bash
bun install
```

Run the development server.

```bash
bun dev
```
