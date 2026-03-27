# Decisions

## D-001: Arbetsmodell
- Status: beslutad
- Beslut: Projektet styrs av en orkestrator med specialistroller for discovery, innehall, design/frontend och release/QA.
- Skal: Uppdraget kraver helhetsansvar, verifiering och fortlopande omprioritering.

## D-002: Grundprodukt
- Status: preliminart antagande
- Beslut: Bygg som en publik, innehallsdriven bokwebb utan databas eller auth i v1.
- Skal: Appiden beskriver lasning och nedladdning av statiskt bokinnehall snarare an anvandargenererad data.
- Oppet for omprovning om discovery visar att publik release, innehallshantering eller andra krav motiverar annan arkitektur.

## D-003: Innehallskalla
- Status: oppen
- Beslut: Ej faststallt. Forvantad kallform ar markdown-kapitel, PDF och bildassets.
- Risk: Innehallsfilerna finns inte i projektmappen annu.

## D-004: Deploymal
- Status: oppen
- Beslut: Ej faststallt.
- Risk: Full release kan inte verifieras utan vald plattform, URL och atkomst.
