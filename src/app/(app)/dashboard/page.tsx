

import { DashboardPageClient } from '@/components/csr/DashboardPageClient';

export const dynamic = 'force-dynamic'; // SSR

export default async function DashboardPage() {
  return <DashboardPageClient />;
}
