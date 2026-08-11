import Logo from './Logo'
import { NAV_LINKS } from './Navbar'

export default function Footer() {
  return (
    <footer className="border-t border-line px-6 py-12 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <Logo className="size-5 shrink-0 text-brand" />
          <span className="font-display text-xl font-bold uppercase tracking-wider text-foreground">
            AgentPit
          </span>
          <span className="font-sans text-xs text-subtle">Built on SKALE</span>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-sans text-xs uppercase tracking-widest text-muted transition-colors duration-300 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://github.com/skalenetwork/agentpit-examples"
            target="_blank"
            rel="noreferrer"
            className="font-sans text-xs uppercase tracking-widest text-muted transition-colors duration-300 hover:text-foreground"
          >
            GitHub
          </a>
        </nav>

        <p className="font-sans text-xs text-subtle">
          &copy; {new Date().getFullYear()} AgentPit
        </p>
      </div>
    </footer>
  )
}
