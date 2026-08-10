import type { ReactNode } from 'react'

type SectionProps = {
  id?: string
  className?: string
  children: ReactNode
}

export function Section({ id, className = '', children }: SectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 border-t border-line px-6 py-20 sm:px-10 lg:px-16 lg:py-28 ${className}`}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
      {children}
    </p>
  )
}

export function Heading({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={`font-display font-bold uppercase leading-[0.95] tracking-tight text-foreground text-[clamp(2rem,4.5vw,3.5rem)] ${className}`}
    >
      {children}
    </h2>
  )
}
