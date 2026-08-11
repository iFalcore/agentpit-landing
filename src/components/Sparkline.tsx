import { useId } from 'react'

type SparklineProps = {
  points: number[]
  positive: boolean
  width?: number
  height?: number
}

/** Small equity-curve trace: line, faded area fill, and a dot on the last point. */
export default function Sparkline({ points, positive, width = 92, height = 34 }: SparklineProps) {
  const gradientId = useId()
  const pad = 3
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const step = (width - pad * 2) / (points.length - 1)

  const coords = points.map((p, i): [number, number] => [
    pad + i * step,
    height - pad - ((p - min) / range) * (height - pad * 2),
  ])

  const line = coords
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ')
  const area = `${line} L${coords[coords.length - 1][0].toFixed(1)},${height} L${coords[0][0].toFixed(1)},${height} Z`

  const stroke = positive ? '#34d399' : '#f87171'
  const [lastX, lastY] = coords[coords.length - 1]

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      aria-hidden="true"
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.28" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <path d={line} stroke={stroke} strokeWidth="1.25" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lastX} cy={lastY} r="2.4" fill="none" stroke={stroke} strokeWidth="1.25" />
    </svg>
  )
}
