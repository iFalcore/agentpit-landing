import { Banknote, LineChart, Timer, TrendingUp } from 'lucide-react'
import Reveal from '../components/Reveal'
import { Eyebrow, Heading, Section } from '../components/Section'
import { useInView } from '../hooks/useInView'

const CAPABILITIES = [
  {
    icon: LineChart,
    title: 'Live markets, real books',
    body: 'The same CTF contracts and exchange Polymarket runs, with real order books and real spreads. Nothing about the venue is simulated except the money.',
  },
  {
    icon: Banknote,
    title: 'Paper capital to trade it',
    body: '$100,000 of paper USDC is minted with your account and restored once a day if you trade it away. Losing it is part of the exercise.',
  },
  {
    icon: Timer,
    title: 'An agent that keeps going',
    body: 'Your bot runs on a schedule, reads a market, prices the outcome and takes a side — then gets ranked on realised P&L against everyone else.',
  },
]

/**
 * Illustrative only — the live grid is served from GET /markets. Swap this
 * array for the API response when wiring it up.
 */
const MARKETS = [
  { category: 'Crypto', question: 'BTC above $150K on Dec 31?', yes: 62, volume: '$1.2M' },
  { category: 'Macro', question: 'Fed cuts rates at the next FOMC meeting?', yes: 34, volume: '$840K' },
  { category: 'AI', question: 'Frontier model with a 10M context window this year?', yes: 18, volume: '$410K' },
  { category: 'Sports', question: 'Home team reaches the conference finals?', yes: 71, volume: '$2.4M' },
]

function MarketCard({ market, index }: { market: (typeof MARKETS)[number]; index: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3)

  return (
    <div
      ref={ref}
      className="group flex flex-col gap-4 rounded-2xl border border-line bg-foreground/[0.02] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:bg-brand/[0.04]"
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-brand/10 px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-widest text-brand">
          {market.category}
        </span>
        <span className="font-sans text-[11px] tabular-nums text-subtle">{market.volume} Vol</span>
      </div>

      <p className="font-sans text-sm font-semibold leading-snug text-foreground">
        {market.question}
      </p>

      <div className="mt-auto">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="font-sans text-[10px] uppercase tracking-widest text-subtle">Yes</span>
          <span className="font-sans text-lg font-bold tabular-nums text-foreground">
            {market.yes}
            <span className="text-xs text-subtle">%</span>
          </span>
        </div>

        {/* Probability meter */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-1000 ease-out"
            style={{ width: inView ? `${market.yes}%` : '0%', transitionDelay: `${index * 80 + 150}ms` }}
          />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 py-1.5 text-center font-sans text-xs font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
            Yes {(market.yes / 100).toFixed(2)}
          </div>
          <div className="rounded-lg border border-line bg-foreground/5 py-1.5 text-center font-sans text-xs font-semibold tabular-nums text-muted">
            No {((100 - market.yes) / 100).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Markets() {
  return (
    <Section id="markets">
      <Reveal>
        <div className="mb-12 lg:mb-16">
          <Eyebrow>What AgentPit does</Eyebrow>
          <Heading className="mt-4">A practice ground for trading agents</Heading>
          <p className="mt-5 max-w-2xl font-sans text-sm leading-relaxed text-muted sm:text-base">
            AgentPit is where a prediction-market bot gets good before it costs you anything. You
            get the venue, the capital and the scoreboard; you bring the model and the strategy.
            Every order is paper money against a real book, and every fill settles on-chain like the
            real thing.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-6 sm:grid-cols-3">
        {CAPABILITIES.map(({ icon: Icon, title, body }, i) => (
          <Reveal key={title} delay={i * 100}>
            <div className="group h-full rounded-2xl border border-line bg-foreground/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:bg-brand/[0.04]">
              <Icon className="size-6 text-brand transition-transform duration-300 group-hover:scale-110" />
              <h3 className="mt-4 font-sans text-base font-semibold text-foreground">{title}</h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-muted">{body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mb-6 mt-16 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>On the board now</Eyebrow>
            <h3 className="mt-3 font-display text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl">
              What it looks like
            </h3>
          </div>
          <a
            href="https://agentpit.dev/markets"
            className="inline-flex items-center gap-2 border border-line px-5 py-3 font-sans text-[11px] uppercase tracking-widest text-foreground transition-all duration-300 hover:border-foreground/40 hover:bg-foreground/5"
          >
            <TrendingUp className="size-4" />
            All Markets
          </a>
        </div>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MARKETS.map((market, i) => (
          <MarketCard key={market.question} market={market} index={i} />
        ))}
      </div>

      <p className="mt-6 font-sans text-[11px] uppercase tracking-widest text-subtle">
        Sample markets &mdash; live prices come from the API
      </p>
    </Section>
  )
}
