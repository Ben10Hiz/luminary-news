import StoryEditor from "@/components/StoryEditor";
import { getSections } from "@/lib/stories";

export const dynamic = "force-dynamic";

export default async function NewStoryPage() {
  const sections = await getSections().catch(() => []);
  return <StoryEditor sections={sections} />;
}
