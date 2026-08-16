# Process overview

## What I built

The power law allocator: a visitor splits a fixed $10M fund across 15
startups with steppers, then draws simulated returns for each and sees the
resulting fund multiple. Re-running the draw with a different split shows the
outcome is dominated by whichever startup happens to hit the tail, not by how
the fund was diversified.

## The moments that mattered

1. **Choosing a return-distribution approach** --- there's no licensable
   per-deal VC returns dataset, only aggregate published stats (e.g.
   Correlation Ventures: roughly two-thirds of financings return below 1x, a
   small share return 10x or more). Rather than fabricate per-startup numbers
   or chase an unavailable exact dataset, I modelled a mixture distribution
   (loss/modest/strong bands plus a Pareto tail for the top ~3%) calibrated to
   match that aggregate shape, and labelled it explicitly as modelled in the
   UI copy and cited the calibration source in the footer, not just in code
   comments. I checked this was actually working by scripting slider drags
   and submits against the built `dist/index.html` with jsdom and reading the
   resulting fund-return values, rather than assuming the draw logic was
   correct from reading the code
   ([`3ba1222`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-tejastagra/commit/3ba1222)).

2. **Fixed-sum sliders instead of a clamped remaining balance** --- the
   obvious implementation is to clamp each slider so the running total can't
   exceed the fund, leaving `fund-remaining` as unallocated cash. Instead I
   made moving one slider proportionally rescale the other 19 so the total is
   always exactly the fund and `fund-remaining` reads $0 --- because the brief
   says the fund is fixed, and a UI that lets cash sit idle undercuts the
   thesis that diversifying doesn't change the fund's fixed size. Verified
   with the same jsdom script: dragging one slider to its max drives the other
   19 to exactly zero, and a partial drag rescales them proportionally with
   the sum still landing on exactly $10,000,000 every time
   ([`3ba1222`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-tejastagra/commit/3ba1222)).

3. **Reversing the fixed-sum slider model once it became the headline number**
   --- the earlier build kept `fund-remaining` at a constant $0 by
   proportionally rescaling every other slider whenever one moved. That was
   fine as a small status line, but once the design pass made "remaining" a
   large sticky headline number, a value that's permanently $0 would read as
   broken rather than as a feature. I swapped to a clamped countdown instead:
   each slider's own headroom is its current value plus whatever's
   unallocated, so remaining genuinely counts down and back up, and submit is
   disabled with an explicit prompt until it hits exactly $0. Checked with a
   jsdom script driving real `input` events: raising a slider past its
   current headroom clamps rather than overshoots, remaining updates and the
   submit button's `disabled` state flips correctly in both directions
   ([`6127606`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-tejastagra/commit/6127606)).

4. **Reversing the "don't copy lawsofux.com" rule on purpose** --- CLAUDE.md
   originally said not to copy lawsofux.com's card-grid layout or per-card
   colour variety. When asked to make cards big and visually distinct with a
   colour and icon per startup, in that specific style, I flagged the direct
   conflict with the existing rule rather than just doing it, since silently
   overriding a written constraint isn't a small decision. Given the explicit
   go-ahead, I updated CLAUDE.md's "Visual style reference" section first, so
   the rule and the code agree, then built per-card accent colours and icons.
   I also added a "How the power law works" explainer section styled after
   ciechanow.ski/mechanical-watch, using static example diagrams clearly
   labelled as illustrative rather than live simulation output, to keep the
   data-integrity rule intact even as the design scope grew
   ([`50725a0`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-tejastagra/commit/50725a0)).

5. **Adding per-startup returns after a design review question** --- until now
   the payoff section only showed the fund-level multiple (yours vs. even
   split vs. concentrated), which never actually showed which single startup
   caused it. When asked why the UI didn't show per-company returns to make
   the outlier visible, I agreed it was a real gap against the thesis and
   added a return badge per card plus a ranked breakdown list, highlighting
   whichever startup's draw is the outlier. Verified with a jsdom script that
   drives a real submit and checks the top of the ranked list matches the
   highlighted card
   ([`72815d6`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-tejastagra/commit/72815d6)).

6. **Making the "one outlier carries the fund" diagram live instead of static**
   --- every explainer diagram until now was a fixed illustrative example,
   deliberately kept separate from the real simulation to protect the
   data-integrity rule. When asked to make this specific diagram reflect the
   visitor's actual result, I judged it was safe to break that separation only
   for this one chart, because it now computes directly from the same
   allocation and multiple values the live draw already produced (dollar
   return per startup, sorted descending), rather than introducing any new
   or fabricated figures. The other two explainer diagrams stay static and
   labelled illustrative. Verified with a jsdom script driving a real
   randomise-then-submit and checking the caption text and bar count update
   to match the 15 startups
   ([`2dc5be8`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-tejastagra/commit/2dc5be8)).

