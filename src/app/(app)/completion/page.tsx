

import { CompletionPageClient } from '@/components/csr/CompletionPageClient';

export const dynamic = 'force-dynamic'; // SSR

export default async function CompletionPage() {
  return <CompletionPageClient />;
}
