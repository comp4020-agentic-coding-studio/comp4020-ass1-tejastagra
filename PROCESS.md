# Process overview

A reading-guide to how the work came together --- a map to your process, not an
essay about it.

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

## Before you ship

`pnpm check:evidence` verifies your citations resolve to real commits, that the
current reflection entry is in `reflections/`, and that your `CLAUDE.md` is
there --- before a marker ever opens the file. It checks that your map is
traceable, not that it is good: the marker judges whether your small,
deliberately chosen set of moments shows real judgement and reflection. A green
check is not a substitute for that curation.

Images are deliberately not checked, because whether one renders is visible the
moment you look. Open this file on GitHub and look at it before you ship.
