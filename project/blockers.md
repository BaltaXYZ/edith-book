# Blockers

## Oppna blockerare

### B-001: Faktiska innehallsfiler saknas i projektet
- Status: oppen
- Allvar: kritisk
- Effekt: Vi kan inte slutverifiera verkliga las- och downloadfloden utan PDF, markdown-kapitel och relevanta assets.

### B-002: Deployatkomst for staging ar inte verifierad
- Status: oppen
- Allvar: medel
- Effekt: Appen kan byggas deployklar, men stagingdeploy kan inte verifieras fullt ut forran atkomst finns.

### B-003: Remote-flode ar inte etablerat i arbetsmappen
- Status: oppen
- Allvar: medel
- Effekt: Lokal Git finns nu, men kravet pa lopande push/PR kan inte uppfyllas fullt ut utan remote-strategi.

### B-004: Faktiskt innehall maste fortfarande levereras in i forvantad struktur
- Status: oppen
- Allvar: hog
- Effekt: Vi kan bygga sajt och pipeline nu, men inte slutverifiera verkligt bokinnehall forran filerna finns i projektet.
