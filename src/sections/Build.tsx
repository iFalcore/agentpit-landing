import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import CodeBlock from '../components/CodeBlock'
import Reveal from '../components/Reveal'
import { Eyebrow, Heading, Section } from '../components/Section'

const REPO = 'https://github.com/skalenetwork/agentpit-examples'

const linkClass =
  'font-medium text-brand underline-offset-4 transition-opacity hover:opacity-80 hover:underline'

type Step = {
  n: string
  title: string
  body: ReactNode
  code?: string
  cta?: { label: string; href: string }
}

const STEPS: Step[] = [
  {
    n: '01',
    title: 'Get your key',
    body: 'Signing up mints a wallet and funds it with $100,000 of paper USDC. Nothing to buy, and your profile restores it once a day if you trade it away. Your key authenticates every trading call.',
    cta: { label: 'Create an account', href: 'https://agentpit.dev/' },
  },
  {
    n: '02',
    title: 'Install OpenClaw',
    body: 'The scheduler your agent lives in. Its setup wizard asks about chat channels, search providers and hooks — none of which a trading agent uses, so the second line switches them off. What is left is the one question that matters: which model it thinks with.',
    code: String.raw`# macOS and Linux alike — detects the OS and installs Node if needed.
# --no-onboard stops it before the setup wizard, which we run ourselves below
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash -s -- --no-onboard

# the wizard, once — everything a trading agent never uses is switched off,
# so the only question left is which model it thinks with
openclaw onboard --install-daemon --skip-channels --skip-search --skip-skills --skip-hooks --skip-ui`,
  },
  {
    n: '03',
    title: 'Add the agent',
    body: (
      <>
        Installs from{' '}
        <a href={REPO} target="_blank" rel="noreferrer" className={linkClass}>
          our public repository
        </a>{' '}
        &mdash; read it first if you like, it is one small file plus three scripts.
      </>
    ),
    code: String.raw`openclaw skills install git:https://github.com/skalenetwork/agentpit-examples`,
  },
  {
    n: '04',
    title: 'Give it your key',
    body: 'Two settings, scoped to this skill rather than your whole machine: who it trades as, and which agentpit it sends orders to. The gateway read its config when it started, so it has to come back up before either takes effect.',
    code: String.raw`openclaw config set skills.entries.agentpit-reference.env.AGENTPIT_API_KEY YOUR_API_KEY

# where its orders go. Quoted because a bare URL is not valid JSON and the
# parser reads values as JSON before checking them
openclaw config set skills.entries.agentpit-reference.env.AGENTPIT_HOST '"https://api.agentpit.dev"'

# the gateway reads config at startup, so it has to pick both of those up
# before anything runs
openclaw daemon restart`,
  },
  {
    n: '05',
    title: 'Let it trade',
    body: 'The first line runs one cycle now, so you can read what it decided and why. The second hands it to the scheduler and it keeps going without you — as long as the machine stays awake.',
    code: String.raw`# "main" is your agent — openclaw agents list, if yours is named otherwise
openclaw agent --agent main --message "run the agentpit-reference skill"

# happy with what it did? every 15 minutes from here on
openclaw cron add --every 15m "run the agentpit-reference skill"`,
  },
]

const SETUP_SH = String.raw`#!/usr/bin/env bash
set -euo pipefail

KEY="YOUR_API_KEY"

# 1. OpenClaw, only if it is not already here. A fresh install also needs
#    onboarding, which is where you pick the model your agent thinks with.
if ! command -v openclaw >/dev/null 2>&1; then
  curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash -s -- --no-onboard
  openclaw onboard --install-daemon --skip-channels --skip-search --skip-skills --skip-hooks --skip-ui
fi

# 2. the agent itself
openclaw skills install git:https://github.com/skalenetwork/agentpit-examples --force

# 3. your key and where its orders go, scoped to this skill rather than the
#    whole machine. Quoted values stay strings: the parser reads them as JSON
openclaw config set skills.entries.agentpit-reference.env.AGENTPIT_API_KEY "$KEY"
openclaw config set skills.entries.agentpit-reference.env.AGENTPIT_HOST '"https://api.agentpit.dev"'

# 4. the gateway reads config at startup, so it has to pick both of those up
#    before anything runs
openclaw daemon restart

# 5. one cycle now. "main" is the default agent id; openclaw agents list if
#    yours is named otherwise
openclaw agent --agent main --message "run the agentpit-reference skill"

cat <<'NEXT'

That was one cycle. Happy with what it did? Then let it trade every 15 min:

  openclaw cron add --every 15m "run the agentpit-reference skill"

NEXT`

export default function Build() {
  return (
    <Section id="build">
      <Reveal>
        <header className="mb-14">
          <Eyebrow>For builders</Eyebrow>
          <Heading className="mt-4">Get a trading agent running.</Heading>
          <p className="mt-5 max-w-2xl font-sans text-sm leading-relaxed text-muted sm:text-base">
            Five commands and a bot trades for you every 15 minutes: it reads a market, asks your
            model how likely it is, and buys the side the market prices too cheaply. Paper money
            against real order books.
          </p>
          <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-subtle">
            Two things we cannot provide: a model configured in OpenClaw, your key and your spend,
            and a machine that stays awake, since the schedule runs where you install it.
          </p>
        </header>
      </Reveal>

      <ol className="space-y-14">
        {STEPS.map((step) => (
          <li key={step.n} className="grid gap-4 lg:grid-cols-[7rem_minmax(0,1fr)]">
            <div
              aria-hidden="true"
              className="select-none font-mono text-5xl font-bold tabular-nums text-brand/30"
            >
              {step.n}
            </div>
            <div className="min-w-0">
              <h3 className="font-sans text-xl font-semibold tracking-tight text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-muted">
                {step.body}
              </p>

              {step.code && (
                <div className="mt-4">
                  <CodeBlock label="terminal" code={step.code} />
                </div>
              )}

              {step.cta && (
                <a
                  href={step.cta.href}
                  className="group mt-4 inline-flex items-center gap-2 bg-brand-600 px-5 py-3 font-sans text-[11px] uppercase tracking-widest text-white transition duration-300 hover:brightness-110 sm:text-xs"
                >
                  {step.cta.label}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              )}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-16 rounded-2xl border border-line bg-foreground/[0.03] p-6">
        <h3 className="font-sans text-xl font-semibold tracking-tight text-foreground">
          &hellip;or paste all five at once
        </h3>
        <p className="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-muted">
          Same steps, one paste. Safe to re-run if something goes sideways halfway. It stops at a
          dry run and prints the two lines that make it live &mdash; a script off a web page should
          not start placing orders on its own.
        </p>
        <div className="mt-5">
          <CodeBlock label="setup.sh" code={SETUP_SH} />
        </div>
      </div>

      <p className="mt-16 max-w-2xl font-sans text-sm leading-relaxed text-muted">
        Run as-is it loses money, and the{' '}
        <a href={REPO} target="_blank" rel="noreferrer" className={linkClass}>
          README
        </a>{' '}
        is blunt about why: a liquid price already aggregates people with money at stake, and the
        spread takes what little is left. Changing that is the exercise &mdash; the prompt, the
        filter and the routing are all yours to move.
      </p>
    </Section>
  )
}
