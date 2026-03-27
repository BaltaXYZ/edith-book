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
- Status: klar for v1
- Skal:
  - V1 ar implementerad med verkligt bokinnehall
  - Publiceringsrattigheter ar klarerade genom anvandarens besked
  - Appskalet, innehallspipelinen och filserveringen ar implementerade
  - Lokal verifiering med lint, typecheck, build och HTTP-svar ar genomford
  - GitHub-remote ar verifierad och `main` ar pushad
  - Vercel-projektet ar lankt och deployment ar markerad `READY`

## Vad som kravs for gront lage
- Inget ytterligare kravs for v1 enligt nuvarande releaseform.

## Aktuell releasebedomning
Projektet uppfyller v1-definitionen. Det har en fungerande lokal buildkedja, riktiga kapitel och PDF, GitHub-remote och en fungerande Vercel-deploy.

## Verifierade adresser
- GitHub: `https://github.com/BaltaXYZ/edith-book`
- Vercel alias: `https://edith-book.vercel.app`
- Vercel deployment: `https://edith-book-a1fff7jqc-baltaxyzs-projects.vercel.app`
