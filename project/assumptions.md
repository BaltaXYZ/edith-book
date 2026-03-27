# Assumptions

## Aktiva standardantaganden
- Appen ar en publik bokwebb, inte en generell utgivningsplattform.
- Version 1 byggs som en statisk eller nara statisk webbplats.
- Ingen databas, auth eller backendlogik kravs om inte senare discovery visar annat.
- Innehall kommer fran lokala filer: markdown, PDF och bildassets.
- Anvandarens viktigaste flode ar att upptacka boken, lasa online och ladda ned PDF.
- Svenska ar primart sprak i forsta releasen.
- Process-/agentinnehall ar internt och far inte exponeras publikt i v1.
- V1 behover vara lokal/staging-klar och deployklar, inte nödvändigtvis publik.

## Antaganden som maste verifieras senare
- Att kapitelmaterialet ar komplett och redo att publiceras
- Att alla faktiska assets laggs in i den forvantade projektstrukturen
- Att Vercel-atkomst finns om stagingdeploy ska genomforas senare
