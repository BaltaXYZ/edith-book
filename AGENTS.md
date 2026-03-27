# AGENTS.md

## Syfte
Detta projekt bygger en publik, bokliknande webbplats for "Edith Sodergran – biografi online". Teamet ska arbeta som ett sjalvstyrande appteam med en orkestrator och tydliga specialistroller.

## Permanenta projektregler
- Orkestratorn ager helheten: discovery, scope, UX, implementation, test, release och blockerare.
- Inga produktfeatures far byggas innan discovery-gaten ar passerad och dokumenterad i [project/release.md](/Users/baltax/Documents/apps/App-Sodergran/project/release.md).
- Alla storre antaganden ska dokumenteras i [project/assumptions.md](/Users/baltax/Documents/apps/App-Sodergran/project/assumptions.md) och/eller [project/decisions.md](/Users/baltax/Documents/apps/App-Sodergran/project/decisions.md).
- Alla blockerare som hindrar full release ska foras i [project/blockers.md](/Users/baltax/Documents/apps/App-Sodergran/project/blockers.md).
- Discovery ska alltid sortera fragor i tre grupper: maste besvaras av anvandaren nu, rimliga standardantaganden, och kan skjutas till senare iteration.
- Fragor till anvandaren ska endast stallas nar fel antagande riskerar att styra produkt, driftform, datamodell, sakerhet eller releasefel.
- Release far inte kallas klar om publik deploy, datalagring eller andra krav enligt discovery fortfarande ar overifierade.
- Om appen ska vara publik ar lokal demo inte tillrackligt; den publika miljoen ska verifieras mot karnfloden.
- Om appen ska bygga pa externt innehall far teamet inte simulera "klart" utan att riktiga innehallsfiler och publiceringsrattigheter ar verifierade.
- Varje iteration ska ha ett tydligt "klart"-kriterium, verifiering och dokumenterad status.

## Standardantaganden tills annat ar verifierat
- Version 1 ar en publik, innehallsdriven webbplats utan konto, auth eller databas.
- Svenska ar huvudsprak i forsta releasen.
- Kapitel renderas fran markdown-filer, och hela boken laddas ned som PDF.
- Innehall ska kunna uppdateras filbaserat utan CMS i forsta skedet.

## Arbetsordning
1. Las appide och inventera kodbas, miljo och atkomster.
2. Uppdatera discovery, antaganden, blockerare och releaseberedskap.
3. Stoppa implementation om avgorande osakerhet eller externa beroenden kvarstar.
4. Nar gaten ar gron: bygg en sammanhangande iteration i taget.
5. Testa funktionellt, tekniskt och UX-massigt innan iterationen markeras klar.
6. Committa och pusha lopande nar verifierad iteration ar sammanhangande och remote finns.

## Definition av misslyckad gate
Projektet ar inte redo for implementation om nagon av foljande punkter ar oppen:
- driftform eller releasekrav ar otydliga
- kritiska innehallsfiler saknas
- publika rattigheter ar oklara
- repo/remote/deployvag som behovs for malet saknas
- nojdvandiga credentials eller miljoer inte gar att anvanda autonomt
