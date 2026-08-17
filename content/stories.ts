/**
 * Stories live here, in the repo. No database, no CMS, no admin — a story is
 * an entry in this array, and publishing is a commit.
 *
 * To add one: copy the shape below, put it at the top of the array, and give
 * it a slug that will read well in a URL.
 */

export type Story = {
  slug: string;
  title: string;
  dek: string;
  kicker: string;
  author: string;
  authorTitle: string;
  publishedAt: string; // ISO date
  body: string; // Markdown
};

export const stories: Story[] = [
  {
    slug: "what-iread-looks-like-from-the-inside",
    title: "What IREAD looks like from the inside",
    dek: "In the first year Indiana enforced its third-grade reading law, roughly three thousand children were held back. These are the accounts of the families and teachers who watched it happen to them.",
    kicker: "Investigation",
    author: "The Luminary Network",
    authorTitle: "",
    publishedAt: "2026-08-16",
    body: `## What IREAD is

A 38-question multiple-choice reading test, taken on a computer. There is one line on it: **446**. Above the line a child goes to fourth grade. Below it, they do third grade again.

**Below the score line does not mean a child cannot read.** You can know how to read and fail this test. The questions are strange — not always straightforward — and it was never crafted to find out *why* a child struggles.

## What a child is given

- No chance to **read aloud to anyone** — no adult ever hears them read
- No measure of fluency — **0%** of the questions
- No measure of phonemic awareness — **0%** of the questions
- Barely a phonics test — **four questions**
- If the child has dyslexia: the computer reads the **directions**, not the passage
- If the child is still learning English: **no glossary, in any language**

## The questions themselves

These are real IREAD questions, published by the Indiana Department of Education in its own item sampler and item specifications. Read them the way an eight-year-old meets them — alone, on a screen, with a year of school resting on the answer.

### Released item

> "Find the word that has the suffix, and ONLY the suffix, underlined."
>
> careless · beautiful · quicker · suddenly

All four words have a suffix. The child is not being asked to read them — they are being asked to judge whether somebody else drew the underline in the right place. **A child who reads all four words perfectly can get this wrong.**

*IREAD-3 Item Sampler, Indiana Department of Education*

### Released item

> "Find the word that has the same vowel sound as the underlined part of *sad*."
>
> pain · chart · crash · waste

Four different spellings of the letter *a*, four different sounds. This is a sorting exercise about English spelling. **Nothing about it tells you whether a child can read a book.**

*IREAD-3 Item Sampler, Indiana Department of Education*

### Released item

> "Find the word that has the same beginning sounds as *grass…grass*."
>
> gray · guest · glove

The word is spoken aloud, twice. The child has to hold two consonant sounds in their head and match them against three printed words that all start with *g*. **Miss what was said and there is no way back to the answer.**

*IREAD-3 Item Sampler, Indiana Department of Education*

### Released item

> "At school Joe saw a bike, a swing, and a book. What did Joe see last?"
>
> a bike · a book · a swing

The answer is the last noun in the sentence. Indiana files this under text structure and rates it **Depth of Knowledge 2** — the hardest level of thinking anything on this test is rated at.

*IREAD-3 Item Specifications, standard 3.RN.3.2*

## What the specifications say

Indiana's own specifications list **two item types**, and only two: multiple choice, and multi-part multiple choice. **A child is never once asked to read something out loud, or to write a sentence.**

Depth of Knowledge runs **1 to 4**. Across Indiana's published IREAD items, **nothing is rated above 2**. The test that decides whether a child repeats a year does not ask a single question above the second of four levels.

Some of what IREAD tests is not third grade work. The specifications assess **first-grade and second-grade standards** — 1.RF.3, 2.RF.2, 1.RC.4 — inside the test used to hold a third grader back.

This is what 446 is measuring. Below the line does not mean a child cannot read. It means they got fewer of these right.

## This test was never built to do this

From the contract Indiana signed with Cambium Assessment, the test provider.

> "…scale scores are mapped to two performance levels: Level 1: Did Not Pass · Level 2: Pass."
>
> Contract, p. 43

**Can it tell you why a child failed?** No. This is a very basic test — 38 multiple-choice questions, and one of two words back. It cannot say whether a child struggles with sounds, with vocabulary, with a computer, or was reading fine and met strange questions on a bad morning. Teachers were promised feedback. What they get is a verdict — and they are left to carry the retakes, the summer school and the retraining themselves. Indiana's own sample report home is a number and three percentages, and one instruction: **contact your student's teacher or school principal**.

*Contract, pp. 42–43; IREAD-3 sample Individual Student Report, IDOE*

> "IREAD-3 applies principles of evidence-centered design."
>
> Contract, p. 42

**Evidence of what?** The science of reading has five parts: phonemic awareness, phonics, fluency, vocabulary, comprehension. Indiana paid for a study of its own test against them. The answer: phonemic awareness **0%** of questions. Fluency **0%**. Phonics **four questions**. The report states the test **cannot measure fluency**. **The Department has had that finding since 2023.**

*EdMetric LLC, commissioned by IDOE, filed with the General Assembly, 2023*

Whatever you believe this test measures, **nobody improves a result they refuse to examine.** Indiana has shown no interest in why these children did not clear the line — not to fix the teaching, not to fix the test. **You cannot raise a number you have never tried to understand.**

## And the 9,100 who just failed?

Roughly **9,100 third graders did not pass** this year. At the State Board meeting on 11 August 2026 — the meeting announcing the results — that number was never said aloud. Neither was the word **retention**. No board member asked what happens to those children. **This system is Secretary Jenner's. The inattention starts at the top.**

*IDOE 2026 results; transcript, Indiana State Board of Education, 11 August 2026*

Every figure Indiana celebrated this week travelled from Cambium Assessment to the Department and onto a podium. Nothing has been asked. **Indiana's education press has failed us** — not one reporter has asked for any understanding of the children who fail.

We are going to change that.

The Department files an eight-year-old's score under **career and postsecondary readiness** — on the dashboard that ends in median income five years after graduation — and publishes, **with no source given anywhere**, that passing makes a child "roughly 35% more likely to graduate high school."

*Indiana GPS indicators and methods of calculation, IDOE; in.gov/doe*

Who in their right mind believes that?

**Indiana's Department of Education is a marketing operation in control of our children's education.**

A child's love of books belongs to that child. To the media: you have used that story over and over, in a way that hands the credit to this test and to Secretary Jenner. By doing so you hand them a stamp of approval — to carry on with Cambium Assessment, to keep pretending, and to keep hurting children in the name of reading, which is not what this test measures or represents.

## In their own words

> My son is being held back despite me nor his teachers not having any real concern about his third grade reading or comprehension skills.
>
> Keyue Renee — Parent, South Bend, June 2026

> I don't know how, for an 8 or 9-year-old, that you tell them they're not good at reading and then make them do the year all over when it's already been a struggle for them — and then what, just tell them to try harder at school?
>
> A parent of a rising third grader with dyslexia — spoke anonymously, Mirror Indy, 2025

> It's just putting kids in a bad education situation for the rest of their lives.
>
> A parent of a rising third grader with dyslexia — spoke anonymously, Mirror Indy, 2025

> My son's entire 3rd grade missed their 2nd recess for an entire semester for additional IREAD practice, even though the majority had already passed it in 2nd grade.
>
> Elizabeth Welty — Parent, August 2026

> My son told me this morning his son broke down in tears in the car as they pulled up and he couldn't figure out why. He did get him calmed down but I know he is worried about him. He wasn't like that on e-learning day at my house Tuesday. He was laughing and worked hard and fast to finish all his assignments so he could have free time to play.
>
> Venus Cannon — Grandparent, November 2025

> He took the test three times, scoring about the same even after summer school and their literacy specialist.
>
> Keyue Renee — Parent, South Bend, June 2026

> My youngest son's newly assigned case manager, who got her masters in special education in the past 5 years, admitted to me that she has never heard of developmental language disorder before and does not know how to help my son. She also admitted she knows very little about dyslexia. My older son's case manager does not know what dysgraphia is.
>
> Nicole Gardner — Parent of two sons with dyslexia and dysgraphia, November 2025

---

**Kids are people. They're not statistics.**
`,
  },
];

export function allStories(): Story[] {
  return [...stories].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getStory(slug: string): Story | undefined {
  return stories.find((s) => s.slug === slug);
}
