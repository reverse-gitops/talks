# Config Deserves Better: draft notes

Working notes for [manifesto.md](manifesto.md). Not for publication.

## Draft notes: name options

DNS checked on 2026-10-02 (no records = probably free; still to confirm at a registrar).

| Name | DNS | Pros | Cons |
|---|---|---|---|
| **configdeserves.design** | free? | **Current favourite.** The domain itself reads as the claim, and it's principle 1 and the opening thesis ("good configuration design is application design"). Answers "better how?" directly. More demanding than "thought": design is work, not just attention. Short, and it speaks to product managers and designers too. | Some may read "design" as only UI design (the text corrects that). The "dot" in the middle needs saying out loud once. Less familiar TLD, so check renewal prices. Breaks the `.dev` link with reversegitops.dev. |
| configneeds.design | free? | Shorter. Pragmatic: a necessity, not a plea, which engineers may take more seriously. Echoes your earlier talk title "GitOps Needs an API". | Loses the underdog angle ("settings are treated as second-class"). Breaks the parallel with the closing line ("…deserves deliberate design. Developers deserve better tools…"). |
| configdeservesbetter.dev | free? | Memorable, opinionated, demanding. The manifesto now answers "better how?" itself: better design, explicit trade-offs, better foundations. Strong closing line. | Can sound like a complaint when read without the text. |
| configdeservesthought.dev | free? | Matches the focus on design and trade-offs. Hard to read as a pitch. Easy to say out loud. | Less memorable and less demanding: almost anyone agrees something deserves thought without changing their practice. |
| configurationdeservesbetter.dev | free? | More inclusive word for product managers and designers. | Long, easy to misspell. |
| configurationdeservesthought.dev | free? | Same as above. | Long, easy to misspell. |
| settingsmatter.dev | free? | Warm and empathetic; the strongest opening phrase. Short. | A theme, not a call to action. |
| betterconfig.club | free? | Short. Feels like a community you join, not a complaint; signing the manifesto = joining the club. Fits the audience hall of fame. | `.club` reads less serious to security officers and enterprises; "betterconfig" sounds like a product; the name doesn't carry the claim itself. |
| betterconfig.now | free? | Short and punchy. | Sounds like a product or campaign; `.now` feels less trustworthy to developers. |
| betterconfig.dev | taken | — | Already registered (Cloudflare nameservers). |

Leaning towards configdeserves.design, with configdeservesbetter.dev (and maybe settingsmatter.dev) as redirects.

Reviewer feedback (2026-10-05): prefers **configdeservesbetter.dev**. It covers all eleven principles (design, testing, access, history, delivery), while `.design` narrows the accent and needs explaining out loud. Use "Good configuration design is application design" as the central claim on the site.

## Draft notes: website

- Feature "Good configuration design is application design" as the central claim.
- Hold off on "Relevant to" role filters (from the `relevant:` tags) until there's a demonstrated need. Configuration is shared work, so let visitors read the whole short argument first; roles may help later for examples or deeper articles.
