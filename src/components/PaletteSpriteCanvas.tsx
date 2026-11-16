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
  const [loadFailed, setLoadFailed] = useState(false)
  const [imageVersion, setImageVersion] = useState(0)
  const source = question.media?.src
  const target = question.paletteTarget

  useEffect(() => {
    sourceRef.current = null
    setLoadFailed(false)
    if (!source || !target) return
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
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
        setLoadFailed(false)
        setImageVersion((version) => version + 1)
      } catch {
        setLoadFailed(true)
      }
    }
    image.onerror = () => setLoadFailed(true)
    image.src = source
  }, [source, target])

  useEffect(() => {
    const canvas = canvasRef.current
    const sourceImage = sourceRef.current
    if (!canvas || !sourceImage || !target) return
    const pixels = new Uint8ClampedArray(sourceImage.data)
    const hueTolerance = target.hueTolerance ?? 24
    const lightnessTolerance = target.lightnessTolerance ?? 24
    const saturationRatio = color.saturation / Math.max(1, target.saturation)
    const lightnessOffset = color.lightness - target.lightness

    for (let index = 0; index < pixels.length; index += 4) {
      if (pixels[index + 3] === 0) continue
      const [hue, saturation, lightness] = rgbToHsl(pixels[index], pixels[index + 1], pixels[index + 2])
      if (saturation < 14 || hueDistance(hue, target.hue) > hueTolerance || Math.abs(lightness - target.lightness) > lightnessTolerance) continue
      const relativeHue = ((hue - target.hue + 540) % 360) - 180
      const [red, green, blue] = hslToRgb(
        color.hue + relativeHue * .18,
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
      {loadFailed && source && <img src={source} alt={label} />}
    </div>
  )
}
