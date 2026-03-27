import { AudiobookPlayer } from "@/components/audiobook-player";
import { BookCover } from "@/components/book-cover";
import { ChapterCard } from "@/components/chapter-card";
import { EmptyState } from "@/components/empty-state";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  estimateReadingTime,
  formatAudiobookTrackDuration,
  getAssetHref,
  getAudiobookManifest,
  getAudiobookStatus,
  getAudiobookTracks,
  getChapterForAudiobookTrack,
  getCoverImageUrl,
  getDownloadHref,
  getPrimaryDownload,
  getSnapshot,
} from "./site-data";

export default async function HomePage() {
  const [snapshot, audiobookStatus, audiobookManifest, audiobookTracks] =
    await Promise.all([
      getSnapshot(),
      getAudiobookStatus(),
      getAudiobookManifest(),
      getAudiobookTracks(),
    ]);

  const primaryDownload = getPrimaryDownload(snapshot.metadata);
  const coverImageUrl = getCoverImageUrl(snapshot.assetStatus.entries);
  const availableAudiobookTracks = audiobookTracks.filter((track) => track.exists);
  const firstChapter = snapshot.chapters[0];
  const audiobookStatusLabel =
    audiobookStatus.state === "ready"
      ? "Klar"
      : audiobookStatus.state === "partial"
        ? "Delvis klar"
        : "Under uppbyggnad";
  const startReadingHref = firstChapter
    ? `/kapitel/${firstChapter.slug}`
    : "#om-boken";
  const primaryDownloadHref = primaryDownload
    ? getDownloadHref(primaryDownload)
    : undefined;

  return (
    <main className="page-shell">
      <SiteHeader />

      <section className="hero">
        <div className="hero__content hero__panel">
          <span className="eyebrow">Digital bokupplaga</span>
          <h1 className="hero__title">{snapshot.metadata.title}</h1>
          <p className="hero__lede">
            {snapshot.metadata.description ??
              "En redaktionell webbplats för att läsa boken online i ett lugnt, boknära format."}
          </p>

          <div className="hero__actions">
            <a className="cta" href={startReadingHref}>
              Börja läsa online
            </a>
            {primaryDownloadHref ? (
              <a className="cta cta--secondary" download href={primaryDownloadHref}>
                Ladda ned som PDF
              </a>
            ) : null}
            <a className="cta cta--secondary" href="#ljudbok">
              Till ljudboken
            </a>
            <a className="cta cta--secondary" href="#om-boken">
              Till om boken
            </a>
          </div>
        </div>

        <BookCover
          authorLabel="Edith Södergran"
          imageUrl={coverImageUrl}
          subtitle={
            snapshot.metadata.subtitle ??
            "En biografi i digital bokdräkt med fokus på läsupplevelse."
          }
          title={snapshot.metadata.title}
        />
      </section>

      <section className="section">
        <div className="portrait-feature panel">
          <div className="portrait-feature__image-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Edith Södergran i en stilla lässtund"
              className="portrait-feature__image"
              src={getAssetHref("assets/edith-reading.png")}
            />
          </div>
          <div className="portrait-feature__copy">
            <span className="eyebrow">Edith Södergran</span>
            <h2>En stilla bild mitt i bokens stora rörelse</h2>
            <p className="section-copy">
              Den här upplagan rör sig mellan dikt, sjukdom, modernism och
              eftermäle. På förstasidan får den också ett lugnare anslag: Edith
              som läsande gestalt, snarare än bara litterär symbol.
            </p>
            <a className="site-header__link" href="#om-boken">
              Läs om hur boken blev till
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section__heading">
          <div>
            <span className="eyebrow">Kapitel</span>
            <h2>Läs boken online</h2>
          </div>
        </div>

        {snapshot.chapters.length > 0 ? (
          <div className="chapter-grid">
            {snapshot.chapters.slice(0, 6).map((chapter, index) => (
              <ChapterCard
                key={chapter.slug}
                excerpt={chapter.excerpt ?? chapter.summary}
                href={`/kapitel/${chapter.slug}`}
                index={index + 1}
                readingTime={estimateReadingTime(chapter.body)}
                title={chapter.title}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            body="Lägg in markdown-filer i content/book/chapters för att fylla bokhyllan med riktiga kapitel."
            title="Kapitelvyn är redo för innehåll"
          />
        )}
      </section>

      <section className="section" id="ljudbok">
        <div className="page-intro page-intro--embedded">
          <span className="eyebrow">Ljudbok</span>
          <h2 className="page-title">Lyssna kapitel för kapitel</h2>
          <p className="section-copy">
            {snapshot.metadata.audiobook?.description ??
              "En sammanhållen ljudboksvy med kapitelvis uppläsning, tydlig spellista och varm svensk röst."}
          </p>
        </div>

        <div className="detail-grid">
          <div className="detail">
            <span className="eyebrow">Status</span>
            <strong>{audiobookStatusLabel}</strong>
            <p className="section-copy">
              {audiobookStatus.state === "ready"
                ? "Alla kapitelspår finns på plats och är redo att lyssnas på."
                : "Ljudboken är under uppbyggnad och visar bara de spår som redan finns."}
            </p>
          </div>
          <div className="detail">
            <span className="eyebrow">Spår</span>
            <strong>{audiobookManifest?.trackCount ?? availableAudiobookTracks.length}</strong>
            <p className="section-copy">
              Ett ljudspår per kapitel ger tydlig navigering och enkel fortsättning.
            </p>
          </div>
          <div className="detail">
            <span className="eyebrow">Speltid</span>
            <strong>
              {audiobookManifest?.totalDurationLabel ??
                formatAudiobookTrackDuration(
                  availableAudiobookTracks.reduce(
                    (sum, track) => sum + track.durationSeconds,
                    0,
                  ),
                )}
            </strong>
            <p className="section-copy">
              Uppläsningen är genererad med den svenska rösten{" "}
              {audiobookManifest?.voice ?? snapshot.metadata.audiobook?.voice ?? "Alva"}.
            </p>
          </div>
        </div>

        <div className="section">
          {availableAudiobookTracks.length > 0 ? (
            <AudiobookPlayer
              description={snapshot.metadata.audiobook?.intro}
              title={snapshot.metadata.audiobook?.label ?? "Ljudbok"}
              tracks={availableAudiobookTracks.map((track) => {
                const chapter = getChapterForAudiobookTrack(snapshot.chapters, track);
                return {
                  audioSrc: getAssetHref(track.path),
                  durationLabel: track.durationLabel,
                  durationSeconds: track.durationSeconds,
                  href: chapter ? `/kapitel/${chapter.slug}` : "#ljudbok",
                  slug: track.slug,
                  summary: chapter?.summary ?? chapter?.excerpt,
                  title: track.title,
                };
              })}
              variant="full"
            />
          ) : (
            <EmptyState
              body="Kör ljudgenereringen med `pnpm audiobook:generate` för att fylla den här sektionen med verkliga kapitelspår."
              title="Ljudboken väntar på sina spår"
            />
          )}
        </div>
      </section>

      <section className="section stack" id="om-boken">
        <div className="page-intro page-intro--embedded">
          <span className="eyebrow">Om boken</span>
          <h2 className="page-title">Hur boken blev till</h2>
          <p className="section-copy">
            Underlaget i bokprojektet Book-sodergran visar ett arbete som byggdes
            med ovanligt mycket disciplin och ovanligt lite tålamod med
            halvfärdiga lösningar.
          </p>
        </div>

        <div className="panel">
          <span className="eyebrow">Startskottet</span>
          <h2>Först kom styrsystemet, sedan prosan</h2>
          <p className="section-copy">
            Projektet började inte med ett romantiskt kast in i kapitel ett.
            Först sattes discovery, beslut, riskregister, leveransdefinition och
            arbetsregler på plats. Målbilden var tydlig redan tidigt: en
            fullängdsbiografi om Edith Södergran, omkring 55 000 till 70 000 ord,
            levererad som ett verkligt bokmanus i Markdown och DOCX.
          </p>
        </div>

        <div className="detail-grid">
          <div className="detail">
            <span className="eyebrow">Orkestratorn</span>
            <strong>Höll ihop allt</strong>
            <p className="section-copy">
              En huvudredaktör agerade grindvakt för hela kedjan och stoppade
              varje frestelse att kalla en snygg skiss för ett färdigt kapitel.
            </p>
          </div>
          <div className="detail">
            <span className="eyebrow">Specialisterna</span>
            <strong>Sju roller</strong>
            <p className="section-copy">
              Biografiforskare, faktagranskare, litteräranalytiker,
              strukturredaktör, stilredaktör och riskgranskare jobbade runt
              manuset som en liten, mycket petig redaktion.
            </p>
          </div>
          <div className="detail">
            <span className="eyebrow">Arbetstakten</span>
            <strong>Iteration för iteration</strong>
            <p className="section-copy">
              Kapitelplanen gick stegvis från översikt och tidiga år till sena
              verk och eftermäle, så att boken kunde byggas som helhet och inte
              som en rad ensamstående essäer.
            </p>
          </div>
        </div>

        <div className="panel">
          <span className="eyebrow">Verkstaden</span>
          <h2>En bokmaskin med fler bromsar än genvägar</h2>
          <p className="section-copy">
            Det mest underhållande i materialet är hur envist allt vägrar bli
            slarvigt. Fakta skulle spåras till källor. Citat skulle kontrolleras.
            Sjukdomsperspektivet fick inte tillåtas svälla ut och förklara hela
            personen. Myten kring Edith Södergran skulle inte få gå före människan.
          </p>
          <p className="section-copy">
            Samtidigt handlade arbetet inte bara om att vara korrekt. Kapitel
            skulle också ha rytm, öppningar, tyngdpunkt och ett avslut som drog
            läsaren vidare. Med andra ord: projektet betedde sig mindre som en
            anteckningshög och mer som en redaktion som vägrade släppa igenom
            något som inte bar sin egen vikt som bokprosa.
          </p>
          <p className="section-copy">
            Det är därför den färdiga boken känns så samlad. Under ytan finns en
            ganska arbetsglad liten armé av roller, checklistor, discovery-noter
            och kvalitetsgrindar. På ytan märks bara det viktigaste: att texten
            rör sig framåt med klarhet, nerv och respekt för sitt ämne.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
