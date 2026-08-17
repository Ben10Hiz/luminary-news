/**
 * Seeds a handful of sample stories so you can see the design with real
 * content in it. These are placeholders — delete them from the newsroom
 * before or after you publish your first real story.
 *
 *   node scripts/seed-samples.mjs
 *
 * Never run this against production unless you want the samples there.
 */
import postgres from "postgres";
import { readFileSync, existsSync } from "fs";

for (const f of [".env.local", ".env"]) {
  if (existsSync(f)) {
    for (const line of readFileSync(f, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  }
}

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!url) {
  console.error("Set DATABASE_URL first.");
  process.exit(1);
}

const sql = postgres(url, { ssl: url.includes("localhost") ? false : "require" });

const days = (n) => new Date(Date.now() - n * 86400000);

const stories = [
  {
    slug: "sample-newsroom-opens",
    title: "The Luminary Network opens its own newsroom",
    dek: "Starting today, the work we do gets reported here first — in full, in our own words, with the reasoning attached.",
    section: "announcements",
    tags: ["newsroom", "network"],
    author: "Ben Hizer",
    author_title: "Founder, The Luminary Network",
    featured: true,
    published_at: days(0),
    body: `For most of the last two years, the story of what we were building lived in scattered places — a changelog entry here, a conversation in the Lobby there, a slide in a deck that three people saw. None of it added up to a record.

This is the record.

## Why a newsroom and not a blog

A blog is a place to post. A newsroom is a commitment to cover something — consistently, on the record, including the parts that are inconvenient. We chose the second word deliberately.

That means a few things in practice. Stories carry bylines, because someone should be accountable for every claim. Corrections happen in place with a note attached, not by quiet edit. And when we get something wrong, the correction gets the same prominence as the original.

> If it's worth announcing, it's worth explaining. If it's worth explaining, it's worth signing your name to.

## What we'll publish

**News** covers what changed and when. Releases, partnerships, infrastructure, the occasional outage post-mortem.

**Features** are the longer pieces — how a decision got made, what we tried first, what it cost.

**Research** is where our data goes when it's interesting enough to share. Benchmarks, findings, methodology included so you can argue with it.

**Announcements** are the formal record: versions, deprecations, policy.

**Voices** is opinion, clearly labeled, from people close to the work.

## How to follow

Every story lands in the [RSS feed](/feed.xml) the second it publishes. No account, no newsletter gate, no algorithm deciding whether you see it.

More soon.`,
  },
  {
    slug: "sample-what-we-learned-shipping-the-lobby",
    title: "What we learned shipping the Lobby",
    dek: "Six months, four rewrites, and one assumption that turned out to be completely wrong.",
    section: "features",
    tags: ["product", "engineering"],
    author: "Ben Hizer",
    author_title: "Founder, The Luminary Network",
    published_at: days(3),
    body: `The first version of the Lobby was a list. You opened it, you saw everything available to you, you picked one. It tested well in the room and badly everywhere else.

## The assumption

We assumed people arriving at a network want to see the network. Breadth first, then depth. Every early design decision followed from that: a dense index, aggressive categorization, search as the primary verb.

What actually happened is that people arrived with one thing in mind and treated everything else as noise. Breadth wasn't reassuring. It was work.

## What changed

The rewrite inverted the default. The Lobby now opens on the last thing you touched, and the index is one gesture away rather than the destination.

Three numbers moved:

| Metric | Before | After |
| --- | --- | --- |
| Time to first action | 41s | 9s |
| Sessions with zero actions | 34% | 11% |
| Return within 7 days | 22% | 48% |

## What we'd do differently

Test the assumption, not the design. We spent four months iterating on the presentation of a list when the question was whether there should be a list at all.

The cheapest experiment we never ran would have been a single screen with one button on it.`,
  },
  {
    slug: "sample-latency-report",
    title: "Where the latency actually goes",
    dek: "We instrumented the full request path for thirty days. The network was never the problem.",
    section: "research",
    tags: ["research", "performance"],
    author: "Luminary Research",
    author_title: "",
    published_at: days(8),
    body: `Everyone on the team had a theory about why some requests felt slow. So we stopped theorizing and measured every hop for thirty days.

## Method

We tagged every request with a trace ID at the edge and recorded timing at seven points: edge accept, auth, routing, cold-start (when applicable), handler, data layer, and serialization. 4.2 million requests, no sampling.

## Findings

**Cold starts accounted for 61% of the p99.** They were only 0.8% of requests, but when they hit, they hit for 1.4 seconds.

**The data layer was fast and boring.** p50 of 11ms, p99 of 34ms. It was never the bottleneck anyone thought it was.

**Serialization was the surprise.** Responses over 200KB spent more time being serialized than being fetched. We were shipping fields nobody read.

## What we changed

We trimmed default response payloads by 70% and moved the heavy fields behind an explicit opt-in. p99 dropped from 1.9s to 340ms without touching the database at all.

The lesson is old and keeps being true: measure the whole path, not the part you find interesting.`,
  },
  {
    slug: "sample-on-building-in-public",
    title: "Building in public is not the same as building in front of an audience",
    dek: "One is a discipline. The other is a performance. It took us a while to tell them apart.",
    section: "voices",
    tags: ["opinion", "culture"],
    author: "Ben Hizer",
    author_title: "Founder, The Luminary Network",
    published_at: days(14),
    body: `There's a version of building in public that's really just marketing with a progress bar. You post the wins, you frame the losses as learnings, and you never publish anything that would make a reasonable person less likely to buy.

It works, in the narrow sense. It also teaches you nothing.

## The version worth doing

The useful version has one rule: publish the thing that would embarrass you slightly. The failed approach. The number that went the wrong way. The decision you reversed.

Not because self-flagellation is virtuous, but because those are the only posts that generate real feedback. Nobody can correct a victory lap.

## The cost

It is genuinely harder. You have to be right often enough that being wrong publicly doesn't sink you, and you have to write with enough precision that people argue with your reasoning rather than your tone.

Worth it anyway.`,
  },
  {
    slug: "sample-network-status-update",
    title: "Network status: what happened on the 9th",
    dek: "A configuration change took the edge layer down for 22 minutes. Here's the full timeline and what we've changed.",
    section: "news",
    tags: ["incident", "infrastructure"],
    author: "Luminary Engineering",
    author_title: "",
    published_at: days(21),
    body: `On the 9th, between 14:02 and 14:24 UTC, requests to the network returned 502 errors. This is the full account.

## Timeline

**14:02** — A routine configuration deploy shipped a routing rule with an inverted match condition.

**14:03** — Error rate crossed the alerting threshold. On-call paged.

**14:09** — Cause identified as the 14:02 deploy.

**14:14** — Rollback initiated.

**14:24** — Error rate returned to baseline.

## Root cause

The routing rule was syntactically valid and semantically inverted. Our config validation checked the former and not the latter, so it passed CI cleanly.

## What we've changed

1. Config deploys now go through a shadow-evaluation step against replayed production traffic before they take effect.
2. Routing changes roll out to 1% of edge nodes for five minutes before proceeding.
3. Alerting threshold for 5xx rate dropped from 2% to 0.5%.

We're sorry for the disruption.`,
  },
];

const { rows } = { rows: null };

await sql`SELECT 1`;

let inserted = 0;
for (const s of stories) {
  await sql`
    INSERT INTO stories
      (slug, title, dek, body, section, tags, author, author_title, status, featured, published_at)
    VALUES
      (${s.slug}, ${s.title}, ${s.dek}, ${s.body}, ${s.section},
       ${s.tags}, ${s.author}, ${s.author_title ?? ""}, 'published',
       ${s.featured ?? false}, ${s.published_at})
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      dek = EXCLUDED.dek,
      body = EXCLUDED.body,
      section = EXCLUDED.section,
      tags = EXCLUDED.tags,
      author = EXCLUDED.author,
      status = 'published',
      featured = EXCLUDED.featured,
      published_at = EXCLUDED.published_at,
      updated_at = NOW()`;
  inserted++;
}

console.log(`Seeded ${inserted} sample stories.`);
console.log("Delete them from /admin once your own reporting is in.");
await sql.end();
