# Process overview

A reading-guide to how the work came together --- a map to your process, not an
essay about it.

## What I built

The power law allocator: a visitor splits a fixed $10M fund across 20
startups with sliders, then draws simulated returns for each and sees the
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

## Before you ship

`pnpm check:evidence` verifies your citations resolve to real commits, that the
current reflection entry is in `reflections/`, and that your `CLAUDE.md` is
there --- before a marker ever opens the file. It checks that your map is
traceable, not that it is good: the marker judges whether your small,
deliberately chosen set of moments shows real judgement and reflection. A green
check is not a substitute for that curation.

Images are deliberately not checked, because whether one renders is visible the
moment you look. Open this file on GitHub and look at it before you ship.
