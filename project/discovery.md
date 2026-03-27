# Discovery

## Produktsammanfattning
Appen ar en publik, innehallsdriven bokwebb for en fullangdsbiografi om Edith Sodergran. Den ska kombinera bokpresentation, online-lasning och nedladdning i ett redaktionellt, boknara format.

## Karnmal
- Ge en elegant, tydlig och lattlast webbupplevelse for boken
- Lata anvandaren lasa kapitel online direkt fran markdown-filer
- Lata anvandaren ladda ned hela boken som PDF
- Ge boken en professionell publik narvaro pa webben

## Trolig informationsarkitektur
- Start
- Om boken
- Kapiteloversikt
- En sida per kapitel
- Nedladdningar
- Eventuell process-/metodsida

## Fragor som maste besvaras av anvandaren nu
- Ar publik deploy ett uttryckligt krav for denna release, eller racker lokal/staging tills vidare?
- Var finns de faktiska innehallsfilerna som appen ska bygga pa: PDF, markdown-kapitel, omslagsbild och ovriga assets?
- Ar allt material godkant for publik publicering och nedladdning?
- Vilken deploy-plattform och eventuell doman ska anvandas for produktion?
- Ska process-/AI-/agentmaterial visas publikt, och i sa fall vilken niva av transparens ar avsedd?

## Fragor som kan losas med rimliga standardantaganden
- Ingen databas i v1
- Ingen auth eller inloggning i v1
- Ingen synk mellan enheter behovs
- Svenska ar huvudsprak i v1
- Ett kapitel motsvarar en sida
- Filbaserad innehallspipeline utan CMS i v1
- SEO, metadata och grundlaggande tillganglighet ingar

## Fragor som kan skjutas till senare iteration
- Sokfunktion i boken
- Kapitelankare pa avsnittsniva
- EPUB eller andra filformat
- Statistik och analys
- Fordjupad process-/metodsida
- Lararmaterial, tidslinje eller extra essamaterial

## Discovery-gate
Implementation far starta forst nar foljande ar sant:
- releaseformen ar tydlig
- innehallsunderlaget finns tillgangligt
- publiceringsrattigheter ar tydliga
- deployvag ar vald och verifierbar
- externa blockerare ar dokumenterade och minimerade
