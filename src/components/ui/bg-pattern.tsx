import React from 'react'
import { cn } from '@/lib/utils'

type BGVariantType =
  | 'dots'
  | 'diagonal-stripes'
  | 'grid'
  | 'horizontal-lines'
  | 'vertical-lines'
  | 'checkerboard'

type BGMaskType =
  | 'fade-center'
  | 'fade-edges'
  | 'fade-top'
  | 'fade-bottom'
  | 'fade-left'
  | 'fade-right'
  | 'none'

interface BGPatternProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BGVariantType
  mask?: BGMaskType
  size?: number
  gap?: number
  /** Foreground color for the pattern (default: currentColor) */
  patternColor?: string
  /** Opacity of the pattern (0–1) */
  patternOpacity?: number
}

const MASK_STYLES: Record<BGMaskType, string> = {
  'none': '',
  'fade-center':
    '[mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]',
  'fade-edges':
    '[mask-image:radial-gradient(ellipse_at_center,transparent_10%,black_40%,transparent_90%)]',
  'fade-top':
    '[mask-image:linear-gradient(to_bottom,transparent,black_40%)]',
  'fade-bottom':
    '[mask-image:linear-gradient(to_top,transparent,black_40%)]',
  'fade-left':
    '[mask-image:linear-gradient(to_right,transparent,black_40%)]',
  'fade-right':
    '[mask-image:linear-gradient(to_left,transparent,black_40%)]',
}

function buildSvgPattern(
  variant: BGVariantType,
  size: number,
  gap: number,
  color: string,
  opacity: number,
): string {
  const fill = encodeURIComponent(color)
  const op = opacity

  switch (variant) {
    case 'dots':
      return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size + gap}' height='${size + gap}'%3E%3Ccircle cx='${(size + gap) / 2}' cy='${(size + gap) / 2}' r='${size / 2}' fill='${fill}' fill-opacity='${op}'/%3E%3C/svg%3E")`

    case 'grid':
      return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size + gap}' height='${size + gap}'%3E%3Crect x='0' y='0' width='${size + gap}' height='${size + gap}' fill='none' stroke='${fill}' stroke-opacity='${op}' stroke-width='${size}'/%3E%3C/svg%3E")`

    case 'horizontal-lines':
      return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size + gap}' height='${size + gap}'%3E%3Crect x='0' y='0' width='${size + gap}' height='${size}' fill='${fill}' fill-opacity='${op}'/%3E%3C/svg%3E")`

    case 'vertical-lines':
      return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size + gap}' height='${size + gap}'%3E%3Crect x='0' y='0' width='${size}' height='${size + gap}' fill='${fill}' fill-opacity='${op}'/%3E%3C/svg%3E")`

    case 'diagonal-stripes': {
      const total = size + gap
      return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${total * 2}' height='${total * 2}'%3E%3Cpath d='M-${total},${total * 2} L${total * 2},-${total} M0,${total * 2} L${total * 2},0 M${total},${total * 2} L${total * 2},${total}' stroke='${fill}' stroke-opacity='${op}' stroke-width='${size}'/%3E%3C/svg%3E")`
    }

    case 'checkerboard': {
      const half = (size + gap) / 2
      return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size + gap}' height='${size + gap}'%3E%3Crect x='0' y='0' width='${half}' height='${half}' fill='${fill}' fill-opacity='${op}'/%3E%3Crect x='${half}' y='${half}' width='${half}' height='${half}' fill='${fill}' fill-opacity='${op}'/%3E%3C/svg%3E")`
    }
  }
}

export function BGPattern({
  variant = 'dots',
  mask = 'none',
  size = 4,
  gap = 16,
  patternColor = 'currentColor',
  patternOpacity = 0.15,
  className,
  style,
  children,
  ...props
}: BGPatternProps) {
  const bgImage = buildSvgPattern(variant, size, gap, patternColor, patternOpacity)

  return (
    <div
      className={cn('relative', className)}
      {...props}
    >
      {/* Pattern layer */}
      <div
        aria-hidden="true"
        className={cn('absolute inset-0 pointer-events-none', MASK_STYLES[mask])}
        style={{ backgroundImage: bgImage, ...style }}
      />
      {/* Content */}
      {children && <div className="relative">{children}</div>}
    </div>
  )
}
