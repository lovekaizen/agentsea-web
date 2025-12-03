# AgentSea Website

Marketing and documentation website for AgentSea - a production-ready ADK for building agentic AI applications.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```sh
agentsea-website/
├── app/
│   ├── docs/
│   │   ├── installation/page.tsx     # Installation guide
│   │   ├── quick-start/page.tsx      # Quick start tutorial
│   │   ├── agents/page.tsx           # Agent documentation
│   │   ├── tools/page.tsx            # Tools documentation
│   │   ├── workflows/page.tsx        # Workflows documentation
│   │   ├── memory/page.tsx           # Memory stores documentation
│   │   ├── mcp-overview/page.tsx     # MCP integration overview
│   │   ├── mcp-servers/page.tsx      # MCP servers guide
│   │   ├── observability/page.tsx    # Observability features
│   │   ├── nestjs/page.tsx           # NestJS integration
│   │   └── page.tsx                  # Documentation hub
│   ├── examples/page.tsx             # Code examples showcase
│   ├── api/page.tsx                  # API reference
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Marketing homepage
│   └── globals.css                   # Global styles
├── public/                           # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── README.md
```

## Features

### 🏠 Homepage

- Hero section with clear value proposition
- 9 feature cards showcasing key capabilities
- Live code examples with syntax highlighting
- Statistics section
- Multiple CTAs and footer

### 📚 Documentation

Complete documentation covering:

- **Getting Started**: Installation, Quick Start
- **Core Concepts**: Agents, Tools, Workflows, Memory
- **MCP Integration**: Overview, MCP Servers
- **Advanced**: Observability, NestJS Integration

### 💡 Examples

8 comprehensive examples including:

- Basic Chatbot
- Content Pipeline
- MCP Integration
- Customer Support Router
- Data Analysis Pipeline
- NestJS Application
- Observability Setup
- Advanced Memory Management

### 📖 API Reference

Complete API documentation for:

- Agent classes and methods
- Tool registry
- Workflow types
- Memory stores
- MCP integration
- Observability tools

### 🎨 Design Features

- Responsive design (mobile, tablet, desktop)
- Dark mode support
- Gradient accents and modern UI
- Syntax-highlighted code blocks
- Accessible navigation

## Deployment

### Vercel (Recommended)

The easiest way to deploy is using merge your changes to the `main` branch. Alternatively, you can use the Vercel CLI:

The deployment will automatically:

- Build the Next.js application
- Optimize images and assets
- Enable CDN caching
- Configure HTTPS

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

**Build settings:**

- Build command: `pnpm build`
- Publish directory: `.next`

### Docker

```bash
# Build Docker image
docker build -t agentsea-website .

# Run container
docker run -p 3000:3000 agentsea-website
```

Create a `Dockerfile`:

```dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install -g pnpm && pnpm build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
```

### Self-Hosted

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Or use PM2 for process management
npm install -g pm2
pm2 start "pnpm start" --name agentsea-website
```

### Environment Variables

No environment variables are required for the website to run. All configuration is static.

### Custom Domain

To use a custom domain:

**Vercel:**

1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

**Netlify:**

1. Go to "Domain settings"
2. Add custom domain
3. Configure DNS

**Cloudflare Pages:**

1. Go to "Custom domains"
2. Add domain
3. Verify DNS

## Development

### Adding New Documentation

1. Create a new directory under `app/docs/`
2. Add a `page.tsx` file
3. Update the sidebar navigation in `app/docs/page.tsx`

### Styling

- Uses Tailwind CSS for styling
- Dark mode supported automatically
- Custom styles in `app/globals.css`

## License

MIT License - same as AgentSea core library
