import type { Metadata } from "next";
import Link from "next/link";
import Masthead from "@/components/Masthead";
import SiteFooter from "@/components/SiteFooter";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About this newsroom",
  description: site.description,
};

export default function AboutPage() {
  return (
    <>
      <Masthead compact />
      <main className="mx-auto max-w-[38rem] px-5 pb-20">
        <header className="pt-14">
          <p className="kicker">About</p>
          <h1 className="headline mt-4 text-[2.5rem] leading-[1.05] sm:text-[3.2rem]">
            Our stories, in our words.
          </h1>
        </header>

        <div className="article dropcap mt-10">
          <p>
            News is the newsroom of {site.name}. It exists so the work we
            do, the decisions behind it, and the people doing it get told
            first-hand rather than second-hand.
          </p>

          <h2>What you&apos;ll find here</h2>
          <p>
            Reporting on what we ship and why. Longer features on the thinking
            behind the product. Research notes and data from our own work.
            Announcements when something meaningful changes. And opinion from the
            people closest to it, clearly labeled as such.
          </p>

          <h2>How we publish</h2>
          <p>
            Every story is written and edited in-house. Corrections are made in
            place with a note; we don&apos;t quietly rewrite history. If something
            here is wrong, we want to hear about it.
          </p>

          <h2>Follow along</h2>
          <p>
            Every story is in the <Link href="/feed.xml">RSS feed</Link> the moment
            it publishes — no account, no algorithm in between. You can also find
            the wider network at{" "}
            <a href={site.parentUrl} target="_blank" rel="noopener noreferrer">
              theluminary.network
            </a>
            .
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
