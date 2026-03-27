import Link from "next/link";
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
  getAudiobookTracks,
  getChapterForAudiobookTrack,
  getCoverImageUrl,
  getDownloadHref,
  getPrimaryDownload,
  getSnapshot,
} from "./site-data";

export default async function HomePage() {
  const [snapshot, audiobookManifest, audiobookTracks] = await Promise.all([
    getSnapshot(),
    getAudiobookManifest(),
    getAudiobookTracks(),
  ]);

  const primaryDownload = getPrimaryDownload(snapshot.metadata);
  const coverImageUrl = getCoverImageUrl(snapshot.assetStatus.entries);
  const availableAudiobookTracks = audiobookTracks.filter((track) => track.exists);
  const firstChapter = snapshot.chapters[0];
  const startReadingHref = firstChapter ? `/kapitel/${firstChapter.slug}` : "/om-boken";
  const primaryDownloadHref = primaryDownload ? getDownloadHref(primaryDownload) : undefined;

  return (
    <main className="page-shell">
      <SiteHeader chapterCount={snapshot.chapters.length} />

      <section className="hero">
        <div className="hero__content hero__panel">
          <span className="eyebrow">Digital bokupplaga</span>
          <h1 className="hero__title">{snapshot.metadata.title}</h1>
          <p className="hero__lede">
            {snapshot.metadata.description ??
              "En redaktionell webbplats for att lasa boken online i ett lugnt, boknara format."}
          </p>

          <div className="hero__actions">
            <a className="cta" href={startReadingHref}>
              Borja lasa online
            </a>
            {primaryDownloadHref ? (
              <a className="cta cta--secondary" download href={primaryDownloadHref}>
                Ladda ned som pdf
              </a>
            ) : null}
          </div>
        </div>

        <BookCover
          authorLabel="Edith Sodergran"
          imageUrl={coverImageUrl}
          subtitle={
            snapshot.metadata.subtitle ??
            "En biografi i digital bokdrakt med fokus pa lasupplevelse."
          }
          title={snapshot.metadata.title}
        />
      </section>

      <section className="section">
        <div className="portrait-feature panel">
          <div className="portrait-feature__image-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Edith Sodergran i en stilla lasstund"
              className="portrait-feature__image"
              src={getAssetHref("assets/edith-reading.png")}
            />
          </div>
          <div className="portrait-feature__copy">
            <span className="eyebrow">Edith Sodergran</span>
            <h2>En stilla bild mitt i bokens stora rorelse</h2>
            <p className="section-copy">
              Den har upplagan ror sig mellan dikt, sjukdom, modernism och
              eftermale. Pa forstasidan far den ocksa ett lugnare anslag: Edith
              som lasande gestalt, snarare an bara litterar symbol.
            </p>
            <Link className="site-header__link" href="/om-boken">
              Las om hur boken blev till
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section__heading">
          <div>
            <span className="eyebrow">Kapitel</span>
            <h2>Las boken online</h2>
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
            body="Lagg in markdown-filer i content/book/chapters for att fylla bokhyllan med riktiga kapitel. Sajten ar redan forberedd for strukturen."
            title="Kapitelvyn ar redo for innehall"
          />
        )}
      </section>

      <section className="section">
        <div className="section__heading">
          <div>
            <span className="eyebrow">Ljudbok</span>
            <h2>Lyssna i samma redaktionella rytm</h2>
          </div>
          <Link className="site-header__link" href="/ljudbok">
            Oppna ljudboken
          </Link>
        </div>

        {availableAudiobookTracks.length > 0 ? (
          <div className="audiobook-teaser panel">
            <div className="audiobook-teaser__copy">
              <p className="section-copy">
                {snapshot.metadata.audiobook?.intro ??
                  "Varje kapitel finns som ett eget ljudspår sa att du enkelt kan fortsatta dar du slutade eller vaxla mellan lasning och lyssning."}
              </p>
              <div className="audiobook-teaser__stats">
                <div>
                  <span className="eyebrow">Spår</span>
                  <strong>{audiobookManifest?.trackCount ?? availableAudiobookTracks.length}</strong>
                </div>
                <div>
                  <span className="eyebrow">Total speltid</span>
                  <strong>
                    {audiobookManifest?.totalDurationLabel ??
                      formatAudiobookTrackDuration(
                        availableAudiobookTracks.reduce(
                          (sum, track) => sum + track.durationSeconds,
                          0,
                        ),
                      )}
                  </strong>
                </div>
                <div>
                  <span className="eyebrow">Rost</span>
                  <strong>{audiobookManifest?.voice ?? snapshot.metadata.audiobook?.voice ?? "Alva"}</strong>
                </div>
              </div>
            </div>

            <AudiobookPlayer
              description="Starta direkt med inledningen eller ga vidare till den fulla ljudboksvyn."
              title="Provlyssna"
              tracks={availableAudiobookTracks.slice(0, 3).map((track) => {
                const chapter = getChapterForAudiobookTrack(snapshot.chapters, track);
                return {
                  audioSrc: getAssetHref(track.path),
                  durationLabel: track.durationLabel,
                  durationSeconds: track.durationSeconds,
                  href: chapter ? `/kapitel/${chapter.slug}` : "/ljudbok",
                  slug: track.slug,
                  summary: chapter?.summary ?? chapter?.excerpt,
                  title: track.title,
                };
              })}
              variant="compact"
            />
          </div>
        ) : (
          <EmptyState
            body="Ljudspår kan genereras lokalt från kapitelmaterialet och kommer sedan att dyka upp här som en lyssningsklar ljudbok."
            title="Ljudboksspåret är förberett"
          />
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
