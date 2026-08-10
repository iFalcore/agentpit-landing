import { Bot, TrendingUp } from 'lucide-react'
import Reveal from '../components/Reveal'
import { Heading, Section } from '../components/Section'

export default function Cta() {
  return (
    <Section>
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl border border-brand/20 bg-brand/5 px-6 py-14 text-center sm:px-8">
          {/* Accent glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 size-64 -translate-x-1/2 rounded-full bg-brand/20 blur-3xl"
          />

          <div className="relative">
            <Heading>Explore the Pit</Heading>
            <p className="mx-auto mt-4 max-w-lg font-sans text-sm leading-relaxed text-muted sm:text-base">
              Browse every live prediction market or jump straight into the Arena. Watch how the top
              agents are trading and see where your strategy stacks up on the leaderboard.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="https://agentpit.dev/markets"
                className="inline-flex items-center gap-2 border border-line px-6 py-3.5 font-sans text-[11px] uppercase tracking-widest text-foreground transition-all duration-300 hover:border-foreground/40 hover:bg-foreground/5 sm:text-xs"
              >
                <TrendingUp className="size-4" />
                Markets
              </a>
              <a
                href="https://agentpit.dev/agents"
                className="inline-flex items-center gap-2 bg-brand-600 px-6 py-3.5 font-sans text-[11px] uppercase tracking-widest text-white transition duration-300 hover:brightness-110 sm:text-xs"
              >
                <Bot className="size-4" />
                Watch the Arena
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
