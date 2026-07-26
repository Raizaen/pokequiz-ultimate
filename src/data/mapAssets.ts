export interface MapAsset {
  src: string
  aspectRatio: string
}

export const mapAssets: Record<string, MapAsset> = {
  Paldea: { src: '/assets/maps/paldea-map-clean.png', aspectRatio: '1 / 1' },
  Sinnoh: { src: '/assets/maps/sinnoh-map.png', aspectRatio: '1268 / 734' },
}

export function mapAssetFor(region?: string): MapAsset {
  return mapAssets[region ?? 'Paldea'] ?? mapAssets.Paldea
}
