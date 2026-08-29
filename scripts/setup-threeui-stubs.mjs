import fs from 'node:fs';
import path from 'node:path';

function write(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content, 'utf8');
}

write(
  'apps/scout_ui/src/shaders/landing-pages/sandboxedPageDocument.ts',
  `export function buildSandboxedPageDocument(source: string, _options?: any): string { return source; }`
);

write(
  'apps/scout_ui/src/shaders/sylva-living-world/SylvaLivingWorldScene.ts',
  `export const MAPLE_AUTUMN_STYLE = "";
export const SAKURA_SUNSET_STYLE = "";
export const SEQUOIA_MIST_STYLE = "";
export function applyMapleAutumnVariant(source: string) { return source; }
export function applySakuraSunsetVariant(source: string) { return source; }
export function applySequoiaMistVariant(source: string) { return source; }`
);

write(
  'apps/scout_ui/src/shaders/tidecrest-hero/tidecrestDocument.js',
  `export function buildTidecrestDocument(_variant) { return ""; }`
);

write(
  'apps/scout_ui/src/shaders/meridian-landing-page/meridianDocument.js',
  `export function buildMeridianDocument(_variant, _presentation) { return ""; }`
);

write(
  'apps/scout_ui/src/shaders/ascii-field/asciiFieldDocuments.js',
  `export function buildAsciiFieldDocument(_variant) { return ""; }`
);

write(
  'apps/scout_ui/src/shaders/betawise-globe/betawiseGlobeDocument.js',
  `export function buildBetawiseGlobeDocument(_variant) { return ""; }`
);

write(
  'apps/scout_ui/src/shaders/nocturne-hero/NocturneScene.ts',
  `export const NOCTURNE_VARIANTS = ["midnight", "dawn", "dusk", "eclipse"] as const;
export type NocturneVariant = (typeof NOCTURNE_VARIANTS)[number];
export const NOCTURNE_TITLES: Record<NocturneVariant, string> = {
  midnight: "Nocturne",
  dawn: "Nocturne",
  dusk: "Nocturne",
  eclipse: "Nocturne",
};
export function buildNocturneDocument(_variant: string) { return ""; }`
);

write('apps/scout_ui/src/shaders/sylva-living-world/sources/inner-green-3d.html', '');
write('apps/scout_ui/src/shaders/axonis-field/axonis-arbor.html', '');
write('apps/scout_ui/src/shaders/axonis-field/axonis-vortex.html', '');
write('apps/scout_ui/src/shaders/axonis-field/axonis-tide.html', '');
write('apps/scout_ui/src/shaders/axonis-field/axonis-dune.html', '');

console.log('Stubs created successfully.');