7. **Replacing an unsourced citation with a traceable one** --- the footer
   named "Correlation Ventures" without a link, which is a name-drop rather
   than a citation a reader can check. I searched for and added a real,
   checkable secondary source (an arXiv paper that itself cites the original
   Correlation Ventures studies with figures) rather than leaving a bare
   attribution, since the data-integrity rule asks for a citation in the app
   itself, not just a plausible-sounding name
   ([`2dc5be8`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-tejastagra/commit/2dc5be8)).

8. **Swapping per-card line icons for lawsofux.com-style colour blocks** ---
   the card grid originally used a small stroke icon on a pastel background per
   startup. Asked to match lawsofux.com's card grid more directly, I replaced
   the icons with a full-bleed abstract motif (dot grid, circle-and-triangle,
   stripes, concentric circles) drawn as inline SVG and recoloured per card
   from a small shared muted palette, rather than hand-authoring 15 bespoke
   graphics or shipping an external image per card. The post-invest
   "cards converge, outlier stays distinct" behaviour had to move with it: it
   now dims the header artwork on every non-outlier card and plays a reveal
   animation on the outlier's card, instead of recolouring the whole card
   background as before. Verified with a jsdom script driving repeated
   randomise-then-submit runs: all 15 cards render a distinct motif/colour
   pair, exactly 14 headers pick up the dimmed state and 1 card gets the
   outlier reveal every time, even when the same card wins twice in a row
   ([`a390818`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-tejastagra/commit/a390818)).

9. **Rewriting the bubble chart's packing instead of tuning the old spiral**
   --- the ranked-list-turned-bubble-chart had two real bugs: the dominant
   circle could be wide enough to run off the viewport with its own label
   clipped, and small circles could drift into overlapping it. Rather than
   patch the existing spiral-search packing with after-the-fact overlap
   checks, I replaced it with a shelf/row bin-packer (biggest circles first,
   fixed row bands) so non-overlap follows from how it's built rather than
   from a runtime fixup, and capped every radius at half the container's own
   width so the largest circle can never exceed it. I also added a shared
   minimum radius sized to the hardest-to-fit startup name, with area scaling
   proportionally above that floor, so a return multiple near zero never
   produces an illegible circle. Checked with a jsdom script driving a real
   allocate-and-submit: the outlier's radius matched the computed cap
   exactly, zero circles overlapped at rest before any drag, and none
   exceeded the chart's own bounds
   ([`e3545b8`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-tejastagra/commit/e3545b8)).

10. **Adding drag with soft collision, not full physics** --- once circles
    could be dragged, letting the visitor push the outlier onto a small
    circle and leave them overlapping would undercut the whole point of the
    chart. I used native Pointer Events (one code path for mouse and touch)
    and a simple iterative push-apart pass that keeps the dragged circle
    exactly under the pointer while nudging anything it overlaps clear,
    rather than a full spring/velocity simulation, since the brief asked for
    "soft collision, not full realism." Verified by scripting a pointer
    drag against the built page and checking zero circles overlapped
    afterwards
    ([`e3545b8`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-tejastagra/commit/e3545b8)).

11. **Replacing the bubble chart's shelf-pack with a column layout after it
    ballooned vertically** --- capping the dominant circle's radius at half
    the *entire* container width meant its own row alone was roughly as tall
    as the page was wide, so the chart collapsed into one narrow, very tall
    column instead of spanning the page, however wide the viewport actually
    was. I replaced the row-based shelf packer with a column-based (masonry)
    layout: circles are capped to fit inside their own column rather than
    half the whole page, and each new circle joins whichever column is
    currently shortest, so the biggest circles land side by side across the
    top and the chart genuinely uses the full width. Checked with a jsdom
    script comparing the resulting chart's width-to-height ratio before and
    after at three widths (350/1300/1920px): the height-to-width ratio
    dropped from roughly 1.55–3.3 to 0.26–2.46, with zero overlapping
    circles and none out of bounds at any width
    ([`7524f00`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-tejastagra/commit/7524f00)).

