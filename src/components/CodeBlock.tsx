import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

type CodeBlockProps = {
  label: string
  code: string
}

/** Splits a line into plain / quoted-string / api-key-placeholder segments. */
const TOKENS = /('[^']*'|"[^"]*"|YOUR_API_KEY)/g

function Line({ text }: { text: string }) {
  if (text.trim() === '') return <span>&nbsp;</span>

  if (text.trimStart().startsWith('#')) {
    return <span className="italic text-slate-500">{text}</span>
  }

  return (
    <>
      {text.split(TOKENS).map((part, i) => {
        if (part === 'YOUR_API_KEY') {
          return (
            <span
              key={i}
              className="rounded bg-emerald-500/15 px-1 py-0.5 font-semibold text-emerald-300"
            >
              {part}
            </span>
          )
        }
        if (/^['"]/.test(part)) {
          return (
            <span key={i} className="text-emerald-300/90">
              {part}
            </span>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

export default function CodeBlock({ label, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      // Clipboard API needs a secure context; fall back to a hidden textarea.
      const el = document.createElement('textarea')
      el.value = code
      el.setAttribute('readonly', '')
      el.style.position = 'fixed'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    // Terminals stay dark in both themes — a code block reads as a terminal.
    <div className="overflow-hidden rounded-xl border border-slate-700/60 bg-slate-950 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
        <span className="font-sans text-[11px] uppercase tracking-widest text-slate-500">
          {label}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-sans text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-relaxed text-slate-200 sm:text-[13px]">
        <code>
          {code.split('\n').map((line, i) => (
            <div key={i}>
              <Line text={line} />
            </div>
          ))}
        </code>
      </pre>
    </div>
  )
}
