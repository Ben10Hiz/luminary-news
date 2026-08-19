/**
 * Stories live here, in the repo. No database, no CMS, no admin — a story is
 * an entry in this array, and publishing is a commit.
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
    dek: "Indiana is calling it historic progress. Progress at what? Add more chances to test, take the clock off, and the pass rate goes up — the state mentioned neither change. Its own paid study found the test cannot measure whether a child can read. The Department recites the number, Indiana's press prints it, and with the testing contract up this year they look ready to sign for another round.",
    kicker: "Investigation",
    author: "The Luminary Network",
    authorTitle: "",
    publishedAt: "2026-08-19",
    body: `## What IREAD is

A 38-question multiple-choice reading test, taken on a computer. There is one line on it: **446**. Above the line a child goes to fourth grade. Below it, they do third grade again.

**Below the score line does not mean a child cannot read.** You can know how to read and fail this test. The questions are strange — not always straightforward — and it was never crafted to find out why a child struggles.

## What a child is given

- No chance to **read aloud to anyone** — no adult ever hears them read
- No measure of fluency — **0%** of the questions
- No measure of phonemic awareness — **0%** of the questions
- Barely a phonics test — **four questions**
- If the child has dyslexia: the computer reads the **directions**, not the passage
- If the child is still learning English: **no glossary, in any language**

## The questions themselves

These are real IREAD questions, published by the Indiana Department of Education in its own item sampler and item specifications. Read them the way an eight-year-old meets them — alone, on a screen, with a year of school resting on the answer.

<figure class="item"><p class="item-label">Released item</p><p class="stem">“Find the word that has the suffix, and <strong>ONLY</strong> the suffix, underlined.”</p><ol class="choices"><li>careless</li><li>beautiful</li><li>quicker</li><li>suddenly</li></ol><p class="note">All four words have a suffix. The child is not being asked to read them — they are being asked to judge whether somebody else drew the underline in the right place. <strong>A child who reads all four words perfectly can get this wrong.</strong></p><span class="src">IREAD-3 Item Sampler, Indiana Department of Education</span></figure>

<figure class="item"><p class="item-label">Released item</p><p class="stem">“Find the word that has the same vowel sound as the underlined part of <em>sad</em>.”</p><ol class="choices"><li>pain</li><li>chart</li><li>crash</li><li>waste</li></ol><p class="note">Four different spellings of the letter <em>a</em>, four different sounds. This is a sorting exercise about English spelling. <strong>Nothing about it tells you whether a child can read a book.</strong></p><span class="src">IREAD-3 Item Sampler, Indiana Department of Education</span></figure>

<figure class="item"><p class="item-label">Released item</p><p class="stem">“Find the word that has the same beginning sounds as <em>grass…grass</em>.”</p><ol class="choices"><li>gray</li><li>guest</li><li>glove</li></ol><p class="note">The word is spoken aloud, twice. The child has to hold two consonant sounds in their head and match them against three printed words that all start with <em>g</em>. <strong>Miss what was said and there is no way back to the answer.</strong></p><span class="src">IREAD-3 Item Sampler, Indiana Department of Education</span></figure>

<figure class="item"><p class="item-label">Released item</p><p class="stem">“At school Joe saw a bike, a swing, and a book. What did Joe see last?”</p><ol class="choices"><li>a bike</li><li>a book</li><li>a swing</li></ol><p class="note">The answer is the last noun in the sentence. Indiana files this under text structure and rates it <strong>Depth of Knowledge 2</strong> — the hardest level of thinking anything on this test is rated at.</p><span class="src">IREAD-3 Item Specifications, standard 3.RN.3.2</span></figure>

## What Indiana's own specifications say

Indiana's own specifications list **two item types**, and only two: multiple choice, and multi-part multiple choice. **A child is never once asked to read something out loud, or to write a sentence.**

Depth of Knowledge runs **1 to 4**. Across Indiana's published IREAD items, **nothing is rated above 2**. The test that decides whether a child repeats a year does not ask a single question above the second of four levels.

Some of what IREAD tests is not third grade work. The specifications assess **first-grade and second-grade standards** — 1.RF.3, 2.RF.2, 1.RC.4 — inside the test used to hold a third grader back.

This is what 446 is measuring. Below the line does not mean a child cannot read. It means they got fewer of these right.

## This test was never built to do this

From the contract Indiana signed with Cambium Assessment, the test provider.

> “…scale scores are mapped to two performance levels: **Level 1: Did Not Pass · Level 2: Pass**.”
>
> Contract, p. 43

**Can it tell you why a child failed?** No. This is a very basic test — 38 multiple-choice questions, and one of two words back. It cannot say whether a child struggles with sounds, with vocabulary, with a computer, or was reading fine and met strange questions on a bad morning. Teachers were promised feedback. What they get is a verdict — and they are left to carry the retakes, the summer school and the retraining themselves. Indiana's own sample report home is a number and three percentages, and one instruction: **contact your student's teacher or school principal**.

*Contract, pp. 42–43; IREAD-3 sample Individual Student Report, IDOE*

> “IREAD-3 applies principles of **evidence-centered design**.”
>
> Contract, p. 42

**Evidence of what?** The science of reading has five parts: **phonemic awareness, phonics, fluency, vocabulary, comprehension**. Indiana paid for a study of its own test against them. The answer: phonemic awareness **0%** of questions. Fluency **0%**. Phonics **four questions**. The report states the test **cannot measure fluency**. **The Department has had that finding since 2023.**

*EdMetric LLC, commissioned by IDOE, filed with the General Assembly, 2023*

Whatever you believe this test measures, **nobody improves a result they refuse to examine.** Indiana has shown no interest in why these children did not clear the line — not to fix the teaching, not to fix the test. **You cannot raise a number you have never tried to understand.**

## And the 9,100 who just failed?

Roughly **9,100 third graders did not pass** this year. At the State Board meeting on 11 August 2026 — the meeting announcing the results — that number was never said aloud. Neither was the word **retention**. No board member asked what happens to those children. **This system is Secretary Jenner's. The inattention starts at the top.**

*IDOE 2026 results; transcript, Indiana State Board of Education, 11 August 2026*

Every figure Indiana celebrated this week travelled from Cambium Assessment to the Department and onto a podium. Nothing has been asked. **Indiana's education press has failed us** — not one reporter has asked for any understanding of the children who fail.

We are going to change that.

The Department files an eight-year-old's score under **career and postsecondary readiness** — on the dashboard that ends in median income five years after graduation — and publishes, **with no source given anywhere**, that passing makes a child “roughly 35% more likely to graduate high school.”

*Indiana GPS indicators and methods of calculation, IDOE; in.gov/doe*

Who in their right mind believes that?

**Indiana's Department of Education is a marketing operation in control of our children's education.**

If you want to see how ridiculous it is that this test carries so much weight in a child's life — how “proficient” you are at reading, as they would say — you can take it yourself. We built exact replicas of all of Indiana's learning assessments.

[Take the IREAD yourself, and see how others have done →](https://iread.theluminary.network/)

A child's love of books belongs to that child. To the media: you have used that story over and over, in a way that hands the credit to this test and to Secretary Jenner. By doing so you hand them a stamp of approval — to carry on with Cambium Assessment, to keep pretending, and to keep hurting children in the name of reading, which is not what this test measures or represents.

## The accounts

We have not found all the children who were held back, and Indiana has not said who they are. These are the experiences of the people who have to live in the strange, fake reading-test world Secretary Jenner is creating — parents, grandparents, teachers and school staff. Every line below was said publicly by the person named.

### Parents and families

> My son is being held back despite me nor his teachers <mark class="hl">not having any real concern about his third grade reading</mark> or comprehension skills.
>
> Keyue Renee · Parent, South Bend · June 2026

> My son's entire 3rd grade <mark class="hl">missed their 2nd recess for an entire semester</mark> for additional Iread practice, even though the majority had already passed it in 2nd grade.
>
> Elizabeth Welty · Parent · August 2026

> My son told me this morning his son <mark class="hl">broke down in tears in the car</mark> as they pulled up and he couldn't figure out why. He did get him calmed down but I know he is worried about him. He wasn't like that on e-learning day at my house Tuesday. He was laughing and worked hard and fast to finish all his assignments so he could have free time to play.
>
> Venus Cannon · Grandparent · November 2025

> He <mark class="hl">took the test three times, scoring about the same</mark> even after summer school and their literacy specialist.
>
> Keyue Renee · Parent, South Bend · June 2026

> My youngest son's newly assigned case manager, who got her masters in special education in the past 5 years, admitted to me that she has <mark class="hl">never heard of developmental language disorder</mark> before and does not know how to help my son. She also admitted she knows very little about dyslexia. My older son's case manager <mark class="hl">does not know what dysgraphia is</mark>.
>
> Nicole Gardner · Parent of two sons with dyslexia and dysgraphia · November 2025

> My daughter was one of them that was going to be held back. They tried to hold her back in second grade to get ahead of it and I declined. As soon as this law took effect I fought for her. She already had an IEP for speech and I fought to get her additional testing for learning disability, which she did qualify for one. <mark class="hl">In the end she finally passed</mark>.
>
> Ashley Gates · Parent · November 2025

> I know my grandson can read. I taught him. My son has listened to him read. He reads fourth grade level books easily. He's doing tutoring, but he tells us it's stuff like <mark class="hl">sounding out and spelling cat</mark>, which he was doing several years ago.
>
> Venus Cannon · Grandparent · November 2025

> He told me he didn't have enough time to do the computerized test. <mark class="hl">He thought he could take his time</mark>.
>
> Venus Cannon · Grandparent · November 2025

> My child has not taken these tests. My child has not taken these tests. My child has not taken these tests. <mark class="hl">There, I said it three times</mark>.
>
> Meghan Louise · Parent · August 2025

> Our school spent weeks prepping, doing practice tests, etc. <mark class="hl">Put all spelling tests on hold for about a month, at least</mark>.
>
> Lauren Gilman-Swinefurth · Parent · August 2025

> Not everyone is good at taking tests. Not every child gets enough sleep and a solid breakfast to be able to sustain through the test, and that is beyond the teacher's control. <mark class="hl">And then add the pressure that if they don't pass a test they can't move on</mark>.
>
> Amanda Hamilton · Parent · November 2025

> I'm about to the point of withdrawing permission for my son to take standardized tests and the school can just get over it. <mark class="hl">He wouldn't be on the honor roll with all A's and B's if he wasn't learning what he needs to be learning</mark>.
>
> Nicole Gardner · Parent · November 2025

> My grandson was <mark class="hl">so anxious about taking it</mark>, and was relieved to pass it.
>
> Tawnya Curran · Grandparent · November 2025

> They also, at our school anyway, are forced to take summer school after 2nd grade if they don't pass the IREAD at the end of the year. If they pass at the end of 2nd grade they don't have to take it in third, <mark class="hl">but if they fail it in third they get held back</mark>.
>
> Amber Curry · Parent · August 2025

> <mark class="hl">If the retention part has always been there</mark>, we were never told that. So I highly doubted it was an automatic hold back. Now it seems to be enforced.
>
> Jeremy Knudsen · Parent · August 2025

> <mark class="hl">The number of 'diagnostics' and computer testings my children do each school year is mind blowing</mark>.
>
> Ashley Meade Dembinski · Parent · August 2025

> I went to the IDOE website. It just wasn't as extensive as I had hoped. <mark class="hl">I was looking for an actual practice test but couldn't get anything like it to print</mark>.
>
> Venus Cannon · Grandparent · November 2025

> <mark class="hl">They can be held back for not passing a test</mark>, yet when a parent wants to hold them back in kindergarten or first grade they have to jump through hoops.
>
> Skylar Nusbaum · Parent · August 2025

> They allowed 2nd graders to take it last year as well as 3rd graders, to see if they could test out and not have to take it as a 3rd grader. <mark class="hl">My daughter passed it as a second grader</mark>, so she doesn't take it this year.
>
> Sarah Hebert · Parent · August 2025

> They are also testing them in second grade to see where each kid is, <mark class="hl">and if they pass in second they don't have to take the IREAD in third</mark> — just ILEARN.
>
> Ashley Jacobs Heffner · Parent · August 2025

> IREAD 3 is an untimed assessment. Focus on reading passages and comprehension questions. There is a phonics section but comprehension is the bulk. <mark class="hl">You can find released items on the IDOE website</mark>.
>
> Tamara Mowery Gore · Teacher, replying to a grandmother in the comments · November 2025

> She's not unique. There are kids whose parents die who take the test the next day. <mark class="hl">Kids are people. They're not statistics.</mark> There has to be some room.
>
> Rachel Burke · President, Indiana Parent Teacher Association · WFYI · 2024

### Teachers and school staff

> The school I'm at, <mark class="hl">only 4 passed last year</mark>. We retested twice over the summer and got up to 10.
>
> Danika Williams · School staff · November 2025

> Even with a good cause exemption, kids still have to take and pass. The exemption just allows a student with an IEP to not be held back because of a failing score. Kids will have to continue to take this test <mark class="hl">until 7th grade until they pass</mark>.
>
> Becky Munger Crawford · Title I Coordinator · August 2025

> We really only have three weeks to make a huge gain for some of our students, and a lot of that's not realistic. Some of them are pretty far off and <mark class="hl">don't have an exemption and will be retained</mark>.
>
> Monica Shellhamer · Third grade teacher; officer, Indianapolis Education Association · Chalkbeat · 2025

> <mark class="hl">We are forced to teach for the tests and it's sad</mark>.
>
> Amanda Ortega · Teacher · August 2025

> I've seen it in every school I've worked in. It isn't even about learning to read. <mark class="hl">It's about passing a test</mark>.
>
> Susan Ross · Teacher · August 2025

> Could it be because there were such high stakes — mandatory retention — <mark class="hl">that schools ONLY focused on IREAD and nothing else?</mark>
>
> Amanda Zea · School staff · August 2025

> That is taking away time from science, social studies, and math, not to mention time to explore choice reading, and <mark class="hl">causing kids to hate school</mark> — which will be far more detrimental in the long run.
>
> Malia Perry-Heimbach · Educator · August 2025

> <mark class="hl">I believe the fear of retention and the implementation of the science of reading led to some of these gains</mark>.
>
> April Ann Marie Adams · Third grade teacher, 13 years · August 2025

> When I was in MTSS meetings about 2 years back, in anticipation of this law going into effect, many students that may have once been thought to benefit from being held back were being pushed into the next grade. It was thought that if they held someone back, <mark class="hl">then that person still failed the test</mark>, they would still be required to hold them a 2nd year.
>
> Esperanza Lindsey Monge · Educator · June 2026

> Two years ago when they touted the strong increase, they never shared that they removed the timing, <mark class="hl">which was a significant barrier for many kids</mark>. This year they added an additional testing opportunity, but are again not sharing that.
>
> Tessa Maguire · Educator · August 2025

> <mark class="hl">Why I refuse to go back to teaching</mark>. There is no teaching, it is all about passing tests. According to the leaders you are perfect if you can pass a test, and who cares if you are a bad test taker.
>
> Deb Allen · Former teacher · August 2025

> I swear some of the passages are the same as they were 10 years ago. The only difference is they had to add more, because they are now giving at least 2 more opportunities to test — 2nd grade, <mark class="hl">and you can retake it twice in the summer window</mark>.
>
> Cara Davis Rothrock · Third grade teacher, 11 years, two districts · August 2025

> We did after school tutoring for months, <mark class="hl">and summer school for our kids at risk of not passing</mark>. Lots of time and energy.
>
> Heather Severns Shelley · Educator · August 2025

> The child is bored. Don't accept the results for his placement. <mark class="hl">Demand a human assessment after a month of regular human tutoring</mark>.
>
> Reita Bourget · Retired educator · November 2025

> No spelling tests. <mark class="hl">Kids moving onto 4th grade and cannot spell beginner words</mark>. Same with math — seeing kids in 3rd and 4th grade that can't subtract multiple-digit numbers.
>
> Claudia Roloff · Educator · August 2025

> <mark class="hl">There are schools out there who previously had extremely low pass rates who did whatever they could to focus on making kids pass</mark>.
>
> Amanda Zea · School staff · August 2025

> Students with IEPs still have to take these tests, as well as English Language Learners that have been in country for a short amount of time. They can apply for a good cause exemption for those students, <mark class="hl">but they have DRASTICALLY reduced the number of those that are allowed</mark>.
>
> Allison 'Goodwin' Smiley · Educator · August 2025

> <mark class="hl">I hated it for the kids when testing became the norm</mark>. I tried to make it as fun as I could. I wasn't a good test taker before I was a teacher, so I knew how it felt.
>
> Penny Watterson Cooper · Teacher · August 2025

> The law changed and good cause exemptions weren't allowed anymore. <mark class="hl">Before we could give a GCE to students with IEPs or students who are learning English</mark>.
>
> Erin Kathleen Hodel · Teacher · November 2025

> <mark class="hl">If your kids use these programs and are moved to a lower tier</mark>, you must demand a human assessment as well.
>
> Reita Bourget · Retired educator and tutor · November 2025

> They did change it a little — it's no longer timed. <mark class="hl">For some, the time constraint would cause them not to pass</mark>.
>
> Natalie Sinders Wolfe · Educator · August 2025

> What about our multilingual learners? It takes 6-7 years to become fluent in a language. <mark class="hl">Are they going to retain students whose native language isn't English in 3rd grade?</mark>
>
> Daniel Bailey · Educator · August 2025

### Officials, researchers and others

> I don't know how, for an 8 or 9-year-old, that you tell them they're not good at reading and then make them do the year all over when it's already been a struggle for them — and then what, <mark class="hl">just tell them to try harder at school?</mark>
>
> A parent of a rising third grader with dyslexia · Spoke anonymously · Mirror Indy · 2025

> It's just putting kids in a bad education situation for <mark class="hl">the rest of their lives</mark>.
>
> A parent of a rising third grader with dyslexia · Spoke anonymously · Mirror Indy · 2025

> They made it seem like it was mandatory that they pass in the second grade, when really they're testing them on things that aren't even in his grade level yet. <mark class="hl">They made it seem so scary</mark>, and didn't explain it well enough that it would be OK if he didn't pass this year.
>
> An Indianapolis Public Schools parent · Son did not pass in second grade · Mirror Indy · 2025

> <mark class="hl">Not all kids get to the same level of reading</mark>. Our concern is the lack of prevention.
>
> Amanda Alaniz · Superintendent, Portage Township · Post-Tribune · 2024

> For us, we have a large English language learning population. This is also difficult for our special education students — many of them, <mark class="hl">especially depending on what kind of early learning experience they had</mark>.
>
> Dan Funston · Superintendent, Concord Community Schools · WSBT · 2025

> It's like they just paused at kindergarten or first grade, and now they're in third grade. <mark class="hl">I'm helping them pick up on basically two years of learning</mark>.
>
> Grace Martin · Tutor, Vision Academy · WFYI · 2024

> We celebrate the schools that have 90% or above. <mark class="hl">That's still — at Concord, there are about 400 students in a grade — that's still 40 students</mark>.
>
> Dan Funston · Superintendent, Concord Community Schools · WSBT · 2025

> The new law says that students should pass within two years of arriving in Indiana. So if students are in another state or another country where they speak another language, <mark class="hl">they have two years or less to obtain enough proficiency in English to pass a reading test that is at the same grade level as their peers</mark>.
>
> Jena Kennedy · Director of English Language Learners, Concord Community Schools · WSBT · 2025

> Nope, they just pass them. <mark class="hl">Just like they did me</mark>.
>
> Jennifer Will · Commenter · August 2025

> They passed a law that said kids who don't pass have to be retained, so they taught the kids how to pass the test — <mark class="hl">that's confusing on purpose</mark> — instead of actual learning.
>
> Megan Renee Smith · Commenter · August 2025

> <mark class="hl">This mandate for retention is life-changing for every one of those kids</mark>. And so we are taking it with that level of seriousness.
>
> Lela Simmons · Chief Learning Officer, Indianapolis Public Schools · Chalkbeat · 2025

> <mark class="hl">Indiana is setting itself up for an enormous class action lawsuit</mark>.
>
> Patricia Morita-Mullaney · Professor of Language and Literacy, Purdue; past president, INTESOL · Chalkbeat · 2024

> <mark class="hl">We've known for a long time that retention is not a research-based strategy</mark>.
>
> Chip Pettit · Superintendent, Duneland School Corporation · Post-Tribune · 2024

> <mark class="hl">This is an unfunded mandate, so no additional money came from the state to help these kids</mark>. And now we will need to spend money on an extra year of education costs before they graduate high school.
>
> Douglass Gaking · Commenter · November 2025

> Literally, if they didn't pass they would have to take third grade over again. <mark class="hl">Teachers only focused on the IREAD</mark>.
>
> Kristen Szafasz · Commenter · August 2025

> It's <mark class="hl">very stressful for these 8 and 9 year olds</mark>.
>
> Emily Rose · Commenter · August 2025

> They were told if they fail they'll stay in 3rd grade, so they had <mark class="hl">a little extra weight on their shoulders</mark>.
>
> Kristn Downing · Commenter · August 2025

> <mark class="hl">They had more chances to fail, but that doesn't fit the district narratives</mark>.
>
> April Diamond · Commenter · August 2025

> Standardized tests have their use, but they need to be their own lane, and a small one. <mark class="hl">Teaching to the test is garbage</mark>.
>
> Mark Andrew · Commenter · August 2025

> <mark class="hl">How 412 kids last couple years and 3,000 kids — it's just ridiculous</mark>. Boggles the mind.
>
> Shayne Markcum-Brumback · Commenter · November 2025

> They haven't come up with a remediation program to get to kids before they take the test in third grade. We don't know how to connect the dots. <mark class="hl">We're stuck on stupid</mark>.
>
> Vernon Smith · State Representative and education professor, Indiana University Northwest · Post-Tribune · 2024

> Scare the poop out of parents, teachers and kids by retaining kids who are struggling, and then <mark class="hl">pretend this plan is a success</mark>.
>
> Emily Razz · Commenter · August 2025

> And they get to take it twice in second grade and three times in third grade. <mark class="hl">That helps the average</mark>.
>
> Tom Rosenbaum · Commenter · August 2025

> It's not that they weren't taught to read — they're learning two languages. It takes more time. <mark class="hl">By the time they reach fourth and fifth grade, they're surpassing their monolingual peers</mark>.
>
> Donna Albrecht · Professor of ENL/ESL, Indiana University Southeast · Chalkbeat · 2024

---

**Kids are people. They're not statistics.**

#### A note on sources

Every line above was said publicly by the person named — posted to Facebook, or given to an Indiana news outlet, which is marked on the card. Quotes are verbatim apart from light trimming and the correction of obvious typing errors. Nothing has been added, and no account has been paraphrased. Contract quotations are from the 2025 Indiana–Cambium Assessment agreement, 213 pp., with page numbers as given. The alignment study was commissioned by the Indiana Department of Education and filed with the General Assembly.
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
