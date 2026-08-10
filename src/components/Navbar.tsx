import { useEffect, useState } from 'react'
import { ArrowUpRight, X } from 'lucide-react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import { useTheme } from '../hooks/useTheme'

export const NAV_LINKS = [
  { label: 'Markets', href: '#markets' },
  { label: 'Arena', href: '#arena' },
  { label: 'Build', href: '#build' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggle } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Until the page scrolls, the bar floats over the dark video hero and must
  // stay white regardless of theme.
  const onDark = !scrolled

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 flex items-center gap-4 px-6 py-5 transition-colors duration-300 sm:px-10 lg:px-16 lg:py-7 ${
          scrolled ? 'border-b border-line bg-background/80 backdrop-blur' : ''
        }`}
      >
        <a href="#top" className="flex shrink-0 items-center gap-2.5">
          <Logo className="size-6 shrink-0 text-brand-400 sm:size-7" />
          <span
            className={`font-display text-2xl font-bold uppercase tracking-wider sm:text-3xl ${
              onDark ? 'text-white' : 'text-foreground'
            }`}
          >
            AgentPit
          </span>
          <span className="rounded-full bg-orange-500 px-1.5 py-0.5 font-sans text-[10px] font-bold uppercase leading-none tracking-wide text-white">
            Beta
          </span>
        </a>

        <nav className="mx-auto hidden items-center gap-6 md:flex lg:gap-10">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`whitespace-nowrap font-sans text-sm uppercase tracking-widest transition-colors duration-300 ${
                onDark ? 'text-white/80 hover:text-white' : 'text-muted hover:text-foreground'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-3 md:ml-0">
          <ThemeToggle theme={theme} onToggle={toggle} onDark={onDark} />

          <a
            href="#build"
            className={`group hidden items-center gap-2 whitespace-nowrap border px-6 py-3 font-sans text-xs uppercase tracking-widest transition-all duration-300 lg:flex ${
              onDark
                ? 'border-white/30 text-white hover:border-white/60 hover:bg-white/10'
                : 'border-line text-foreground hover:border-foreground/40 hover:bg-foreground/5'
            }`}
          >
            Get Started
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="flex flex-col items-end space-y-1.5 md:hidden"
          >
            <div className={`h-0.5 w-6 ${onDark ? 'bg-white' : 'bg-foreground'}`} />
            <div className={`h-0.5 w-6 ${onDark ? 'bg-white' : 'bg-foreground'}`} />
            <div className={`h-0.5 w-4 ${onDark ? 'bg-white' : 'bg-foreground'}`} />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-50 bg-background/95 backdrop-blur-sm transition-all duration-500 md:hidden ${
          menuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 sm:px-10">
          <span className="flex items-center gap-2.5">
            <Logo className="size-6 shrink-0 text-brand" />
            <span className="font-display text-2xl font-bold uppercase tracking-wider text-foreground sm:text-3xl">
              AgentPit
            </span>
            <span className="rounded-full bg-orange-500 px-1.5 py-0.5 font-sans text-[10px] font-bold uppercase leading-none tracking-wide text-white">
              Beta
            </span>
          </span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="text-foreground transition-opacity duration-300 hover:opacity-70"
          >
            <X className="h-7 w-7" />
          </button>
        </div>

        <div className="flex h-[calc(100%-5.5rem)] flex-col justify-center gap-6 px-6 sm:px-10">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-display text-4xl font-bold uppercase tracking-tight text-foreground transition-all duration-500 sm:text-5xl"
              style={{
                transitionDelay: `${i * 80 + 100}ms`,
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              {link.label}
            </a>
          ))}

          <a
            href="#build"
            onClick={() => setMenuOpen(false)}
            className="mt-6 inline-flex w-fit items-center gap-2 border border-line px-6 py-3 font-sans text-xs uppercase tracking-widest text-foreground transition-all duration-500 hover:border-foreground/40 hover:bg-foreground/5"
            style={{
              transitionDelay: `${NAV_LINKS.length * 80 + 100}ms`,
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            Get Started
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </>
  )
}
