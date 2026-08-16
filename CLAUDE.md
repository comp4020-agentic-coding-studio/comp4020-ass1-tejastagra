# COMP4020 prototype

This is your starter repo for a COMP4020 prototype: a static site written in
HTML/CSS/TypeScript that builds to plain HTML/CSS/JS and deploys to GitHub
Pages. The **deployed site is what gets marked** --- not this repo, and not "it
works on my machine". It's marked live in Chrome against the deployed URL at two
viewports --- 1920×1080 (desktop) and 390×844 (phone) --- and both count in
full, so make that artefact good at both and use the checks below to know
whether it is.

What you're building this week — the spec — is published on the course website,
and this repo's name tells you which deliverable it is. Run the course plugin's
**start** skill at the start of each week: it pulls the right spec from the
course API, carries your harness forward from last week, and helps you turn the
spec's checkable lines into tests of your own. Read the spec before you build,
and see `spec/README.md` for how the checks in this repo relate to it.

## How to work in here

- Keep the dev server running (`pnpm dev`) so you see changes as you make them.
- Before you push, run `pnpm check`. It runs most of what CI runs --- build,
  lint, and the spec --- so you catch those in seconds instead of waiting for
  the pipeline. The links check, the evidence check, the secrets scan, and the
  deploy itself only run in CI; run `pnpm dlx linkinator ./dist --silent`
  locally against a fresh `pnpm build` for the links check without waiting for
  CI.
