# Decisions

## D-001: Arbetsmodell
- Status: beslutad
- Beslut: Projektet styrs av en orkestrator med specialistroller for discovery, innehall, design/frontend och release/QA.
- Skal: Uppdraget kraver helhetsansvar, verifiering och fortlopande omprioritering.

## D-002: Grundprodukt
- Status: beslutad
- Beslut: Bygg som en innehallsdriven bokwebb utan databas eller auth i v1, med lokal/staging som krav och publik release som senare mojlighet.
- Skal: Appiden beskriver lasning och nedladdning av statiskt bokinnehall snarare an anvandargenererad data.

## D-003: Innehallskalla
- Status: beslutad
- Beslut: Kallmaterialet modelleras som markdown-kapitel, PDF och bildassets som laggs in i projektet.
- Risk: Innehallsfilerna finns inte i projektmappen annu, sa implementationen maste vara robust for inkoppling senare.

## D-004: Deploymal
- Status: beslutad
- Beslut: GitHub ar canonical remote. V1 behover endast vara lokal/staging-klar. Vercel ar foredragen deployplattform nar deploy blir aktuell.
- Uppfoljning: Remote ar nu verifierad och projektet ar deployat via Vercel.

## D-005: Publikt scope
- Status: beslutad
- Beslut: Process-/AI-/agentmaterial ska inte visas publikt i v1.
- Skal: Fokus ska ligga pa boken och lasupplevelsen.

## D-006: Verkligt innehall och releasekanal
- Status: beslutad
- Beslut: PDF, omslag och tolv markdown-kapitel ar inkopplade i projektet. GitHub-repot ar `BaltaXYZ/edith-book` och Vercel-projektet ar `edith-book`.
- Skal: Detta ar de verifierade externa slutpunkterna som nu bar v1.
