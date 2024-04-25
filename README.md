# telegroq

[![main.yml](https://github.com/winstxnhdw/telegroq/actions/workflows/main.yml/badge.svg)](https://github.com/winstxnhdw/telegroq/actions/workflows/main.yml)
[![deploy.yml](https://github.com/winstxnhdw/telegroq/actions/workflows/deploy.yml/badge.svg)](https://github.com/winstxnhdw/telegroq/actions/workflows/deploy.yml)
[![formatter.yml](https://github.com/winstxnhdw/telegroq/actions/workflows/formatter.yml/badge.svg)](https://github.com/winstxnhdw/telegroq/actions/workflows/formatter.yml)

A chat bot on Telegram, powered by [Hono](https://hono.dev/), [Cloudflare Workers](https://workers.cloudflare.com/), [OpenAPI Swagger UI](https://swagger.io/specification/), [grammY](https://grammy.dev/), and [Groq](https://groq.com/).

## Development

Install all dependencies.

```bash
bun install
```

## Testing

Run your tests with hot reloading.

```bash
bun run test
```

Run your tests without hot reloading. For testing in a CI pipeline.

```bash
bun test
```
