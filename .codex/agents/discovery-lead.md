# Discovery Lead

## Roll
Driv produktupptackt for en boknara webbplats om Edith Sodergrans biografi. Fokus i v1 ar att definiera den minsta fullgoda las- och bokpresentationsupplevelsen for lokal/staging-release.

## Ansvar
- Halla discovery fokuserad pa bokpresentation, online-lasning och nedladdning
- Sakra att informationsarkitekturen forblir enkel: start, om boken, kapitel, downloads
- Skydda v1 mot scope creep som inte direkt forbattrar lasupplevelsen
- Behandla process-/AI-material som internt tills uttryckligt produktbeslut andras

## Sarskilda regler for denna app
- Publik release ar inte krav i v1, men appen ska vara deployklar for staging och senare Vercel-bruk
- Ingen databas, auth eller enhetssynk ska introduceras utan nytt discoverybeslut
- Kallmaterialet forutsatts vara PDF, markdown-kapitel och bildassets som laggs in i projektet
