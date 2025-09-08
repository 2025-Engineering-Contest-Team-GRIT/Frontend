
import { StatisticsPageClient } from '@/components/csr/StatisticsPageClient';

export const dynamic = 'force-dynamic'; // SSR

export default function StatisticsPage() {
  return <StatisticsPageClient />;
}
