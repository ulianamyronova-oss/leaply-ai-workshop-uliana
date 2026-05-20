---
name: shadcn-component
description: Add a UI component (button, dialog, input, card, form, table, etc.) by installing it from shadcn/ui via the CLI. ALWAYS use plain `npx shadcn add <name>` — NEVER `npx shadcn@latest add` and NEVER `npm install shadcn@<anything>` (whether you run it or you ask the user to run it). If the install fails in your sandbox, you MAY ask the user to paste the same `npx shadcn add <name>` on their machine — that's a legitimate fallback, NOT a bump. Never hand-write a primitive that exists in shadcn, even when the install seems to fail.
---

# Adding shadcn/ui components

**Four iron rules. Read them before doing anything else:**

### 🔒 Rule A — The `shadcn` dep version is frozen

| Action                                                            | Use?                                |
| ----------------------------------------------------------------- | ----------------------------------- |
| `npx shadcn add card` (you run it)                                | ✅                                  |
| Asking the user to paste `npx shadcn add card`                    | ✅ (fallback — see troubleshooting) |
| `npx shadcn@latest add card`                                      | ❌                                  |
| Running `npm install shadcn@latest` yourself                      | ❌                                  |
| **Asking the user to paste `npm install shadcn@latest`**          | ❌                                  |
| Any other bump of the `shadcn` dep, in any environment, by anyone | ❌                                  |

What's banned is **bumping the `shadcn` package version**, in any
environment, by anyone. What's allowed is **running the exact same
`npx shadcn add <name>` command**, either by you in your sandbox or
by the user in their terminal — both forms use the pinned version
from `package.json` and don't change the lock file.

If your own attempt fails (sandbox network issue, transient 401),
asking the user to paste the same `npx shadcn add <name>` on their
machine is a legitimate fallback. **What stays forbidden** in that
hand-off is changing the command into a bump (`npm install
shadcn@latest`, `npx shadcn@latest add`, etc.).

The `shadcn` version is pinned in `package.json` for a reason: it's
the version that's been tested against the locked `components.json`
and the `radix-nova` themed registry. **The pinned version IS the
supported version.** Don't change it as part of adding a component.

Bumping the dep is a **separate, user-initiated workflow** — the user
must explicitly say _"update shadcn"_ or _"upgrade shadcn to the latest
version"_. Otherwise: hands off.

### 🔒 Rule B — Routing the bump through the user is still a bump

When `npx shadcn add` errors with "registry requires authentication"
or any other failure, do **not** send the user a command like
`npm install shadcn@latest` framed as "a small step on your side".
That's the exact loophole this rule closes. It looks like delegation;
it's just the forbidden action with extra latency.

