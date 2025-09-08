

import { RoadmapPageClient } from '@/components/csr/RoadmapPageClient';

export const dynamic = 'force-dynamic'; // SSR

export default async function RoadmapPage() {
  return <RoadmapPageClient />;
}
