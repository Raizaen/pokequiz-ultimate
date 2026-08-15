export type MiningTool = 'pickaxe' | 'hammer'

const columns = 8
const rows = 6

interface MiningHitResult {
  rocks: number[]
  affected: number[]
}

export function applyMiningHit(rocks: number[], index: number, tool: MiningTool): MiningHitResult {
  const next = [...rocks]
  const affected = new Set<number>()
  const originX = index % columns
  const originY = Math.floor(index / columns)
  const offsets = tool === 'pickaxe'
    ? [[0, 0, 2], [0, -1, 1], [1, 0, 1], [0, 1, 1], [-1, 0, 1]]
    : Array.from({ length: 9 }, (_, offset) => {
      const offsetX = (offset % 3) - 1
      const offsetY = Math.floor(offset / 3) - 1
      return [offsetX, offsetY, offsetX === 0 && offsetY === 0 ? 2 : 1]
    })

  offsets.forEach(([offsetX, offsetY, power]) => {
    const targetX = originX + offsetX
    const targetY = originY + offsetY
    if (targetX < 0 || targetX >= columns || targetY < 0 || targetY >= rows) return
    const target = targetY * columns + targetX
    if (next[target] === 0) return
    next[target] = Math.max(0, next[target] - power)
    affected.add(target)
  })

  return { rocks: next, affected: [...affected] }
}
