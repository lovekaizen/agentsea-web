'use client';

import React, { ReactNode, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface PageHeaderProps {
  title: string;
  titleGradient?: 'default' | 'blue' | 'purple' | 'warm' | 'cool' | 'animated';
  description?: string;
  badge?: string;
}

export function PageHeader({
  title,
  titleGradient = 'default',
  description,
  badge,
}: PageHeaderProps) {
  const gradientClasses = {
    default: 'text-gradient',
    blue: 'text-gradient-blue',
    purple: 'text-gradient-purple',
    warm: 'text-gradient-warm',
    cool: 'text-gradient-cool',
    animated: 'text-gradient-animated',
  };

  return (
    <div className="mb-12">
      {badge && (
        <span className="badge badge-gradient px-4 py-3 mb-4">{badge}</span>
      )}
      <h1 className={`text-5xl font-bold mb-4 ${gradientClasses[titleGradient]}`}>
        {title}
      </h1>
      {description && (
        <p className="text-xl text-base-content/70">{description}</p>
      )}
    </div>
  );
}

interface SectionProps {
  children: ReactNode;
  title?: string;
  id?: string;
  className?: string;
  variant?: 'default' | 'bordered' | 'gradient' | 'dark';
  titleGradient?: 'default' | 'blue' | 'purple' | 'warm' | 'cool' | 'none';
  badge?: string;
}

export function Section({
  children,
  title,
  id,
  className = '',
  variant = 'default',
  titleGradient = 'none',
  badge,
}: SectionProps) {
  const variantClasses = {
    default: '',
    bordered: 'border border-base-300 rounded-xl p-6',
    gradient: 'bg-gradient-to-r from-base-200 to-base-300 rounded-xl p-6',
    dark: 'bg-gradient-mesh rounded-xl p-8 text-white',
  };

  const gradientClasses = {
    default: 'text-gradient',
    blue: 'text-gradient-blue',
    purple: 'text-gradient-purple',
    warm: 'text-gradient-warm',
    cool: 'text-gradient-cool',
    none: '',
  };

  return (
    <section
      id={id}
      className={`mb-12 ${variantClasses[variant]} ${className}`}
    >
      {(title || badge) && (
        <div className="flex items-center gap-3 mb-6">
          {badge && (
            <span className="badge badge-gradient px-3 py-2 text-sm">{badge}</span>
          )}
          {title && (
            <h2
              className={`text-3xl font-bold pb-1 ${gradientClasses[titleGradient]}`}
            >
              {title}
            </h2>
          )}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </section>
  );
}

interface SubSectionProps {
  children: ReactNode;
  title?: string;
  id?: string;
  className?: string;
  titleGradient?: 'default' | 'blue' | 'purple' | 'warm' | 'cool' | 'none';
}

export function SubSection({
  children,
  title,
  id,
  className = '',
  titleGradient = 'purple',
}: SubSectionProps) {
  const gradientClasses = {
    default: 'text-gradient',
    blue: 'text-gradient-blue',
    purple: 'text-gradient-purple',
    warm: 'text-gradient-warm',
    cool: 'text-gradient-cool',
    none: 'text-primary',
  };

  return (
    <div id={id} className={`mb-8 ${className}`}>
      {title && (
        <h3 className={`text-2xl font-semibold mb-4 ${gradientClasses[titleGradient]}`}>
          {title}
        </h3>
      )}
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function Divider({ className = '' }: { className?: string }) {
  return <div className={`divider-gradient my-8 ${className}`}></div>;
}

interface CodeBlockProps {
  children: ReactNode;
  language?: string;
}

export function CodeBlock({ children, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // Extract text content from children (handle both string and JSX)
  const getTextContent = (node: ReactNode): string => {
    if (typeof node === 'string') {
      return node;
    }
    if (typeof node === 'number') {
      return String(node);
    }
    if (Array.isArray(node)) {
      return node.map(getTextContent).join('');
    }
    if (React.isValidElement(node)) {
      return getTextContent((node.props as any).children);
    }
    return '';
  };

  // Dedent function to remove common leading whitespace
  const dedent = (text: string): string => {
    const lines = text.split('\n');

    // Remove leading and trailing empty lines
    while (lines.length > 0 && lines[0].trim() === '') {
      lines.shift();
    }
    while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
      lines.pop();
    }

    if (lines.length === 0) return '';

    // Find minimum indentation (ignoring empty lines)
    const minIndent = lines
      .filter(line => line.trim().length > 0)
      .reduce((min, line) => {
        const match = line.match(/^(\s*)/);
        const indent = match ? match[1].length : 0;
        return Math.min(min, indent);
      }, Infinity);

    // Remove the common indentation from all lines
    if (minIndent > 0 && minIndent !== Infinity) {
      return lines.map(line => line.slice(minIndent)).join('\n');
    }

    return lines.join('\n');
  };

  const rawContent = getTextContent(children);
  const textContent = dedent(rawContent);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="my-6 rounded-xl overflow-hidden shadow-lg bg-gray-900 border border-base-300 relative group glow-purple">
      <div className="flex items-center justify-between bg-base-300 px-4 py-2 border-b border-base-content/10">
        <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
          {language || 'CODE'}
        </span>
        <button
          onClick={handleCopy}
          className="btn btn-xs btn-ghost gap-1 opacity-70 hover:opacity-100 transition-opacity"
          title={copied ? 'Copied!' : 'Copy to clipboard'}
        >
          {copied ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language || 'text'}
          style={atomDark}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '0.875rem',
            lineHeight: '1.5',
          }}
          codeTagProps={{
            style: {
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            },
          }}
        >
          {textContent}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

interface AlertBoxProps {
  children: ReactNode;
  type?: 'info' | 'success' | 'warning' | 'error';
  gradient?: boolean;
}

export function AlertBox({ children, type = 'info', gradient = false }: AlertBoxProps) {
  const typeClasses = {
    info: gradient ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30' : 'alert-info',
    success: gradient ? 'bg-gradient-to-r from-green-500/10 to-cyan-500/10 border-green-500/30' : 'alert-success',
    warning: gradient ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30' : 'alert-warning',
    error: gradient ? 'bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-500/30' : 'alert-error',
  };

  const iconColors = {
    info: 'text-blue-500',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    error: 'text-red-500',
  };

  const icons = {
    info: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className={`stroke-current shrink-0 w-6 h-6 ${gradient ? iconColors[type] : ''}`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
    ),
    success: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`stroke-current shrink-0 h-6 w-6 ${gradient ? iconColors[type] : ''}`}
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    warning: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`stroke-current shrink-0 h-6 w-6 ${gradient ? iconColors[type] : ''}`}
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    error: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`stroke-current shrink-0 h-6 w-6 ${gradient ? iconColors[type] : ''}`}
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  return (
    <div className={`alert ${typeClasses[type]} my-6 ${gradient ? 'border rounded-xl' : ''}`}>
      {icons[type]}
      <div className="flex-1">{children}</div>
    </div>
  );
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  href?: string;
}

export function FeatureCard({ icon, title, description, href }: FeatureCardProps) {
  const content = (
    <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all border border-base-300 card-gradient-hover group hover:scale-[1.02]">
      <div className="card-body relative z-10">
        <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="card-title text-lg group-hover:text-gradient transition-all">
          {title}
        </h3>
        <p className="text-sm text-base-content/70">{description}</p>
      </div>
    </div>
  );

  if (href) {
    const Link = require('next/link').default;
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

interface StatCardProps {
  value: string;
  label: string;
  icon?: string;
}

export function StatCard({ value, label, icon }: StatCardProps) {
  return (
    <div className="text-center p-6 rounded-xl bg-base-200 border border-base-300 card-gradient-hover">
      {icon && <div className="text-3xl mb-2">{icon}</div>}
      <div className="stat-gradient text-4xl font-bold">{value}</div>
      <div className="text-sm text-base-content/60 mt-1">{label}</div>
    </div>
  );
}
