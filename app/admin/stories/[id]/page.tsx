import { notFound } from "next/navigation";
import StoryEditor from "@/components/StoryEditor";
import { getById, getSections } from "@/lib/stories";

export const dynamic = "force-dynamic";

export default async function EditStoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;

  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  const [story, sections] = await Promise.all([
    getById(numericId).catch(() => null),
    getSections().catch(() => []),
  ]);
  if (!story) notFound();

  return <StoryEditor story={story} sections={sections} saved={saved === "1"} />;
}
