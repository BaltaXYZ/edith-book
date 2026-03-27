# Ljudbok

Genererade ljudfiler lagras här.

## Struktur
- `manifest.json` beskriver spår, durations och text-hashar
- `tracks/` innehåller kapitelvisa `m4a`-filer

## Generering
Kör `pnpm audiobook:generate` för att skapa eller uppdatera ljudfilerna.

Ljudet genereras lokalt med macOS-rösten `Alva` via `say`, konverteras till AAC med `afconvert` och mäts med `afinfo`.