12. **Replacing the column layout with real greedy circle packing** --- the
    masonry columns fixed the vertical ballooning but still looked like a
    grid: circles sat in separate vertical lanes with visible gaps between
    them, not a connected mass, and small circles at column edges had
    nothing to touch. Told explicitly to use "an actual packing approach ---
    largest circle first, each subsequent circle fitted against the existing
    cluster at the nearest valid touching position" rather than a grid or
    column layout, I rewrote the packer around exact circle-circle tangent
    geometry: place the biggest circle, then for each remaining circle try
    every pair of already-placed circles' tangent points (falling back to a
    tangent search against the single nearest circle if no pair yields a
    valid spot), keeping the candidate closest to the cluster's centre. I
    also dropped the legibility floor on circle size entirely --- area is now
    purely proportional to return multiple with no minimum --- and instead
    place a compact "name multiple" label just outside any circle too small
    to hold its label inside, since forcing tiny circles to grow to fit text
    contradicted the "no minimum floor" requirement. The whole pack is then
    scaled uniformly to fit the viewport (capping upscale so a sparse pack
    doesn't blow out), with an iterative correction pass because outside
    labels extend past their circle's own edge and can widen the true
    footprint past the first-pass scale. Continuous idle drift was added on
    top --- each circle bobs on its own sine/cosine timing, running through
    the same collision resolver used for dragging so idle motion can never
    introduce overlap, and disabled entirely under `prefers-reduced-motion`.
    Verified with a jsdom script driving allocate-and-submit at three widths
    (1920/390/1300px) across repeated random draws: every circle touches at
    least one neighbour and none overlap at rest, none exceed the viewBox,
    and a synthetic worst-case corner drag on the narrow viewport converges
    to at most a few px of residual overlap (often exactly zero) after
    raising the collision resolver's iteration count, consistent with the
    brief's "soft collision, not full realism" framing rather than an exact
    physics solve
    ([`0bbacfe`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-tejastagra/commit/0bbacfe)).

13. **Discovering the Reset button itself didn't fully reset** --- asked to
    make the closing "Try the simulator again" link behave like the existing
    Reset button, then scroll back up, I first checked what Reset actually
    restored rather than assuming it was already correct. `resetCardColors()`
    cleared the bubble chart and the per-card results, but never touched the
    two explainer diagrams that swap to live results on submit ("One outlier
    carries the fund" and "diversifying does not change this"), so either
    button would have left a stale draw showing after a reset. Rather than
    wire the link to the incomplete behaviour, I snapshotted both diagrams'
    original illustrative state on page load, pulled the reset logic into one
    `resetSimulator()` function extended to restore that snapshot, and had
    both the Reset button and the new link call it. Verified with a jsdom
    script driving a real submit then a real click on the link: fund return,
    remaining, submit's disabled state, both diagrams' captions/values and the
    bubble chart all landed back at their pre-submission values, and
    `scrollIntoView` fired
    ([`e9422f5`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-tejastagra/commit/e9422f5)).

14. **Finding the same missing-space-before-link bug in three separate spots**
    --- told about one instance (the author panel reading "piece,Tejas
    Tagra"), I traced it to an Astro/JSX-style whitespace-elision pattern used
    throughout the file, where a text node ending right before a line-broken
    `<a>` tag loses its trailing space at compile time. Rather than patch that
    one spot, I grepped every `<a` in the page and checked each one's built
    output text, which turned up the same bug in the closing explainer
    paragraph and the footer's arXiv citation. Fixed all three by keeping the
    space in the same text node as the tag rather than across a line break,
    confirmed by grepping the built `dist/index.html` for the exact phrases
    ([`e9422f5`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-tejastagra/commit/e9422f5)).

15. **Adding a height fit alongside the existing width fit, after the overflow
    bug resurfaced** --- the bubble chart's cluster-scaling step only ever fit
    the pack to the container's width, so an extreme draw (a 100x+ outlier)
    could pack into a cluster tall enough that the dominant circle filled the
    whole visible chart, with the rest scrolled out of view below it. Since
    this exact overflow had supposedly been fixed once already
    ([`e3545b8`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-tejastagra/commit/e3545b8)),
    I didn't trust a visual check alone this time: I forced the draw's
    Pareto tail branch in a jsdom script (monkey-patching `Math.random` so the
    outlier hits close to its 300x cap) at both marking viewports before
    touching any code, to see the bug reproduce concretely rather than assume
    the report was accurate. The fix adds one more uniform shrink pass, after
    the existing width fit, that scales the whole cluster down to a hard
    height ceiling (a fraction of the viewport height) whenever the packed
    height would exceed it, plus a CSS `max-height`/`overflow: hidden`
    backstop on the container itself as the "no matter what" ceiling the
    brief asked for. Re-running the same forced-outlier script confirmed the
    viewBox height now sits at or under the cap at both viewports, with a
    normal (non-extreme) draw unaffected
    ([`7b30cc7`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-tejastagra/commit/7b30cc7)).

## Before you ship

`pnpm check:evidence` verifies your citations resolve to real commits, that the
current reflection entry is in `reflections/`, and that your `CLAUDE.md` is
there --- before a marker ever opens the file. It checks that your map is
traceable, not that it is good: the marker judges whether your small,
deliberately chosen set of moments shows real judgement and reflection. A green
check is not a substitute for that curation.

Images are deliberately not checked, because whether one renders is visible the
moment you look. Open this file on GitHub and look at it before you ship.
