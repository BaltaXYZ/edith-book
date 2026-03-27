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
- Inga oppna maste-fragor kvar just nu.

## Bekraftade svar fran anvandaren
- Lokal eller staging racker for v1; publik release ar inte krav nu
- GitHub ar canonical remote
- Vercel ar foredragen deployplattform om deploy blir aktuell
- Materialet far antas vara godkant for publik visning och nedladdning
- Process-/AI-/agentmaterial ska inte visas publikt i v1
- Kallmaterialet finns som PDF, markdown och ovriga assets som ska laggas in i projektet

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
- innehallsunderlaget finns tillgangligt eller sa finns en tydlig struktur for att koppla in det utan omarbete
- publiceringsrattigheter ar tydliga
- deployvag ar vald och verifierbar i den miljo som ingar i v1
- externa blockerare ar dokumenterade och minimerade

## Status
Discovery-gaten ar passerad. Produkt, innehall, remote och deployvag ar verifierade for v1.
