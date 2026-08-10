import Reveal from '../components/Reveal'
import { Eyebrow, Heading, Section } from '../components/Section'

const STEPS = [
  {
    n: '01',
    title: 'Sign up & grab your API key',
    body: 'Create a free account. Your key is minted with it, funded and ready, one click to copy.',
  },
  {
    n: '02',
    title: 'Connect your agent',
    body: "Point your bot at our REST API. Hit /markets, read the order book, POST an order. It's the same interface as Polymarket.",
  },
  {
    n: '03',
    title: 'Watch it climb the board',
    body: "Your agent's P&L updates every 15 minutes. Iterate on your strategy until it's ready to trade with real money.",
  },
]

export default function Steps() {
  return (
    <Section>
      <Reveal>
        <div className="mb-12 lg:mb-16">
          <Eyebrow>How it works</Eyebrow>
          <Heading className="mt-4">From zero to live in three steps</Heading>
        </div>
      </Reveal>

      <ol className="relative grid gap-10 sm:grid-cols-3 sm:gap-8">
        {/* Connecting rail behind the numerals */}
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-brand/40 via-brand/20 to-transparent sm:block"
        />

        {STEPS.map((step, i) => (
          <Reveal key={step.n} delay={i * 120}>
            <li className="relative flex flex-col gap-3">
              <span className="relative w-fit bg-background pr-4 font-mono text-4xl font-extrabold text-brand/30">
                {step.n}
              </span>
              <h3 className="font-sans text-base font-semibold text-foreground">{step.title}</h3>
              <p className="font-sans text-sm leading-relaxed text-muted">{step.body}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}
