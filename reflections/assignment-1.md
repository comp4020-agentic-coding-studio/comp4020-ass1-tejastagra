# Assignment 1 reflection

## What was the breakthrough that moved the work forward?

The breakthrough was realising the bubble chart couldn't be patched into
working, it had to be rebuilt around the actual geometry of the problem. The
first version used a spiral-search packer with overlap checks bolted on
afterwards, and every fix I tried (capping radii, adding minimum sizes, moving
to column layout) treated symptoms rather than the cause: non-overlap was
never guaranteed by construction, so something always slipped through at some
viewport width. Switching to real circle-circle tangent packing, placing the
biggest circle first and fitting each subsequent one against the existing
cluster at the nearest valid tangent point, meant non-overlap fell out of how
the layout was built rather than a runtime correction. That same lesson showed
up again later at a smaller scale: the "Try the simulator again" link exposed
that the existing Reset button itself didn't fully reset two of the explainer
diagrams, a bug that had been sitting there unnoticed because nothing had
exercised that exact path before.

## What did this work change about who I want to be as a software developer?

I want to be someone who fixes the mechanism, not the symptom. It's tempting
to patch a bug where it surfaces, but the recurring pattern this assignment
taught me is that a fix which doesn't change *why* something can go wrong will
keep needing more fixes. I also want to keep checking claims against the
running page instead of my mental model of it, since several of these bugs
were only visible once I actually drove the interaction rather than read the
code.
