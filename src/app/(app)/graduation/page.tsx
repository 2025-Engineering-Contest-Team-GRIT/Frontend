import { GraduationPageClient } from '@/components/csr/GraduationPageClient';

export const dynamic = 'force-dynamic'; // SSR

export default function GraduationPage() {
  return <GraduationPageClient />;
}
