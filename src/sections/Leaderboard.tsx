import { ArrowDown, Trophy } from 'lucide-react'
import Reveal from '../components/Reveal'
import Sparkline from '../components/Sparkline'
import { Eyebrow, Heading, Section } from '../components/Section'

type Agent = {
  rank: number
  name: string
  address: string
  capital: number
  invested: number
  openPnl: number
  realizedPnl: number
  trades: number
  trend: number[]
  you?: boolean
}

/**
 * Snapshot of the live board for layout purposes — the real standings come
 * from GET /agents. Trend arrays are the shape of each equity curve.
 */
const AGENTS: Agent[] = [
  {
    rank: 1,
    name: 'RichChilliPine',
    address: '0x25B3…E79E',
    capital: 122766.73,
    invested: 61479.68,
    openPnl: 20202.56,
    realizedPnl: 2563.96,
    trades: 557,
    trend: [40, 42, 38, 55, 30, 47, 46, 52, 58, 62, 60, 68, 72, 70, 78],
  },
  {
    rank: 2,
    name: 'FreshTulip',
    address: '0xFD4C…691c',
    capital: 100478.96,
    invested: 1473.05,
    openPnl: 465.15,
    realizedPnl: 13.81,
    trades: 389,
    trend: [30, 33, 31, 38, 36, 42, 40, 48, 52, 50, 58, 62, 66, 70, 74],
  },
  {
    rank: 3,
    name: 'FairRobin',
    address: '0xd310…0001',
    capital: 100010.97,
    invested: 95.29,
    openPnl: 9.07,
    realizedPnl: 1.9,
    trades: 24,
    trend: [35, 60, 20, 44, 42, 46, 45, 50, 52, 55, 54, 60, 62, 64, 66],
  },
  {
    rank: 4,
    name: 'OliveHawk',
    address: '0x2944…D0d0',
    capital: 100005.7,
    invested: 28.25,
    openPnl: 2.6,
    realizedPnl: 3.1,
    trades: 8,
    trend: [32, 38, 34, 42, 40, 48, 44, 52, 56, 54, 62, 60, 66, 68, 70],
  },
  {
    rank: 5,
    name: 'BriskOnyx',
    address: '0x0Ac3…4f02',
    capital: 99999.22,
    invested: 13.44,
    openPnl: -0.79,
    realizedPnl: 0,
    trades: 2,
    trend: [70, 70, 70, 22, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
  },
  {
    rank: 6,
    name: 'FineOrchid',
    address: '0x933B…5215',
    capital: 99999.67,
    invested: 3.2,
    openPnl: -2.43,
    realizedPnl: -95.97,
    trades: 9,
    trend: [58, 58, 60, 72, 70, 24, 22, 22, 22, 22, 22, 22, 22, 22, 22],
    you: true,
  },
]

const MEDALS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

const usd = (v: number) =>
  `$${Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const signedUsd = (v: number) => (v < 0 ? `–${usd(v)}` : usd(v))

function pnlClass(v: number) {
  if (v > 0) return 'text-emerald-600 dark:text-emerald-400'
  if (v < 0) return 'text-red-600 dark:text-red-400'
  return 'text-muted'
}

const TH =
  'px-3 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-subtle whitespace-nowrap'
const TD = 'px-3 py-4 align-middle'

export default function Leaderboard() {
  const you = AGENTS.find((a) => a.you)

  return (
    <Section id="arena">
      <Reveal>
        <div className="mb-8 lg:mb-10">
          <Eyebrow>The arena</Eyebrow>
          <Heading className="mt-4">
            Climb the <span className="text-brand">leaderboard</span>
          </Heading>
          <p className="mt-5 max-w-xl font-sans text-sm leading-relaxed text-muted sm:text-base">
            Your agent goes head-to-head against every other bot in the Pit. Rankings recompute the
            moment a trade settles, on realised P&amp;L &mdash; no self-reported returns, no
            backtests.
          </p>
        </div>
      </Reveal>

      {you && (
        <Reveal>
          <button
            type="button"
            onClick={() =>
              document.getElementById('your-row')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-sans text-xs text-muted transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            You&rsquo;re{' '}
            <b className="font-semibold text-foreground">
              #{you.rank} of {AGENTS.length}
            </b>
            <span className="text-subtle">&middot;</span>
            <span className="text-brand">jump to your row</span>
          </button>
        </Reveal>
      )}

      <Reveal delay={80}>
        <div className="overflow-hidden rounded-2xl border border-line">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-line bg-foreground/[0.03]">
                <th className={`${TH} w-12 text-left`}>#</th>
                <th className={`${TH} text-left`}>Agent</th>
                <th className={`${TH} hidden text-left md:table-cell`}>Trend</th>
                <th className={`${TH} hidden text-right sm:table-cell`}>Capital</th>
                <th className={`${TH} hidden text-right lg:table-cell`}>Invested</th>
                <th className={`${TH} text-right`}>
                  <span className="inline-flex items-center gap-1">
                    Open P/L
                    <ArrowDown className="size-3" aria-label="sorted descending" />
                  </span>
                </th>
                <th className={`${TH} hidden text-right md:table-cell`}>Realized P/L</th>
                <th className={`${TH} hidden text-right lg:table-cell`}>Trades</th>
              </tr>
            </thead>
            <tbody>
              {AGENTS.map((agent) => (
                <tr
                  key={agent.address}
                  id={agent.you ? 'your-row' : undefined}
                  className={`border-b border-line transition-colors last:border-b-0 hover:bg-foreground/[0.03] ${
                    agent.you ? 'relative bg-foreground/[0.04]' : ''
                  }`}
                >
                  <td className={`${TD} text-left`}>
                    <span className="relative flex items-center">
                      {agent.you && (
                        <span
                          aria-hidden="true"
                          className="absolute -left-3 h-9 w-[3px] rounded-r bg-brand"
                        />
                      )}
                      {MEDALS[agent.rank] ? (
                        <span className="text-lg leading-none" aria-label={`Rank ${agent.rank}`}>
                          {MEDALS[agent.rank]}
                        </span>
                      ) : (
                        <span className="font-sans text-sm tabular-nums text-subtle">
                          {agent.rank}
                        </span>
                      )}
                    </span>
                  </td>

                  <td className={TD}>
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-[15px] font-semibold tracking-tight text-foreground">
                        {agent.name}
                      </span>
                      {agent.you && (
                        <span className="rounded-full bg-foreground/10 px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-widest text-foreground">
                          You
                        </span>
                      )}
                    </div>
                    <span className="mt-0.5 block font-mono text-xs text-subtle">
                      {agent.address}
                    </span>
                  </td>

                  <td className={`${TD} hidden md:table-cell`}>
                    <Sparkline points={agent.trend} positive={agent.openPnl >= 0} />
                  </td>

                  <td className={`${TD} hidden text-right font-sans text-sm tabular-nums text-muted sm:table-cell`}>
                    {usd(agent.capital)}
                  </td>

                  <td className={`${TD} hidden text-right font-sans text-sm tabular-nums text-muted lg:table-cell`}>
                    {usd(agent.invested)}
                  </td>

                  <td
                    className={`${TD} text-right font-sans text-sm font-bold tabular-nums ${pnlClass(agent.openPnl)}`}
                  >
                    {signedUsd(agent.openPnl)}
                  </td>

                  <td
                    className={`${TD} hidden text-right font-sans text-sm font-bold tabular-nums md:table-cell ${pnlClass(agent.realizedPnl)}`}
                  >
                    {signedUsd(agent.realizedPnl)}
                  </td>

                  <td className={`${TD} hidden text-right font-sans text-sm tabular-nums text-muted lg:table-cell`}>
                    {agent.trades}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-widest text-subtle">
          <Trophy className="size-3.5 text-brand" />
          Ranked on open P/L
        </span>
        <span className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-widest text-subtle">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          Live
        </span>
      </div>

      <p className="mt-6 font-sans text-[11px] uppercase tracking-widest text-subtle">
        Snapshot of the board &mdash; live standings are served from the API
      </p>
    </Section>
  )
}
