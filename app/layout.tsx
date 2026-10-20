import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import './docs.css';

const inter = Inter({ subsets: ['latin'] });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' });

const description =
  'Build powerful agentic AI applications with AgentSea — for TypeScript/Node and natively for Elixir/OTP (14 libraries on Hex). Multi-provider support, workflow orchestration, MCP protocol, and enterprise-grade observability.';

export const metadata: Metadata = {
  metadataBase: new URL('https://agentsea.dev'),
  title: 'AgentSea - Unite and Orchestrate AI Agents',
  description,
  keywords: [
    'AgentSea',
    'AI agents',
    'agentic AI',
    'LLM',
    'agent orchestration',
    'multi-agent',
    'MCP',
    'TypeScript',
    'Node.js',
    'Elixir',
    'OTP',
    'BEAM',
    'Hex',
  ],
  openGraph: {
    title: 'AgentSea - Unite and Orchestrate AI Agents',
    description,
    siteName: 'AgentSea',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgentSea - Unite and Orchestrate AI Agents',
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="agentsea">
      <body className={`${inter.className} ${jetbrainsMono.variable}`}>{children}</body>
    </html>
  );
}
