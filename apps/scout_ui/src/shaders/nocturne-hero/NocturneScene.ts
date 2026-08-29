export const NOCTURNE_VARIANTS = ["midnight", "dawn", "dusk", "eclipse"] as const;
export type NocturneVariant = (typeof NOCTURNE_VARIANTS)[number];
export const NOCTURNE_TITLES: Record<NocturneVariant, string> = {
  midnight: "Nocturne",
  dawn: "Nocturne",
  dusk: "Nocturne",
  eclipse: "Nocturne",
};
export function buildNocturneDocument(_variant: string) { return ""; }