import { TimetablePageClient } from "@/components/client/TimetablePageClient";

export const dynamic = "force-dynamic"; // SSR

export default function TimetablePage() {
  return <TimetablePageClient />;
}
