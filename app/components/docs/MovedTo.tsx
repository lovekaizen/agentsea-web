'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Stand-in for a docs URL that moved. The site is a static export, so redirects
 * cannot be configured in next.config; this page forwards on the client and
 * keeps a link for crawlers and for browsers without script.
 */
export default function MovedTo({ href }: { href: string }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(href);
  }, [router, href]);

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-3 px-4 py-24 text-brand-navy">
      <p className="text-base">
        This page has moved to{' '}
        <Link href={href} className="font-semibold text-ink-eyebrow underline">
          {href}
        </Link>
        .
      </p>
    </main>
  );
}
