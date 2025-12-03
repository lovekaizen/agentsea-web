import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './docs.css';
import MainLayout from './components/MainLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AgentSea - Unite and Orchestrate AI Agents',
  description:
    'Build powerful agentic AI applications with AgentSea. Unite AI agents and services with multi-provider support, workflow orchestration, MCP protocol, and enterprise-grade observability.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="cmyk">
      <body className={inter.className}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
