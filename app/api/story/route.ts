import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Story intake.
 *
 * A submission is forwarded to STORY_INTAKE_URL — the Google Apps Script
 * deployment that writes the row to the intake sheet and notifies
 * ben@luminary-tech.ai for approval. Nothing reaches the wall automatically.
 */
export async function POST(req: Request) {
  let payload: { story?: string; name?: string; city?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Malformed submission." }, { status: 400 });
  }

  const story = (payload.story ?? "").trim();
  const name = (payload.name ?? "").trim().slice(0, 120);
  const city = (payload.city ?? "").trim().slice(0, 120);

  if (!story) {
    return NextResponse.json({ error: "Story is required." }, { status: 400 });
  }
  if (story.length > 8000) {
    return NextResponse.json({ error: "That story is too long." }, { status: 400 });
  }

  const endpoint = process.env.STORY_INTAKE_URL;
  if (!endpoint) {
    console.error("[story-intake] STORY_INTAKE_URL is not set — submission dropped");
    return NextResponse.json({ error: "Intake is not configured." }, { status: 503 });
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      redirect: "follow",
      body: JSON.stringify({
        story,
        name,
        city,
        source: "news.theluminary.network",
        receivedAt: new Date().toISOString(),
      }),
    });
    if (!res.ok) throw new Error(`intake responded ${res.status}`);

    // Apps Script answers 200 even when its own handler failed, so the body
    // is the real receipt. Without this check a submission could be lost
    // while the person is told it was received.
    const receipt = await res.text();
    if (!/"ok"\s*:\s*true/.test(receipt)) {
      throw new Error(`intake did not confirm: ${receipt.slice(0, 200)}`);
    }
  } catch (err) {
    console.error("[story-intake] forward failed:", err);
    return NextResponse.json({ error: "Could not deliver." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
