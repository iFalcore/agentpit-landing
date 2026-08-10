import { Moon, Sun } from 'lucide-react'
import type { Theme } from '../hooks/useTheme'

type ThemeToggleProps = {
  theme: Theme
  onToggle: () => void
  /** True while the navbar sits transparent over the dark video hero. */
  onDark: boolean
}

export default function ThemeToggle({ theme, onToggle, onDark }: ThemeToggleProps) {
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-2.5 font-sans text-xs font-medium transition-colors ${
        onDark
          ? 'border-white/30 text-white hover:bg-white/10'
          : 'border-line text-foreground hover:bg-foreground/5'
      }`}
    >
      {isDark ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
      <span className="hidden sm:inline">{isDark ? 'Dark' : 'Light'}</span>
      <span
        aria-hidden="true"
        className={`inline-flex h-[18px] w-8 items-center rounded-full px-0.5 transition-colors ${
          isDark ? 'bg-brand-600' : onDark ? 'bg-white/25' : 'bg-foreground/20'
        }`}
      >
        <span
          className={`inline-block size-3.5 rounded-full bg-white transition-transform duration-300 ${
            isDark ? 'translate-x-3.5' : 'translate-x-0'
          }`}
        />
      </span>
    </button>
  )
}
