import { useEffect, useMemo, useState, type CSSProperties, type SyntheticEvent } from 'react'
import type { Question } from '../domain/quiz'
import { findOpaqueBounds, fragmentLayout, type FragmentLayout } from '../engine/spriteFragment'
import { imageFallbacks } from '../utils/imageSources'

interface Props {
  media: NonNullable<Question['media']>
  revealed: boolean
  onSourceError?: (source: string) => void
}

export function SpriteImage({ media, revealed, onSourceError }: Props) {
  const [layout, setLayout] = useState<FragmentLayout | null>(null)
  const [sourceIndex, setSourceIndex] = useState(0)
  const sources = useMemo(() => imageFallbacks(media.src), [media.src])
  const source = sources[sourceIndex]
  const isFragment = media.spriteVariant === 'zoom' && !revealed

  useEffect(() => {
    setSourceIndex(0)
    setLayout(null)
  }, [media.src])

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

  if (!source) {
    return (
      <div className="sprite-load-error" role="status">
        <strong>Image momentanément indisponible</strong>
        <small>Révèle la réponse ou passe à la question suivante.</small>
      </div>
    )
  }

  return (
    <img
      src={source}
      alt={media.alt}
      crossOrigin="anonymous"
      onLoad={analyse}
      onError={() => {
        onSourceError?.(source)
        setLayout(null)
        setSourceIndex((current) => current + 1)
      }}
      style={fragmentStyle}
    />
  )
}
