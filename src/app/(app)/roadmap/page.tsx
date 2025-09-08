import { RoadmapPageClient } from "@/components/client/RoadmapPageClient";

export const dynamic = "force-dynamic"; // SSR

export default async function RoadmapPage() {
  return <RoadmapPageClient />;
}
