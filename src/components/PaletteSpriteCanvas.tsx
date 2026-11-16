import { useEffect, useRef, useState } from 'react'
import type { ColorAnswer, Question } from '../domain/quiz'

interface Props {
  question: Question
  color: ColorAnswer
  label: string
}

const clamp = (value: number, minimum = 0, maximum = 100) => Math.min(maximum, Math.max(minimum, value))
const hueDistance = (left: number, right: number) => Math.min(Math.abs(left - right), 360 - Math.abs(left - right))

function rgbToHsl(red: number, green: number, blue: number): [number, number, number] {
  const r = red / 255
  const g = green / 255
  const b = blue / 255
  const maximum = Math.max(r, g, b)
  const minimum = Math.min(r, g, b)
  const lightness = (maximum + minimum) / 2
  const difference = maximum - minimum
  if (difference === 0) return [0, 0, lightness * 100]
  const saturation = difference / (1 - Math.abs(2 * lightness - 1))
  const hue = maximum === r
    ? 60 * (((g - b) / difference) % 6)
    : maximum === g
      ? 60 * (((b - r) / difference) + 2)
      : 60 * (((r - g) / difference) + 4)
  return [(hue + 360) % 360, saturation * 100, lightness * 100]
}

function hslToRgb(hue: number, saturation: number, lightness: number): [number, number, number] {
  const s = clamp(saturation) / 100
  const l = clamp(lightness) / 100
  const chroma = (1 - Math.abs(2 * l - 1)) * s
  const segment = ((hue % 360) + 360) % 360 / 60
  const intermediate = chroma * (1 - Math.abs((segment % 2) - 1))
  const [r, g, b] = segment < 1 ? [chroma, intermediate, 0]
    : segment < 2 ? [intermediate, chroma, 0]
      : segment < 3 ? [0, chroma, intermediate]
        : segment < 4 ? [0, intermediate, chroma]
          : segment < 5 ? [intermediate, 0, chroma]
            : [chroma, 0, intermediate]
  const offset = l - chroma / 2
  return [r, g, b].map((value) => Math.round((value + offset) * 255)) as [number, number, number]
}

export function PaletteSpriteCanvas({ question, color, label }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sourceRef = useRef<ImageData | null>(null)
  const paletteAnchorRef = useRef<[number, number, number] | null>(null)
  const [loadFailed, setLoadFailed] = useState(false)
  const [imageVersion, setImageVersion] = useState(0)
  const source = question.media?.src
  const canvasSource = source ? `${source}${source.includes('?') ? '&' : '?'}palette-canvas=v1` : undefined
  const target = question.paletteTarget

  useEffect(() => {
    let cancelled = false
    sourceRef.current = null
    paletteAnchorRef.current = null
    setLoadFailed(false)
    if (!canvasSource || !target) return
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      if (cancelled) return
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      const context = canvas.getContext('2d', { willReadFrequently: true })
      if (!context) return
      context.imageSmoothingEnabled = false
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0)
      try {
        sourceRef.current = context.getImageData(0, 0, canvas.width, canvas.height)
        let closestColor: [number, number, number] | null = null
        let closestDistance = Number.POSITIVE_INFINITY
        const sourcePixels = sourceRef.current.data
        for (let index = 0; index < sourcePixels.length; index += 4) {
          if (sourcePixels[index + 3] < 128) continue
          const candidate = rgbToHsl(sourcePixels[index], sourcePixels[index + 1], sourcePixels[index + 2])
          if (candidate[1] < 12) continue
          const distance = (hueDistance(candidate[0], target.hue) / 180) ** 2 * .62
            + ((candidate[1] - target.saturation) / 100) ** 2 * .16
            + ((candidate[2] - target.lightness) / 100) ** 2 * .22
          if (distance < closestDistance) {
            closestDistance = distance
            closestColor = candidate
          }
        }
        paletteAnchorRef.current = closestColor ?? [target.hue, target.saturation, target.lightness]
        if (cancelled) return
        setLoadFailed(false)
        setImageVersion((version) => version + 1)
      } catch {
        if (cancelled) return
        setLoadFailed(true)
      }
    }
    image.onerror = () => {
      if (!cancelled) setLoadFailed(true)
    }
    image.src = canvasSource

    return () => {
      cancelled = true
      image.onload = null
      image.onerror = null
    }
  }, [canvasSource, target])

  useEffect(() => {
    const canvas = canvasRef.current
    const sourceImage = sourceRef.current
    const paletteAnchor = paletteAnchorRef.current
    if (!canvas || !sourceImage || !paletteAnchor || !target) return
    const pixels = new Uint8ClampedArray(sourceImage.data)
    const hueTolerance = target.hueTolerance ?? 24
    const lightnessTolerance = target.lightnessTolerance ?? 24
    const saturationRatio = color.saturation / Math.max(1, target.saturation)
    const lightnessOffset = color.lightness - target.lightness
    const hueShift = ((color.hue - target.hue + 540) % 360) - 180

    for (let index = 0; index < pixels.length; index += 4) {
      if (pixels[index + 3] === 0) continue
      const [hue, saturation, lightness] = rgbToHsl(pixels[index], pixels[index + 1], pixels[index + 2])
      if (saturation < 14 || hueDistance(hue, paletteAnchor[0]) > hueTolerance || Math.abs(lightness - paletteAnchor[2]) > lightnessTolerance) continue
      const [red, green, blue] = hslToRgb(
        hue + hueShift,
        saturation * saturationRatio,
        lightness + lightnessOffset,
      )
      pixels[index] = red
      pixels[index + 1] = green
      pixels[index + 2] = blue
    }

    canvas.getContext('2d')?.putImageData(new ImageData(pixels, sourceImage.width, sourceImage.height), 0, 0)
  }, [color, imageVersion, target])

  return (
    <div className="palette-sprite-frame">
      <canvas ref={canvasRef} role="img" aria-label={label} />
      {loadFailed && source && <img src={source} alt={label} crossOrigin="anonymous" />}
    </div>
  )
}
