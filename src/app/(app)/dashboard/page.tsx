import { DashboardPageClient } from "@/components/client/DashboardPageClient";

export const dynamic = "force-dynamic"; // SSR

export default async function DashboardPage() {
  return <DashboardPageClient />;
}
