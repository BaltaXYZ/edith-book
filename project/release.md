# Release

## Preliminar release-definition
Projektet far kallas klart for v1 nar foljande ar uppfyllt:
- En fungerande bokwebb finns och fungerar end-to-end
- Startsida, om boken, kapiteloversikt och kapitelsidor ar sammanhangande och anvandbara
- Alla avsedda kapitel kan lasas online fran riktiga kallsfiler
- Hela boken kan laddas ned som PDF
- Designen ar responsiv, lasbar och tillrackligt mogen for publik anvandning
- Dokumentation for lokal korning, innehallsuppdatering och deploy finns
- Om staging eller deploy ingar i iterationen: miljo ar verifierad mot karnfloden

## Gate fore implementation
Alla punkter nedan maste vara grona eller uttryckligen accepterade som externa blockerare:
- Produktens releaseform ar tydlig
- Innehallsunderlaget finns eller leveransplanen ar verifierad
- Publiceringsrattigheter ar tydliga
- Repo/remote-strategi ar klar om push/PR ska inga
- Deploystrategin ar klarlagd for den miljo som ingar i v1
- Nodvandiga credentials eller miljoer finns for de steg som faktiskt ska genomforas i v1

## Nulagesbedomning
- Status: redo att implementera med dokumenterade externa blockerare
- Skal:
  - V1 ar tydligt definierad som lokal/staging-klar boksite
  - Publiceringsrattigheter ar klarerade genom anvandarens besked
  - Appskalet, innehallspipelinen och filserveringen ar implementerade
  - Lokal verifiering med lint, typecheck, build och HTTP-svar ar genomford
  - Ingen Git-remote ar verifierad i arbetsmappen annu
  - Ingen faktisk deployatkomst ar verifierad annu
  - Inga riktiga innehallsfiler finns i arbetsmappen

## Vad som kravs for gront lage
- Inkoppling av riktiga innehallsfiler
- Verifierad remote om push ska genomforas
- Verifierad deployatkomst om stagingdeploy ska genomforas

## Aktuell releasebedomning
Projektet ar lokalt verifierat och deployklart i struktur, men inte slutklart for v1 eftersom de verkliga bokfilerna fortfarande saknas i projektet.