- To see what the page actually looks like rather than what you assume it looks
  like, open it in a browser (the `agent-browser` CLI, documented on
  [the course site](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/backpressure/#agent-browser-the-rendered-page-as-ground-truth),
  works well for this). The rendered page is the truth; your mental model of it
  isn't.
- When a check fails, read its output before changing anything. Each check below
  names what it measures, and the failure message is the instruction: it tells
  you the file, the line, or the contract. Treat a red check as authoritative
  --- the page is wrong until the check is green, not until you decide it should
  be.
- Commit when the checks pass. Never commit a red state.

## The checks (your sensors)

CI runs these on every push once your repo is public. GitHub's checks UI shows
two jobs, `check` and `deploy` --- not one status per sensor below --- and
within `check` the steps run in sequence (`pnpm check` chains typecheck, build,
lint, and the spec with `&&`), so an early failure like a broken build stops the
later sensors from running for that push; fix it and push again to see the rest.
While the repo is private (all week, until you ship) the CI jobs stay skipped
--- `pnpm check` is the same roster on your machine, and it's the faster loop
anyway. They aren't hoops. Each is a different way of finding out something true
about the site that you can't reliably see by looking at it.

They also carry a mark at a crit: the sweep runs fifteen minutes after your
cutoff, and green checks there are worth half that week's shipped mark. Still
running counts as not green, so ship with time for CI to finish.

- **typecheck** --- `tsc --noEmit` runs first in `pnpm check`, so a type error
  stops the roster before the build even starts. The types are extra
  backpressure: a red here is the compiler telling you a claim in the code is
  false.
- **build** --- the site must build (`pnpm build`). A build failure means the
  deployed site is broken or stale, so nothing else matters until this is green.
- **deploy / online** --- the live GitHub Pages URL must load and return the
  page you expect. An asset that 404s on the deployed URL counts as broken even
  if it loads locally.
- **spec** --- `spec/invariants.test.ts` asserts what's true of any good
  website, whatever the week's brief asks; the tests you write for the week's
  own spec run alongside it (any `spec/*.test.ts`). A failure names the contract
  you haven't met yet.
- **lint** --- `stylelint` for CSS, `oxlint` for TypeScript. Flags code that's
  wrong, fragile, or non-idiomatic. Read the rule it names.
- **tests** --- any other tests you write, wherever you put them (co-located
  with your source is fine, not just `spec/`), must pass. Vitest picks up both
  this and the spec suite in one `vitest run`, the last step of `pnpm check`. A
  failing test is a claim about the site that's no longer true.
- **evidence** (`pnpm check:evidence`) --- checks your process evidence:
  `PROCESS.md`'s citations resolve to real commits, the current deliverable's
  exact reflection is in `reflections/` (worked out from this repo's name
  against the public course API), and your `CLAUDE.md` is present. Evidence
  gates the deploy --- `deploy` needs `check` to pass, so failing evidence
  blocks the deploy alongside everything else. See
  [Your process is part of the mark](#your-process-is-part-of-the-mark) below,
  and the course website's
  [assessment page](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/assessment/#what-you-submit)
  for what counts as evidence.
- **links** --- internal links must resolve. A broken link is a dead end you
  didn't mean to ship.
- **secrets** --- the repo is scanned for committed credentials. Never put a
  key, token, or password in a tracked file. If one leaks, rotate it. A local
  pre-commit hook (`.githooks/pre-commit`, installed by `pnpm install`) also
  blocks any commit containing something shaped like an API key --- by the time
  CI sees a key it's already pushed, so the hook is the sensor that matters.

Nothing here measures **accessibility** or **performance** --- wiring those
sensors (`axe-core`, Lighthouse, or whatever you choose) is your work, and later
in the course the spec will ask you to show how you tested both. When you do,
read a green performance result honestly: it's a lab estimate from one run on a
CI machine, not proof the site is fast for real users.

## The stack is swappable

Out of the box this is plain HTML/CSS/TypeScript on Vite, and every `.html` file
in the repo is a page: add pages, link them, and the build picks them up with no
config. That's a default, not a rule (unless the week's spec says otherwise).
You can swap in Astro or any other static generator, because nothing in CI names
a tool --- the whole contract is:

- `pnpm build` emits the complete site into `dist/`
- the `package.json` scripts (`check`, `check:evidence`, `build`) keep working
- whatever lands in `dist/` still passes the invariants in `spec/`

Two things bite in a swap. The deployed site lives under a path
(`…github.io/<repo>/`), so configure your generator's base path --- this
template's Vite config uses relative asset URLs to sidestep that, but most
generators (Astro included) need `base` set explicitly, and getting it wrong
looks fine locally while every asset 404s on the live URL. And commit the
updated `pnpm-lock.yaml`: CI installs with `--frozen-lockfile`.

## Your process is part of the mark

The deployed page is only half of it. How you got there is marked too: your
commit history, your agent files, and the decisions visible across them. The
checks above can't see any of that, so a person reads it directly --- which
means building legibly is part of building well.

- **Commit as you go.** Small, frequent commits are the record of how the work
  came together, and that record is read, not just the final state. A trail that
  grew alongside the code is the strongest evidence of your process; a single
  dump the night before is the weakest.
- **Keep a process overview** (`PROCESS.md`). A short reading-guide, not an
  essay: what you built, the moments that mattered --- each pointing at a
  commit, a `CLAUDE.md` change, or a prompt and the commit it produced --- and
  where to look in the history. It points a marker at the evidence; it doesn't
  stand in for it, and claims the history doesn't back don't count. The
  `PROCESS.md` in this repo is a template showing the shape and the citation
  format (link text the commit hash or range, target the commit or compare URL);
  `pnpm check:evidence` verifies your citations resolve to real commits before
  you ship. Markers follow those citations and don't trawl the repo for evidence
  you didn't cite.
- **Write your reflection in `reflections/`** --- a short markdown file in this
  repo, named for the deliverable it answers, so the number in the filename is
  the number in this repo's name (`crit-1.md` in `comp4020-crit1-<you>`,
  `assignment-1.md` in `comp4020-ass1-<you>`); `reflections/README.md` has the
  full rule. `pnpm check:evidence` checks the exact current name against the
  course API, not merely the presence of any well-named file. It answers the two
  standing prompts: the breakthrough that moved the work forward, and what this
  work changed about the developer you want to be. It stays out of the deployed
  site. It's due at the cutoff, and if it isn't in the repo by then the week
  doesn't count as shipped, however good the prototype is.
- **This file is process evidence.** The harness you build to direct the agent,
  this `CLAUDE.md` and any `AGENTS.md`, is itself read as part of how you
  worked. Keep it honest and current (see below).

You don't need a name, a student number, or any identity file in the repo: we
know whose repo it is. Spend the effort on the work.

## This week's prototype: the power law allocator

Topic: venture capital's power law — a single outlier investment determines
almost all of a diversified fund's returns, however you split it.

Interaction: the visitor allocates a fixed fund (e.g. $10M) across N startups
(e.g. 20) with sliders, constrained so the total always equals the fund. On
submit, each startup draws a return multiple from a fat-tailed distribution;
the visitor sees the resulting fund return and can change strategy (even
spread vs. concentrated bets) and resubmit to see the outcome barely moves.

`spec/assignment-1.test.ts` asserts the structural contract this needs,
against the built `dist/`:

- `[data-testid="fund-total"]` — states the fixed fund amount
- `[data-testid="allocation-slider"]` — one `<input type="range">` per
  startup, at least two
- `[data-testid="fund-remaining"]` with `aria-live="polite"` — running
  total/remaining as sliders move
- `[data-testid="allocate-submit"]` — runs the draw, not disabled on load
- `[data-testid="fund-return"]` with `aria-live="polite"` — the resulting
  fund return, since it updates on every submit without a reload

It's Astro (`src/pages/index.astro`), not the template's default Vite +
hand-written HTML — `base` in `astro.config.mjs` is already set to
`/comp4020-ass1-tejastagra` for GitHub Pages; don't add a second base path in
links, `import.meta.env.BASE_URL` already carries it.

## This file is yours

## The thesis (do not drift from this)

No matter how you diversify a VC fund across many startups, a single outlier investment will determine almost all of your returns. Every feature decision gets checked against this sentence. If a feature does not serve it, cut it.

Do not add:
- Multiple fund vintages
- IRR vs MOIC toggles
- Portfolio construction theory beyond the single allocation step
- User accounts, save/load, or any backend

## Data integrity

- The return distribution must be either real published data or a clearly labelled modelled approximation (eg Pareto distribution parameterised to match publicly reported venture return curves).
- Never silently swap in placeholder or fabricated numbers. If a number is modelled rather than sourced, label it as modelled in the UI copy, not just in code comments.
- Cite the data source in the app itself (footer or info panel), not only in the README.

## Check in with me

- Before making any non-trivial decision (data source choice, distribution parameters, visual layout direction, scope cuts), stop and check with me rather than assuming and proceeding.
- If you hit a fork where more than one reasonable approach exists, present the options briefly and wait for my call instead of picking one silently.
- Do not mark a task as "done" without telling me what you changed and why, so I have something concrete to cite in PROCESS.md.
- If you're about to throw away an attempt or start over, tell me what didn't work and why before doing it. That's exactly the kind of moment that needs to end up in PROCESS.md.

## Visual style reference

Reference: lawsofux.com. Large, visually distinct cards are explicitly wanted:
each startup card can carry its own accent colour and a distinct piece of
artwork/icon treatment, in the spirit of lawsofux's card grid. Use a light
background overall rather than lawsofux's dark scheme. Otherwise match the
general feel:

- Light background overall, restrained and high contrast, not stark white with
  no depth. Individual cards may carry their own accent colour.
- Typography does the heavy lifting, generous whitespace, no unnecessary chrome
  or decoration beyond the per-card colour/artwork.
- Minimal nav, minimal UI furniture, let the interaction and the data be the
  main focus.
- Clean sans-serif throughout, no default browser styling left untouched (no
  unstyled sliders, buttons, or inputs).
- Use the full width of the viewport rather than a narrow centred column.

Second reference for the explanatory section: ciechanow.ski/mechanical-watch —
a long-form, plain-language explainer with simple diagrams that build up an
idea step by step. The power-law explanation section may take this
scrollytelling shape: several short sections, each with a small diagram or
chart, building up how a fat tail dominates a portfolio's return. Keep the
copy itself plain and in this file's "Style" voice; only the structure and
diagram-led pacing is inspired by ciechanow.ski.

If a design decision is ambiguous, check with me before picking a direction (see "Check in with me" above).

## Style

- No filler copy, no marketing tone. Direct, plain language throughout the UI text.
- No Oxford commas, no em dashes anywhere in written copy.
- UK English spelling (eg "visualise", "colour").
