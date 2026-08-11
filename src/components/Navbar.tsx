import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUpRight, X } from 'lucide-react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import { useTheme } from '../hooks/useTheme'
import { useSectionNav } from '../hooks/useSectionNav'

/** Sections live on the landing page; Docs is a route of its own. */
export const NAV_LINKS = [
  { label: 'Markets', section: 'markets' },
  { label: 'Arena', section: 'arena' },
  { label: 'Build', section: 'build' },
  { label: 'Docs', to: '/docs' },
] as const

/** Auth lives in the app — /login and /signup both redirect to the root. */
const APP_URL = 'https://agentpit.dev/'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggle } = useTheme()
  const goToSection = useSectionNav()
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // The bar floats over the dark video hero only at the top of the landing
  // page; everywhere else it sits on the themed background.
  const onDark = !scrolled && pathname === '/'

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 flex items-center gap-4 px-6 py-5 transition-colors duration-300 sm:px-10 lg:px-16 lg:py-7 ${
          scrolled || pathname !== '/' ? 'border-b border-line bg-background/80 backdrop-blur' : ''
        }`}
      >
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
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
        </Link>

        <nav className="mx-auto hidden items-center gap-6 md:flex lg:gap-9">
          {NAV_LINKS.map((link) => {
            const cls = `whitespace-nowrap font-sans text-sm uppercase tracking-widest transition-colors duration-300 ${
              onDark ? 'text-white/80 hover:text-white' : 'text-muted hover:text-foreground'
            }`
            return 'to' in link ? (
              <Link key={link.label} to={link.to} className={cls}>
                {link.label}
              </Link>
            ) : (
              <button key={link.label} type="button" onClick={() => goToSection(link.section)} className={cls}>
                {link.label}
              </button>
            )
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-3 md:ml-0">
          <ThemeToggle theme={theme} onToggle={toggle} onDark={onDark} />

          <a
            href={APP_URL}
            className={`hidden whitespace-nowrap px-4 py-3 font-sans text-xs uppercase tracking-widest transition-colors duration-300 lg:inline-flex ${
              onDark ? 'text-white/80 hover:text-white' : 'text-muted hover:text-foreground'
            }`}
          >
            Log in
          </a>

          <a
            href={APP_URL}
            className="hidden whitespace-nowrap bg-brand-600 px-5 py-3 font-sans text-xs uppercase tracking-widest text-white transition duration-300 hover:brightness-110 md:inline-flex"
          >
            Sign up
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
          {NAV_LINKS.map((link, i) => {
            const style = {
              transitionDelay: `${i * 80 + 100}ms`,
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
            }
            const cls =
              'w-fit font-display text-4xl font-bold uppercase tracking-tight text-foreground transition-all duration-500 sm:text-5xl'
            return 'to' in link ? (
              <Link key={link.label} to={link.to} onClick={() => setMenuOpen(false)} className={cls} style={style}>
                {link.label}
              </Link>
            ) : (
              <button
                key={link.label}
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  goToSection(link.section)
                }}
                className={`${cls} text-left`}
                style={style}
              >
                {link.label}
              </button>
            )
          })}

          <div
            className="mt-6 flex flex-wrap items-center gap-3 transition-all duration-500"
            style={{
              transitionDelay: `${NAV_LINKS.length * 80 + 100}ms`,
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            <a
              href={APP_URL}
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center gap-2 border border-line px-6 py-3 font-sans text-xs uppercase tracking-widest text-foreground transition-colors hover:border-foreground/40 hover:bg-foreground/5"
            >
              Log in
            </a>
            <a
              href={APP_URL}
              onClick={() => setMenuOpen(false)}
              className="group inline-flex items-center gap-2 bg-brand-600 px-6 py-3 font-sans text-xs uppercase tracking-widest text-white transition hover:brightness-110"
            >
              Sign up
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
