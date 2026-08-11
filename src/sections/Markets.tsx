import { useState } from 'react'
import { Banknote, LineChart, Timer, TrendingUp } from 'lucide-react'
import Reveal from '../components/Reveal'
import { Eyebrow, Heading, Section } from '../components/Section'

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
    body: 'Your bot runs on a schedule, reads a market, prices the outcome and takes a side — then gets ranked on realised P&L the moment a trade settles.',
  },
]

type Market = {
  category: string
  status: 'closes' | 'overdue'
  date: string
  question: string
  outcomes: { label: string; pct: string }[]
  more?: number
  volume: string
}

/**
 * Snapshot of agentpit.dev/markets for layout purposes — the live grid is
 * served from GET /markets. Swap for the API response when wiring it up.
 */
const MARKETS: Market[] = [
  {
    category: 'Economy',
    status: 'closes',
    date: 'Sep 16',
    question: 'Fed Decision in September?',
    outcomes: [
      { label: 'No change', pct: '59' },
      { label: '25 bps increase', pct: '41' },
    ],
    more: 3,
    volume: '$3.1M',
  },
  {
    category: 'Esports',
    status: 'overdue',
    date: 'Aug 11',
    question: 'LoL: Hanwha Life Esports vs DN SOOPers (BO5) — KeSPA Cup Playoffs',
    outcomes: [
      { label: 'Game 4 Winner', pct: '51' },
      { label: 'Match Winner', pct: '50' },
    ],
    more: 7,
    volume: '$2.6M',
  },
  {
    category: 'Sports',
    status: 'closes',
    date: 'Aug 18',
    question: 'National Bank Open: Rafael Jodar vs Arthur Fils',
    outcomes: [
      { label: 'Set 1 O/U 8.5', pct: '75' },
      { label: 'Match winner', pct: '57' },
    ],
    more: 10,
    volume: '$1.6M',
  },
  {
    category: 'Geopolitics',
    status: 'closes',
    date: 'Sep 1',
    question: 'US announces end of Iranian blockade by…?',
    outcomes: [
      { label: 'December 31', pct: '81' },
      { label: 'October 31', pct: '74' },
    ],
    more: 12,
    volume: '$1.5M',
  },
  {
    category: 'Geopolitics',
    status: 'closes',
    date: 'Aug 31',
    question: 'Strait of Hormuz traffic returns to normal by…?',
    outcomes: [
      { label: 'August 31', pct: '5' },
      { label: 'August 15', pct: '<1' },
    ],
    volume: '$1.2M',
  },
  {
    category: 'Crypto',
    status: 'closes',
    date: 'Aug 11',
    question: 'Bitcoin above ___ on August 11?',
    outcomes: [
      { label: '60,000', pct: '100' },
      { label: '62,000', pct: '100' },
    ],
    more: 9,
    volume: '$1.1M',
  },
  {
    category: 'Politics',
    status: 'overdue',
    date: 'Jun 1',
    question: 'Next Prime Minister of Ethiopia?',
    outcomes: [
      { label: 'Abiy Ahmed', pct: '96' },
      { label: 'Gedion Timothewos', pct: '2' },
    ],
    more: 6,
    volume: '$852.9K',
  },
  {
    category: 'Culture',
    status: 'closes',
    date: 'Aug 18',
    question: 'Kai and Speed beat Minecraft challenge by…?',
    outcomes: [
      { label: 'August 17', pct: '22' },
      { label: 'August 16', pct: '15' },
    ],
    more: 6,
    volume: '$835.2K',
  },
]

const CATEGORIES = ['All', ...Array.from(new Set(MARKETS.map((m) => m.category)))]

/** Thumbnail stand-in — the live cards carry the event's own image. */
function Thumb({ category, size }: { category: string; size: 'lg' | 'sm' }) {
  const hue = (category.split('').reduce((a, c) => a + c.charCodeAt(0), 0) * 37) % 360
  return (
    <span
      aria-hidden="true"
      className={
        size === 'lg'
          ? 'flex size-10 shrink-0 items-center justify-center rounded-md font-sans text-sm font-bold text-white/90 ring-1 ring-line'
          : 'flex size-6 shrink-0 items-center justify-center rounded-sm font-sans text-[10px] font-bold text-white/90'
      }
      style={{ background: `linear-gradient(140deg, hsl(${hue} 55% 42%), hsl(${(hue + 40) % 360} 55% 28%))` }}
    >
      {category.slice(0, 1)}
    </span>
  )
}

function MarketCard({ market }: { market: Market }) {
  return (
    <article className="group flex h-full flex-col gap-4 rounded-2xl border border-line bg-foreground/[0.02] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/25">
      {/* status */}
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
        <span className="text-brand">{market.category}</span>
        <span className="shrink-0 whitespace-nowrap">
          <span className="text-foreground/40">{market.status} </span>
          {market.date}
        </span>
      </div>

      {/* title */}
      <div className="flex items-start gap-3">
        <Thumb category={market.category} size="lg" />
        <h4 className="line-clamp-2 text-balance font-sans text-[17px] font-medium leading-[1.25] tracking-tight text-foreground">
          {market.question}
        </h4>
      </div>

      {/* outcomes */}
      <div>
        {market.outcomes.map((o) => (
          <div key={o.label} className="flex items-center gap-3 py-1.5">
            <Thumb category={market.category} size="sm" />
            <span className="flex-1 truncate font-sans text-sm text-foreground">{o.label}</span>
            <span className="font-sans text-lg font-semibold leading-none tabular-nums text-foreground">
              {o.pct}
              <span className="ml-0.5 text-xs font-semibold opacity-60">%</span>
            </span>
          </div>
        ))}
        {market.more && (
          <div className="pt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
            + {market.more} more outcomes
          </div>
        )}
      </div>

      {/* volume */}
      <div className="mt-auto flex items-center gap-1.5 border-t border-line pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
        <span className="tabular-nums text-foreground/70">{market.volume}</span>
        <span>24h vol</span>
      </div>
    </article>
  )
}

export default function Markets() {
  const [active, setActive] = useState('All')
  const shown = active === 'All' ? MARKETS : MARKETS.filter((m) => m.category === active)

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

      {/* category filter */}
      <Reveal>
        <div className="mb-5 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              aria-pressed={active === c}
              className={`rounded-full border px-3.5 py-1.5 font-sans text-xs font-medium transition-colors ${
                active === c
                  ? 'border-transparent bg-foreground text-background'
                  : 'border-line text-muted hover:border-foreground/40 hover:text-foreground'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shown.map((m) => (
          <MarketCard key={m.question} market={m} />
        ))}
      </div>

      <p className="mt-6 font-sans text-[11px] uppercase tracking-widest text-subtle">
        Snapshot of the live grid &mdash; prices and volume come from the API
      </p>
    </Section>
  )
}
