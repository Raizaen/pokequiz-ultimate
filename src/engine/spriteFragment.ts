export interface PixelBounds {
  left: number
  top: number
  right: number
  bottom: number
}

export interface FragmentLayout {
  left: number
  top: number
  scale: number
  originX: number
  originY: number
}

export function findOpaqueBounds(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
): PixelBounds | null {
  let left = width
  let top = height
  let right = -1
  let bottom = -1

  for (let index = 0; index < width * height; index += 1) {
    if (pixels[index * 4 + 3] < 8) continue
    const x = index % width
    const y = Math.floor(index / width)
    left = Math.min(left, x)
    top = Math.min(top, y)
    right = Math.max(right, x)
    bottom = Math.max(bottom, y)
  }

  return right < left ? null : { left, top, right, bottom }
}

export function fragmentLayout(
  bounds: PixelBounds,
  sourceWidth: number,
  sourceHeight: number,
  imageSize = 150,
  frameSize = 180,
): FragmentLayout {
  const visibleWidth = bounds.right - bounds.left + 1
  const visibleHeight = bounds.bottom - bounds.top + 1
  const largestVisibleSide = Math.max(
    visibleWidth / sourceWidth * imageSize,
    visibleHeight / sourceHeight * imageSize,
  )
  const centerX = (bounds.left + bounds.right + 1) / 2
  const centerY = (bounds.top + bounds.bottom + 1) / 2

  return {
    left: frameSize / 2 - centerX / sourceWidth * imageSize,
    top: frameSize / 2 - centerY / sourceHeight * imageSize,
    scale: Math.min(7, Math.max(2.2, 300 / largestVisibleSide)),
    originX: centerX / sourceWidth * 100,
    originY: centerY / sourceHeight * 100,
  }
}
