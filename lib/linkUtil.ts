export function createUrl(aliasOrKey: string) {
  return `https://tinyurl.alejoczombos.com.ar/${aliasOrKey}`;
}

export function createUrlWithoutProtocol(aliasOrKey: string) {
  return `tinyurl.alejoczombos.com.ar/${aliasOrKey}`;
}
