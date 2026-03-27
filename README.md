# Edith Sodergran – biografi online

En boknara Next.js-sajt for att presentera, lasa och ladda ned en biografi om Edith Sodergran. V1 ar byggd for lokal eller staging-klar leverans och ar forberedd for senare Vercel-deploy.

## Nuvarande status
- Appskalet ar implementerat och verifierat med riktiga kapitel, omslag och PDF
- Innehallspipelinen ar filbaserad och lasa metadata, kapitel och nedladdningar direkt fran `content/book`
- Ljudboksdelen ar kapitelvis genererad som verkliga `m4a`-filer och integrerad i webbplatsen
- Koden ar pushad till GitHub-repot `BaltaXYZ/edith-book`
- Vercel-projektet ar lankt och en fungerande deployment finns pa `https://edith-book.vercel.app`

## Teknik
- Next.js 16
- React 19
- TypeScript
- pnpm
- Filbaserat innehall under `content/book`

## Kommandon
- `pnpm install`
- `pnpm dev`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- `pnpm audiobook:generate`
- `pnpm audiobook:inspect`

## Innehallsstruktur
- `content/book/metadata.json`: bokmetadata och sokvagar
- `content/book/chapters/*.md`: kapitel med frontmatter
- `content/book/assets/*`: omslag och ovriga bilder
- `content/book/downloads/*`: PDF och andra nedladdningar
- `content/book/audio/`: genererade ljudspår och manifest

## Ljudbok
- Ljudboken genereras lokalt med `say -v Alva`
- Ett ljudspår skapas per kapitel
- Output skrivs som `m4a` i `content/book/audio/tracks/`
- Manifest skrivs till `content/book/audio/manifest.json`
- Webbplatsen exponerar ljudet via `/ljudbok` och via en kompakt spelare pa respektive kapitelsida

## Regenerering
Kör:

```bash
pnpm audiobook:generate
```

Använd `pnpm audiobook:generate:force` om du vill tvinga omgenerering av alla spår.
Använd `pnpm audiobook:inspect` för att jämföra manifestets hashstatus mot dagens kapitelinnehåll utan att skapa nya filer.

## Forvantat kapitelupplagg
Varje kapitel kan ha frontmatter som detta:

```md
---
title: Kapitelrubrik
slug: kapitelrubrik
order: 1
excerpt: Kort ingress till kapitelvyn
summary: Kort sammanfattning
published: true
---

Själva kapiteltexten i markdown.
```

## Viktiga rutter
- `/`: startsida med bokpresentation, status, kapitel och nedladdningar
- `/om-boken`: redaktionell oversikt
- `/kapitel`: oversikt over kapitel
- `/kapitel/[slug]`: lasvy for ett kapitel
- `/ljudbok`: full ljudboksvy med spellista och spelare
- `/ladda-ner`: nedladdningssida
- `/filer/[...slug]`: serverar PDF, ljudfiler och assets direkt fran `content/book`

## Kanda blockerare
- Inga releaseblockerare oppna for v1
- Lokal miljo kor Node 25.5.0 medan projektet ar pinnat till Node 22 via `.nvmrc`
