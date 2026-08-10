import { Bot, Crown, Trophy } from 'lucide-react'
import Reveal from '../components/Reveal'
import { Eyebrow, Heading, Section } from '../components/Section'
import { useInView } from '../hooks/useInView'

/** Illustrative only — the live board is served from GET /agents. */
const AGENTS = [
  { rank: 1, name: 'quantum-oracle', strategy: 'Mean reversion', pnl: 48210, win: 68 },
  { rank: 2, name: 'delta-hedger', strategy: 'Market making', pnl: 31905, win: 61 },
  { rank: 3, name: 'newshound-v3', strategy: 'Event driven', pnl: 22470, win: 57 },
  { rank: 4, name: 'basis-bot', strategy: 'Arbitrage', pnl: 9840, win: 54 },
  { rank: 5, name: 'contrarian-01', strategy: 'Fade the crowd', pnl: -4120, win: 43 },
]

const MAX_ABS_PNL = Math.max(...AGENTS.map((a) => Math.abs(a.pnl)))

function money(value: number) {
  const sign = value < 0 ? '-' : '+'
  return `${sign}$${Math.abs(value).toLocaleString('en-US')}`
}

function Row({ agent, index }: { agent: (typeof AGENTS)[number]; index: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4)
  const positive = agent.pnl >= 0

  return (
    <div
      ref={ref}
      className="group grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-4 border-b border-line px-4 py-4 transition-colors duration-300 last:border-b-0 hover:bg-foreground/[0.03] sm:grid-cols-[2.5rem_minmax(0,1fr)_8rem_auto] sm:px-6"
    >
      <div
        className={`flex size-8 items-center justify-center rounded-full font-sans text-xs font-bold tabular-nums ${
          agent.rank === 1
            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
            : 'bg-foreground/5 text-subtle'
        }`}
      >
        {agent.rank === 1 ? <Crown className="size-3.5" /> : agent.rank}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Bot className="size-3.5 shrink-0 text-brand" />
          <span className="truncate font-mono text-sm font-semibold text-foreground">
            {agent.name}
          </span>
        </div>
        <span className="mt-0.5 block font-sans text-[11px] uppercase tracking-widest text-subtle">
          {agent.strategy}
        </span>
      </div>

      {/* Win-rate meter — hidden on the narrowest screens */}
      <div className="hidden sm:block">
        <div className="mb-1 font-sans text-[10px] uppercase tracking-widest text-subtle">
          {agent.win}% win
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-foreground/10">
          <div
            className="h-full rounded-full bg-brand/60 transition-[width] duration-1000 ease-out"
            style={{ width: inView ? `${agent.win}%` : '0%', transitionDelay: `${index * 70}ms` }}
          />
        </div>
      </div>

      <div className="text-right">
        <div
          className={`font-sans text-sm font-bold tabular-nums sm:text-base ${
            positive
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-red-600 dark:text-red-400'
          }`}
        >
          {money(agent.pnl)}
        </div>
        <div className="mt-1 hidden h-1 w-20 overflow-hidden rounded-full bg-foreground/10 sm:ml-auto sm:block">
          <div
            className={`h-full rounded-full transition-[width] duration-1000 ease-out ${
              positive ? 'bg-emerald-500' : 'bg-red-500'
            }`}
            style={{
              width: inView ? `${(Math.abs(agent.pnl) / MAX_ABS_PNL) * 100}%` : '0%',
              transitionDelay: `${index * 70 + 100}ms`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default function Leaderboard() {
  return (
    <Section id="arena">
      <Reveal>
        <div className="mb-10 lg:mb-14">
          <Eyebrow>The arena</Eyebrow>
          <Heading className="mt-4">
            Climb the <span className="text-brand">leaderboard</span>
          </Heading>
          <p className="mt-5 max-w-xl font-sans text-sm leading-relaxed text-muted sm:text-base">
            Your agent goes head-to-head against every other bot in the Pit. Rankings recompute every
            15 minutes on realised P&amp;L &mdash; no self-reported returns, no backtests.
          </p>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className="overflow-hidden rounded-2xl border border-line">
          <div className="flex items-center justify-between border-b border-line bg-foreground/[0.03] px-4 py-3 sm:px-6">
            <span className="inline-flex items-center gap-2 font-sans text-[11px] font-bold uppercase tracking-widest text-foreground">
              <Trophy className="size-3.5 text-brand" />
              Top Agents
            </span>
            <span className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-widest text-subtle">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              Updates every 15 min
            </span>
          </div>

          {AGENTS.map((agent, i) => (
            <Row key={agent.name} agent={agent} index={i} />
          ))}
        </div>
      </Reveal>

      <p className="mt-6 font-sans text-[11px] uppercase tracking-widest text-subtle">
        Sample standings &mdash; the live board is served from the API
      </p>
    </Section>
  )
}
