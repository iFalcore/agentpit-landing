import { ArrowLeftRight, FileCode2, Link2, Receipt, Scale, Wallet } from 'lucide-react'
import Reveal from '../components/Reveal'
import { Eyebrow, Heading, Section } from '../components/Section'

const ON_CHAIN = [
  { icon: Wallet, term: 'Wallet', body: 'minted at signup, signs every order' },
  { icon: FileCode2, term: 'Contracts', body: "Polymarket's CTF tokens and exchange" },
  { icon: ArrowLeftRight, term: 'Fills', body: 'each match settles as a transaction' },
]

const CHAIN_GIVES = [
  { icon: Link2, term: 'EVM', body: 'your wallet and libraries already work' },
  { icon: Receipt, term: 'Receipts', body: 'every fill has a transaction behind it' },
  { icon: Scale, term: 'Parity', body: 'paper money, the same code path as live' },
]

type Item = { icon: typeof Wallet; term: string; body: string }

function ItemGrid({ items }: { items: Item[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map(({ icon: Icon, term, body }, i) => (
        <Reveal key={term} delay={i * 100}>
          <div className="group h-full rounded-2xl border border-line bg-foreground/[0.02] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:bg-brand/[0.04]">
            <Icon className="size-5 text-brand transition-transform duration-300 group-hover:scale-110" />
            <h4 className="mt-4 font-sans text-[11px] font-bold uppercase tracking-widest text-foreground">
              {term}
            </h4>
            <p className="mt-1.5 font-sans text-sm leading-relaxed text-muted">{body}</p>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

export default function Skale() {
  return (
    <Section id="skale">
      <Reveal>
        <div className="mb-14 lg:mb-20">
          <Eyebrow>Powered by</Eyebrow>
          <Heading className="mt-4">
            Built on <span className="text-brand">SKALE Network</span>
          </Heading>
          <p className="mt-5 max-w-xl font-sans text-sm leading-relaxed text-muted sm:text-base">
            What your agent learns in the sandbox is what it meets on the live chain &mdash; same
            contracts, same settlement, paper money.
          </p>
        </div>
      </Reveal>

      <Reveal>
        <div className="mb-8">
          <Eyebrow>What we put on it</Eyebrow>
          <h3 className="mt-3 font-display text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl">
            Your position is a token you hold
          </h3>
          <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-muted">
            The paper is fake on purpose. The machinery under it is not.
          </p>
        </div>
      </Reveal>
      <ItemGrid items={ON_CHAIN} />

      <Reveal>
        <div className="mb-8 mt-16">
          <Eyebrow>Why this chain</Eyebrow>
          <h3 className="mt-3 font-display text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl">
            What SKALE gives it
          </h3>
          <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-muted">
            Built for applications that transact constantly &mdash; which an always-on agent is.
          </p>
        </div>
      </Reveal>
      <ItemGrid items={CHAIN_GIVES} />
    </Section>
  )
}
