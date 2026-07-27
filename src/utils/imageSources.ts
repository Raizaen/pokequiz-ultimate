const rawPrefix = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/'
const cdnPrefix = 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/'

export function preferImageCdn(url: string): string {
  return url.startsWith(rawPrefix) ? url.replace(rawPrefix, cdnPrefix) : url
}

export function imageFallbacks(url: string): string[] {
  const primary = preferImageCdn(url)
  const fallback = primary.startsWith(cdnPrefix) ? primary.replace(cdnPrefix, rawPrefix) : null
  return [...new Set([primary, fallback].filter((candidate): candidate is string => Boolean(candidate)))]
}
