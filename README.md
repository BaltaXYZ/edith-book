# Edith Sodergran – biografi online

En boknara Next.js-sajt for att presentera, lasa och ladda ned en biografi om Edith Sodergran. V1 ar byggd for lokal eller staging-klar leverans och ar forberedd for senare Vercel-deploy.

## Nuvarande status
- Appskalet ar implementerat och verifierat lokalt
- Innehallspipelinen ar filbaserad och kan lasa metadata, kapitel och nedladdningar
- Sajten fungerar i placeholder-lage tills riktiga filer laggs in
- Slutlig innehallsverifiering blockerar fortfarande full v1-status

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

## Innehallsstruktur
- `content/book/metadata.json`: bokmetadata och sokvagar
- `content/book/chapters/*.md`: kapitel med frontmatter
- `content/book/assets/*`: omslag och ovriga bilder
- `content/book/downloads/*`: PDF och andra nedladdningar

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
- `/ladda-ner`: nedladdningssida
- `/filer/[...slug]`: serverar PDF och assets direkt fran `content/book`

## Kanda blockerare
- Riktiga kapitel, PDF och omslag ar inte inlagda i projektet annu
- GitHub-remote ar inte kopplad i arbetsmappen
- Deployatkomst till Vercel ar inte verifierad i denna miljo
