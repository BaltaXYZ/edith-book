# Content Book

Detta är den filbaserade innehållskällan för bokprojektet.

## Struktur
- `metadata.json` innehåller bokmetadata, sökvägar och nedladdningar
- `chapters/` innehåller kapitel som markdown-filer med frontmatter
- `assets/` innehåller omslag och övriga bildfiler
- `downloads/` innehåller PDF och andra nedladdningsbara filer
- `audio/` innehåller genererade ljudfiler och manifest för ljudboken

## Regler
- Innehållspipelinen ska fungera även när inga kapitel ännu finns.
- Om kapitel saknas ska koden rapportera placeholder-läge i stället för att låtsas att boken är komplett.
- Alla kapitel bör använda frontmatter för titel, ordning och slug.

## Förväntat arbetssätt
Lägg in riktiga filer här när de är tillgängliga och låt applikationens serverkod läsa dem via `src/lib/book-content.ts`.

## Ljudbok
Generera kapitelvisa ljudfiler med:

```bash
pnpm audiobook:generate
```

Detta skapar `content/book/audio/manifest.json` och AAC-filer i `content/book/audio/tracks/`.
Anvand `pnpm audiobook:generate:force` om alla spår ska genereras om från grunden.
