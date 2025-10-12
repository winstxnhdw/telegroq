# telegroq

[![main.yml](https://github.com/winstxnhdw/telegroq/actions/workflows/main.yml/badge.svg)](https://github.com/winstxnhdw/telegroq/actions/workflows/main.yml)
[![deploy.yml](https://github.com/winstxnhdw/telegroq/actions/workflows/deploy.yml/badge.svg)](https://github.com/winstxnhdw/telegroq/actions/workflows/deploy.yml)
[![formatter.yml](https://github.com/winstxnhdw/telegroq/actions/workflows/formatter.yml/badge.svg)](https://github.com/winstxnhdw/telegroq/actions/workflows/formatter.yml)

`telegroq` is a serverless invite-only AI-powered chat bot on Telegram, made purely for fun.

## Features

- Multimodal input, including text, image and audio
- Question answering with `openai/gpt-oss-20b`
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

Setup environment variables. You can learn how to get your bot token from [here](https://core.telegram.org/bots/tutorial#obtain-your-bot-token).

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

### Webhook Server

> [!WARNING]\
> You will need to establish a webhook connection to your server for the bot to work in this mode. If you do not know how to do this, use the `dev-bot` command for long polling instead.

You can run the Cloudflare Workers development server with the following.

```bash
bun dev
```

### Long Polling Bot

If you want to test the Telegram bot with long polling, you will have to run the following.

```bash
bun dev-bot
```