If the install fails, see the troubleshooting section. Acceptable
next steps are: retry once, ask the user to paste **the same**
`npx shadcn add <name>` command on their machine (legitimate fallback,
not a bump — see Rule A's table), or report the failure and wait.
**Bumping the shadcn dep is not on that list**, neither in your hands
nor in theirs.

### 🔒 Rule C — Never fabricate a "known situation" to justify a bump

When you have a failing install and your gut says "I'll just bump
shadcn", check yourself for this language pattern:

> _"It's a known situation with the `radix-nova` template — we just
> need to update the CLI…"_

This is hallucinated. There is no documented "known situation" where
401 from radix-nova is fixed by bumping shadcn. The 401 is a
transient registry-side problem. Don't manufacture credibility for
the forbidden path. Stop, report, wait.

### 🔒 Rule D — If the install fails, escalate, don't improvise

Do **not** fall back to writing the component by hand with `<div>` and
Tailwind classes. That violates Rule 1 in `CLAUDE.md` and produces
components that drift from the design system, lack accessibility
wiring, and look wrong in dark mode.

The correct response is to **tell the user clearly** what went wrong
and ask whether to retry in a few minutes, work on something else,
or (if they explicitly want it) bump shadcn — but only on their
initiative, not yours.

---

The user wants a UI element (button, modal, form field, dropdown, sheet,
tooltip, table, etc.). Resist the urge to write it yourself — shadcn
already has it, and the CLI keeps it consistent with the rest of the app.

**You run the shadcn CLI yourself.** It's pure code generation — no
native binaries, no lock-file changes, no platform-specific output.
Safe across sandboxes. See Rule 0 in `CLAUDE.md` for what's yours vs.
the user's.

## Workflow

### 1. Check what's already installed

Look in `components/ui/`. If a file matching the component name exists,
**use it** — do not reinstall (that overwrites local edits).

```ts
import { Button } from "@/components/ui/button"
```

### 2. Confirm the component exists in shadcn

Browse <https://ui.shadcn.com/docs/components> mentally. Common ones:

`accordion`, `alert`, `alert-dialog`, `avatar`, `badge`, `breadcrumb`,
`button`, `calendar`, `card`, `carousel`, `chart`, `checkbox`,
`collapsible`, `command`, `context-menu`, `dialog`, `drawer`,
`dropdown-menu`, `form`, `hover-card`, `input`, `input-otp`, `label`,
`menubar`, `navigation-menu`, `pagination`, `popover`, `progress`,
`radio-group`, `resizable`, `scroll-area`, `select`, `separator`,
`sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `switch`, `table`,
`tabs`, `textarea`, `toggle`, `toggle-group`, `tooltip`.

If you're unsure whether shadcn ships the thing, ask the user to confirm
the visual, then check the registry rather than guessing.

### 3. Install via the CLI

The only allowed install form:

```bash
npx shadcn add <component> [<component> …]
```

Multiple components per call is fine:

```bash
npx shadcn add button dialog input
```

The CLI reads `components.json` (which has `style: "radix-nova"` — a
Radix-hosted themed registry) and drops files into `components/ui/`.
You run this yourself; it doesn't touch `node_modules` or the lock
file. After a successful install, tell the user in one sentence
(_"Added the Card component."_) and keep going with the feature.

**Do not change the shadcn dep version.** Don't run `npm install
shadcn@latest`, `npm install shadcn@<anything>`, or any variant.
Don't hand the user a paste-able version of the same command either
(see Rule B at the top of this file). The pinned version is the
supported one for this `components.json`. Bumping shadcn is a
**separate workflow** — only do it when the user explicitly asks to
upgrade shadcn, not as a workaround for any install error.

### 4. Wire it up

Import via the `@/components/ui/<name>` alias. Compose, don't fork —
build your feature component **on top of** the primitive in a sibling
file under `components/`, not by editing the shadcn file.

```tsx
// components/save-dialog.tsx
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function SaveDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Save</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save your work</DialogTitle>
        </DialogHeader>
        {/* ... */}
      </DialogContent>
    </Dialog>
  )
}
```

## What you must NOT do

- ❌ Paste a hand-written `Button.tsx` based on memory.
- ❌ Edit files in `components/ui/` to "tweak" the primitive. Wrap it in
  a new component in `components/` instead.
- ❌ Mix in another UI library (MUI, Chakra, Mantine, HeadlessUI).
- ❌ Use `npx shadcn@latest add` — see Rule A at the top of this file.
- ❌ Run `npm install shadcn@latest` (or any other bump of the shadcn
  dep) without explicit user approval. See Rule A.
- ❌ **Fall back to a hand-written `<div>` if the CLI errors out.**
  See "If the install fails" below — report to the user, never
  silently replicate the component yourself with raw markup. This is
  the most common silent Rule 1 violation.

## If the install fails

**Do not write the component by hand from memory. Do not bump the
shadcn version. Do not silently substitute `<div>` markup.** Stop and
follow this diagnosis tree.

### Step 1: confirm you used the right command

Look at the command you actually ran. Was it exactly
`npx shadcn add <name>` with no `@latest`, no `@<version>`? If not,
that's the bug — retry with plain `npx shadcn add`.

### Step 2: classify the error

**"Component not found"** — typo'd name. Check the supported list in
section 2 above and retry.

**Network error / DNS failure** — your sandbox's network blip. Retry
once. If it still fails, **try the user-delegation fallback** (see
Step 3 below) before suggesting they wait.

**"Registry requires authentication" / HTTP 401** — this is a
**registry-side** issue with the radix-nova themed registry, not
something you can fix by bumping the CLI. The Radix registry
occasionally returns 401 for sandbox-originated requests for reasons
unrelated to the CLI version. The correct response:

1. **Retry the same command once.**
2. **Try the user-delegation fallback** — see Step 3.
3. If neither works, **stop and tell the user** what's going on, in
   plain English (Step 4).

What you must **not** do at any point: bump the shadcn version, send
the user a paste-able `npm install shadcn@latest` framed as "a small
thing on their side" (Rule B), claim this is a "known situation with
our radix-nova template" (Rule C), change `components.json`, or
substitute hand-written markup.

### Step 3 — User-delegation fallback (legitimate)

If your own `npx shadcn add` fails with a network error, a transient
401, or anything else that's likely sandbox-specific, you can ask the
user to run **the exact same command** on their machine. This is
allowed because:

- the command is identical (plain `npx shadcn add <name>` — no
  `@latest`, no version bump);
- it uses the pinned `shadcn` from `package.json` on their machine;
- it doesn't change the lock file (`npx shadcn add` only writes to
  `components/ui/`);
- it bypasses whatever sandbox-side restriction you hit.

Use this exact preamble (per Rule 0 in `CLAUDE.md`):

> I tried to add the Card component, but my sandbox can't reach the
> shadcn registry right now (a transient `401` on their side — not
> something in your code or your computer). Can you paste this one
> line into your Terminal? It runs the same install on your machine
> and finishes in ~5 seconds. The last line will say something like
> `✔ Created 1 file: components/ui/card.tsx`.
>
> ```bash
> cd "<absolute-project-path>" && npx shadcn add card
> ```
>
> Paste the result back when it's done.

After they confirm success, read the new file with your file tools
and keep going.

**Strict guardrails on this fallback:**

- The command you give the user is **exactly** `npx shadcn add <names>`.
  No `@latest`. No `@<version>`. No `npm install shadcn@anything`. If
  you find yourself appending or chaining anything else, stop — see
  Rule B at the top of this file.
- Multiple components in one paste is fine (`npx shadcn add card
scroll-area separator`).
- Don't pretend you exhausted retries when you didn't — try the
  retry from Step 1 first.

### Step 4 — If the user-side install also fails

Then it's genuinely an upstream problem (registry is down, their
internet is down, the component name was wrong, etc.). Tell them
plainly:

> The install failed on your side too: `<paste the error key line>`.
> If it's the same `401`, the registry is having a bad moment — usually
> clears up within an hour. Want me to wait and retry, or work on
> something else meanwhile?

Wait for the user's call. **Still no bumps, no hand-rolled markup.**

### What to NEVER do when an install fails

Quoting a real failure mode seen in the wild:

> _"The registry requires auth — I'll just use a regular `<div>` with
> styles from the same CSS variables. Button already exists, that's
> enough."_

**Wrong.** Hand-rolled markup based on memory:

- doesn't match the radix-nova primitive's actual styling tokens;
- skips the accessibility wiring (focus management, ARIA, slot props);
- drifts as the design system evolves;
- silently violates Rule 1 in `CLAUDE.md`.

A second real failure mode:

> _"The CLI version must be stale — I'll run `npm install shadcn@latest`
> and retry."_

**Also wrong.** The pinned version is the supported one. Bumping it
without the user's approval (a) churns `package.json` and the lock
file for an unrelated reason, (b) doesn't fix the underlying issue
(401 from the registry is not version-dependent), and (c) violates
the pin discipline that protects future forkers.

The only correct fallback is: **report to the user and wait**.

## Forms

For any form, install both `form` and `input` (plus `label`, `select`,
etc. as needed). Forms are built with `react-hook-form` + `zod` — see
`.claude/skills/validation/SKILL.md`.

```bash
npx shadcn add form input label
```

## Toasts

Use `sonner` (the modern shadcn default). Add the `<Toaster />` to
`app/layout.tsx` once, then call `toast()` anywhere.

```bash
npx shadcn add sonner
```

## After installing

Run `npm run build` once to confirm the new files compile.
