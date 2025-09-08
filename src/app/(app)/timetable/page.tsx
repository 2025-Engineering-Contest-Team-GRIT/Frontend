
import { TimetablePageClient } from '@/components/csr/TimetablePageClient';

export const dynamic = 'force-dynamic'; // SSR

export default function TimetablePage() {
  return <TimetablePageClient />;
}
