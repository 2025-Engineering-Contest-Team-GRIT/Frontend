import { CompletionPageClient } from "@/components/client/CompletionPageClient";

export const dynamic = "force-dynamic"; // SSR

export default async function CompletionPage() {
  return <CompletionPageClient />;
}
