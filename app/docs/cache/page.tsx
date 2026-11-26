import type { Metadata } from 'next';
import MovedTo from '../../components/docs/MovedTo';

export const metadata: Metadata = {
  title: 'Moved | AgentSea',
  robots: { index: false },
};

export default function Page() {
  return <MovedTo href="/docs/packages/cache" />;
}
