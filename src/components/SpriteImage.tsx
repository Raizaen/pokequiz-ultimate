import { useState, type CSSProperties, type SyntheticEvent } from 'react'
import type { Question } from '../domain/quiz'
import { findOpaqueBounds, fragmentLayout, type FragmentLayout } from '../engine/spriteFragment'

interface Props {
  media: NonNullable<Question['media']>
  revealed: boolean
}

export function SpriteImage({ media, revealed }: Props) {
  const [layout, setLayout] = useState<FragmentLayout | null>(null)
  const isFragment = media.spriteVariant === 'zoom' && !revealed

  const analyse = (event: SyntheticEvent<HTMLImageElement>) => {
    if (media.spriteVariant !== 'zoom') return
    const image = event.currentTarget
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) return

    try {
      context.drawImage(image, 0, 0)
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data
      const bounds = findOpaqueBounds(pixels, canvas.width, canvas.height)
      if (bounds) setLayout(fragmentLayout(bounds, canvas.width, canvas.height))
    } catch {
      setLayout(null)
    }
  }

  const fragmentStyle: CSSProperties | undefined = isFragment && layout
    ? {
      position: 'absolute',
      left: layout.left,
      top: layout.top,
      transform: `scale(${layout.scale})`,
      transformOrigin: `${layout.originX}% ${layout.originY}%`,
    }
    : undefined

  return (
    <img
      src={media.src}
      alt={media.alt}
      crossOrigin="anonymous"
      onLoad={analyse}
      style={fragmentStyle}
    />
  )
}
