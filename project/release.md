# Release

## Preliminar release-definition
Projektet far kallas klart for v1 nar foljande ar uppfyllt:
- En fungerande bokwebb finns och fungerar end-to-end
- Startsida, om boken, kapiteloversikt och kapitelsidor ar sammanhangande och anvandbara
- Alla avsedda kapitel kan lasas online fran riktiga kallsfiler
- Hela boken kan laddas ned som PDF
- Designen ar responsiv, lasbar och tillrackligt mogen for publik anvandning
- Dokumentation for lokal korning, innehallsuppdatering och deploy finns
- Om publik release ar krav: publik URL ar i drift och verifierad mot karnfloden

## Gate fore implementation
Alla punkter nedan maste vara grona eller uttryckligen accepterade som externa blockerare:
- Produktens releaseform ar tydlig
- Innehallsunderlaget finns eller leveransplanen ar verifierad
- Publiceringsrattigheter ar tydliga
- Repo/remote-strategi ar klar om push/PR ska inga
- Deploy-plattform och eventuell doman ar klarlagda
- Nodvandiga credentials eller miljoer finns for autonom drift

## Nulagesbedomning
- Status: inte redo annu
- Skal:
  - Projektet saknar applikationskod och styrsystemet sattes precis upp
  - Ingen Git-remote ar verifierad
  - Ingen deploy-plattform ar verifierad
  - Inga riktiga innehallsfiler finns i arbetsmappen
  - Publiceringsrattigheter ar inte verifierade

## Vad som kravs for gront lage
- Svar pa de kritiska fragorna i [project/discovery.md](/Users/baltax/Documents/apps/App-Sodergran/project/discovery.md)
- Verifiering av innehall, deployvag och atkomster
- Uppdaterad releasechecklista efter anvandarens svar
