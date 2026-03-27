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

## Ooppnade testfragor
- Om e2e-ramverk ska anvandas eller om manuell + skriptad smoke-test racker
- Om visual regression behovs for den redaktionella layouten
