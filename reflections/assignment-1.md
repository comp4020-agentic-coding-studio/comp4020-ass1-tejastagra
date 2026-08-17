# Assignment 1 reflection

## What was the breakthrough that moved the work forward?

Partway through, I found two quiet bugs that looked completely fine on screen but were wrong once I checked what the numbers actually meant. One part of my page compares a few investing strategies against the same simulated outcome, to show they all land in a similar, unremarkable place. One of those strategies was hardcoded to always use the same startup, no matter which one had actually done best that round. So its result had nothing to do with what it was meant to represent. A separate chart nearby had the same stubborn problem: one of its four values never changed while the other three did.

Neither bug was visible just by looking. I only found them by asking how the numbers were calculated, not by checking whether the page updated. My first attempt at fixing the first bug was also wrong, in a more interesting way. I pointed it at the actual best-performing startup instead, which worked, but it meant that result always won by a huge, obvious margin, which undercut the whole point I was trying to make. I had to throw that fix away too and use a random pick instead. Both times, I realised that careful testing is more than just checking that something looks right visually, it means actually verifying the underlying logic behind it.

## What did this work change about who I want to be as a software developer?

I do not want to assume something is correct because it looks right. These bugs showed me that an interface can appear to work while the logic behind it is wrong. I have added a rule to my `CLAUDE.md` to check what a number represents before accepting it. More than the rule itself, I want to integrate this into how I work. When I use an agent I want to understand why its output is correct rather than accepting it because the UI looks convincing. 