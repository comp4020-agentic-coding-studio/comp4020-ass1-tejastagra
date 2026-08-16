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

## Before you ship

`pnpm check:evidence` verifies your citations resolve to real commits, that the
current reflection entry is in `reflections/`, and that your `CLAUDE.md` is
there --- before a marker ever opens the file. It checks that your map is
traceable, not that it is good: the marker judges whether your small,
deliberately chosen set of moments shows real judgement and reflection. A green
check is not a substitute for that curation.

Images are deliberately not checked, because whether one renders is visible the
moment you look. Open this file on GitHub and look at it before you ship.
