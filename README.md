# MemoryIQ

> One Brain. Every AI.

AI-powered shared memory platform. Capture thoughts from anywhere, search by meaning, share knowledge across all your AI tools.

## Key Features
- Semantic Search — vector-powered search using pgvector
- Shared Brains — collaborative knowledge bases with member roles
- MCP Protocol — connect any MCP-compatible AI tool
- Smart Curation — AI detects conflicts and flags stale knowledge
- Multi-Source Capture — web UI, API, MCP
- Auto-Metadata — AI classifies, tags, and links thoughts

## Tech Stack
- Framework: Next.js 16 (App Router)
- Language: TypeScript
- Auth: Clerk
- Database: Neon Postgres + pgvector
- ORM: Drizzle
- AI: OpenRouter + OpenAI (fallback)
- MCP: @modelcontextprotocol/sdk
- Styling: Tailwind CSS + shadcn/ui

## Local Development

```bash
git clone <repo-url>
cd memoryiq
cp .env.example .env.local  # Fill in your keys
npm install
npx drizzle-kit migrate
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY | Clerk publishable key |
| CLERK_SECRET_KEY | Clerk secret key |
| CLERK_WEBHOOK_SECRET | Clerk webhook signing secret |
| DATABASE_URL | Neon pooled connection string |
| DATABASE_URL_UNPOOLED | Neon direct connection (for migrations) |
| OPENROUTER_API_KEY | OpenRouter API key |
| OPENAI_API_KEY | OpenAI API key (fallback) |
| NEXT_PUBLIC_APP_URL | App URL (e.g., https://memoryiq.ai) |

## MCP Integration

Connect your AI tools using your brain's MCP URL:

### Claude Desktop
```json
{
  "mcpServers": {
    "memoryiq": {
      "url": "https://your-app.vercel.app/api/mcp?key=YOUR_BRAIN_KEY",
      "transport": "http"
    }
  }
}
```

### Cursor
```json
{
  "mcpServers": {
    "memoryiq": {
      "url": "https://your-app.vercel.app/api/mcp?key=YOUR_BRAIN_KEY"
    }
  }
}
```

### VS Code Copilot
```json
{
  "github.copilot.chat.mcpServers": {
    "memoryiq": {
      "url": "https://your-app.vercel.app/api/mcp?key=YOUR_BRAIN_KEY"
    }
  }
}
```

Find your brain key in Dashboard → Brains → [Brain] → MCP Connection.

## Deployment

Recommended: Vercel + Neon

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## Database Migrations

```bash
npx drizzle-kit generate  # Generate new migration
npx drizzle-kit migrate   # Run migrations
```
