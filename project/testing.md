# Testing

## Mal
Verifiera att sajten fungerar tekniskt, innehallsmassigt och upplevelsemassigt for verklig publik anvandning.

## Testnivaer
- Statisk kontroll: lint, typecheck och bygg
- Funktionskontroll: navigation, kapitelrendering, nedladdningar och felhantering
- Innehallskontroll: inga brutna lankar, inga saknade filer, korrekt metadata
- UX-kontroll: lasbarhet, responsivitet, typografisk rytm och tydlig navigation
- Publik kontroll: samma karnfloden verifieras i den riktiga deployade miljoen om publik release ingar

## Minimibevis for release
- Bygget passerar i ren miljo
- Alla kapitel kan oppnas utan renderingsfel
- PDF-nedladdning fungerar
- Start- och kapitelnavigering fungerar pa mobil och desktop
- Metadata och sidtitlar ar satta

## Senaste verifiering
- `pnpm lint`: passerar
- `pnpm typecheck`: passerar
- `pnpm build`: passerar
- Lokal HTTP-kontroll: `200 OK` for `/`, `/kapitel` och `/ladda-ner`
- Lokal HTTP-kontroll: `200 OK` for `/kapitel/inledande-oversikt`
- Lokal HTTP-kontroll: `200 OK` och `application/pdf` for `/filer/downloads/edith-sodergran-bok-modern.pdf`
- Riktiga kapitelrutter genereras vid build, totalt 12 kapitel
- GitHub-push genomford till `origin/main`
- Vercel-deploy genomford och markerad `READY`

## Ooppnade testfragor
- Om e2e-ramverk ska anvandas eller om manuell + skriptad smoke-test racker
- Om visual regression behovs for den redaktionella layouten
