# Chapters

Lägg varje kapitel i en egen Markdown-fil, till exempel:

- `01-introduction.md`
- `02-bakgrund.md`
- `03-fortsaettning.md`

## Rekommenderat frontmatter
```md
---
title: "Kapitelrubrik"
slug: "kapitelrubrik"
order: 1
excerpt: "Kort ingress för kapitelöversikten."
published: true
---
```

## Regler
- Frontmatter är valfritt för ren placeholder-utveckling, men rekommenderas för riktiga kapitel.
- Om `title` saknas använder pipelinen filnamnet som fallback.
- Om inga kapitel finns ska listningen vara tom och statusen bli placeholder.
