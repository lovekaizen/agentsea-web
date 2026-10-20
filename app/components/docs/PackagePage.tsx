import type { ReactNode } from 'react';
import BulletPanel from './BulletPanel';
import CodeBlock from './CodeBlock';
import DocSection from './DocSection';
import DocsShell, { type TocItem } from './DocsShell';
import { ApiList, ApiRow } from './ApiList';

export interface PackageDoc {
  /** URL segment: the page lives at /docs/packages/<slug>. */
  slug: string;
  /** npm name, e.g. "@lov3kaizen/agentsea-core". */
  name: string;
  summary: string;
  version: string;
  onNpm: boolean;
  /** Shell command for the Install section. */
  install: string;
  /** Text beside the install command. Defaults to a generic line. */
  installNote?: string;
  example: { lang: string; code: string };
  api: { name: string; description: string }[];
  caveats: string[];
}

interface PackagePageProps {
  pkg: PackageDoc;
  /** Extra sections after Caveats, numbered from 05. Pass their TOC entries in extraToc. */
  children?: ReactNode;
  extraToc?: TocItem[];
}

/** Standard package reference: Install, Example, Key API and Caveats. */
export default function PackagePage({ pkg, children, extraToc = [] }: PackagePageProps) {
  const toc: TocItem[] = [
    { id: 'install', label: 'Install' },
    { id: 'example', label: 'Example' },
    { id: 'key-api', label: 'Key API' },
    { id: 'caveats', label: 'Caveats' },
    ...extraToc,
  ];

  return (
    <DocsShell
      eyebrow="Package"
      title={pkg.name}
      lead={pkg.summary}
      badges={[`v${pkg.version}`, pkg.onNpm ? 'On npm' : 'Private, not on npm']}
      active="packages"
      toc={toc}
    >
      <DocSection id="install" num="01" title="Install">
        <div className="flex flex-col gap-6 md:flex-row">
          <p className="text-base leading-relaxed text-brand-navy md:w-[300px] md:shrink-0">
            {pkg.installNote ?? 'Install from npm into your project.'}
          </p>
          <div className="min-w-0 md:flex-1">
            <CodeBlock lang="BASH" code={pkg.install} />
          </div>
        </div>
      </DocSection>

      <DocSection id="example" num="02" title="Example">
        <CodeBlock lang={pkg.example.lang} code={pkg.example.code} />
      </DocSection>

      <DocSection id="key-api" num="03" title="Key API">
        <ApiList>
          {pkg.api.map((row) => (
            <ApiRow key={row.name} name={row.name}>
              {row.description}
            </ApiRow>
          ))}
        </ApiList>
      </DocSection>

      <DocSection id="caveats" num="04" title="Caveats">
        <BulletPanel items={pkg.caveats} />
      </DocSection>

      {children}
    </DocsShell>
  );
}
