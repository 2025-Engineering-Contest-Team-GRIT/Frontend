import { GraduationPageClient } from "@/components/client/GraduationPageClient";

export const dynamic = "force-dynamic"; // SSR

export default function GraduationPage() {
  return <GraduationPageClient />;
}
