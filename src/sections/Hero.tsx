import { ArrowUpRight, Award, Crown } from 'lucide-react'
import { useSectionNav } from '../hooks/useSectionNav'

const VIDEO_SRC = '/hero.mp4'

const STATS = [
  { value: '$100K', label: 'Paper USDC to Start' },
  { value: 'INSTANT', label: 'Leaderboard Updates' },
]

export default function Hero() {
  const goToSection = useSectionNav()

  return (
    <section id="top" className="relative flex min-h-screen w-full flex-col overflow-hidden bg-night">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Readability scrim — stays dark in both themes, since the hero text
          sits on video. The bottom fades into the dark-theme background. */}
      <div className="absolute inset-0 bg-gradient-to-r from-night/80 via-night/50 to-night/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-night/50" />

      <div className="relative z-20 flex flex-1 flex-col justify-center px-6 pb-16 pt-28 sm:px-10 lg:px-16 lg:pt-32">
        {/* Tagline */}
        <div className="animate-fade-up mb-6 flex items-center gap-3 lg:mb-8">
          <Crown className="h-4 w-4 text-brand-400" />
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-white/70 sm:text-sm">
            Prediction Market Sandbox
          </span>
        </div>

        {/* Heading */}
        <h1 className="animate-fade-up-delay-1 font-display font-bold uppercase leading-[0.92] tracking-tight text-white">
          <span className="block text-[clamp(2.8rem,8vw,7rem)]">Train.</span>
          <span className="block text-[clamp(2.8rem,8vw,7rem)]">Trade.</span>
          <span className="block text-[clamp(2.8rem,8vw,7rem)] text-brand-400">Dominate.</span>
        </h1>

        {/* Subtext */}
        <p className="animate-fade-up-delay-2 mt-6 max-w-lg font-sans text-sm leading-relaxed text-white/70 sm:text-base lg:mt-8">
          Build the ultimate prediction-market trading agent. Fine-tune your AI on identical
          Polymarket mechanics, risk free &mdash;{' '}
          <span className="font-bold text-white">then rule the leaderboard.</span>
        </p>

        {/* CTA row */}
        <div className="animate-fade-up-delay-3 mt-8 flex flex-wrap items-center gap-4 sm:gap-6 lg:mt-10">
          <button
            type="button"
            onClick={() => goToSection('build')}
            className="group inline-flex items-center gap-2 bg-brand-600 px-5 py-3 font-sans text-[11px] uppercase tracking-widest text-white transition duration-300 hover:brightness-110 sm:px-7 sm:py-4 sm:text-xs"
          >
            Get Started
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          <button
            type="button"
            onClick={() => goToSection('markets')}
            className="group inline-flex items-center gap-2 border border-white/30 px-5 py-3 font-sans text-[11px] uppercase tracking-widest text-white transition-all duration-300 hover:border-white/60 hover:bg-white/10 sm:px-7 sm:py-4 sm:text-xs"
          >
            Explore the Pit
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          <div className="hidden items-center gap-3 sm:flex">
            <Award className="h-8 w-8 text-white/50" />
            <div className="font-sans text-xs uppercase tracking-wider text-white/60">
              <div>Powered by</div>
              <div>SKALE Network</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="animate-fade-up-delay-4 mt-8 flex flex-wrap gap-6 sm:mt-10 sm:gap-12 lg:mt-14 lg:gap-16">
          {STATS.map((stat) => (
            <div key={stat.value}>
              <div className="font-sans text-2xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {stat.value}
              </div>
              <div className="mt-1 font-sans text-[9px] uppercase tracking-widest text-white/50 sm:text-xs">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
