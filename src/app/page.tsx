import Link from "next/link";
import { AudiobookPlayer } from "@/components/audiobook-player";
import { BookCover } from "@/components/book-cover";
import { ChapterCard } from "@/components/chapter-card";
import { DownloadCard } from "@/components/download-card";
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
  getDownloadStateText,
  getPrimaryDownload,
  getSnapshot,
  getStatusText,
} from "./site-data";

export default async function HomePage() {
  const [snapshot, audiobookManifest, audiobookTracks] = await Promise.all([
    getSnapshot(),
    getAudiobookManifest(),
    getAudiobookTracks(),
  ]);
  const primaryDownload = getPrimaryDownload(snapshot.metadata);
  const primaryPdfEntry = snapshot.assetStatus.entries.find(
    (entry) => entry.kind === "pdf" && entry.path === primaryDownload?.path,
  );
  const coverImageUrl = getCoverImageUrl(snapshot.assetStatus.entries);
  const availableAudiobookTracks = audiobookTracks.filter((track) => track.exists);

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
            <Link className="cta" href="/kapitel">
              Borja lasa online
            </Link>
            <Link className="cta cta--secondary" href="/om-boken">
              Om boken
            </Link>
          </div>

          <div className="stat-grid">
            <div className="stat">
              <span className="eyebrow">Status</span>
              <strong>{snapshot.state}</strong>
              <p className="section-copy">{getStatusText(snapshot.state)}</p>
            </div>
            <div className="stat">
              <span className="eyebrow">Kapitel</span>
              <strong>{snapshot.chapters.length}</strong>
              <p className="section-copy">
                Varje kapitel renderas direkt fran markdown-filer i projektet.
              </p>
            </div>
            <div className="stat">
              <span className="eyebrow">Nedladdning</span>
              <strong>{primaryPdfEntry?.exists ? "PDF aktiv" : "PDF saknas"}</strong>
              <p className="section-copy">
                {getDownloadStateText(primaryPdfEntry)}
              </p>
            </div>
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
        <div className="section__heading">
          <div>
            <span className="eyebrow">Om upplagan</span>
            <h2>En boksite byggd for langlasning</h2>
          </div>
          <Link className="site-header__link" href="/om-boken">
            Las mer om upplagg
          </Link>
        </div>

        <div className="detail-grid">
          <div className="detail">
            <span className="eyebrow">Las online</span>
            <strong>Kapitel for kapitel</strong>
            <p className="section-copy">
              Tydlig navigation, lugn typografi och en layout som fungerar for
              mobil, surfplatta och desktop.
            </p>
          </div>
          <div className="detail">
            <span className="eyebrow">Ladda ner</span>
            <strong>Filbaserad PDF</strong>
            <p className="section-copy">
              Hela boken kan ligga som en separat fil i innehallsmappen och
              serveras utan extra backend.
            </p>
          </div>
          <div className="detail">
            <span className="eyebrow">Underhall</span>
            <strong>Markdown som kallformat</strong>
            <p className="section-copy">
              Nya kapitel eller revideringar kan laggas in utan att appens
              struktur behover byggas om.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section__heading">
          <div>
            <span className="eyebrow">Kapitel</span>
            <h2>Las boken online</h2>
          </div>
          <Link className="site-header__link" href="/kapitel">
            Visa alla kapitel
          </Link>
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

      <section className="section">
        <div className="section__heading">
          <div>
            <span className="eyebrow">Nedladdningar</span>
            <h2>Bokfiler och material</h2>
          </div>
          <Link className="site-header__link" href="/ladda-ner">
            Gå till nedladdningar
          </Link>
        </div>

        <div className="download-grid">
          <DownloadCard
            href={
              primaryPdfEntry?.exists && primaryDownload
                ? getDownloadHref(primaryDownload)
                : undefined
            }
            label="Huvudfil"
            state={getDownloadStateText(primaryPdfEntry)}
            title={primaryDownload?.label ?? "Hela boken som PDF"}
          />
          <DownloadCard
            label="Innehall"
            state="Omslag och eventuella extrafiler serveras fran samma innehallsstruktur nar de laggs in."
            title="Assets och bilagor"
          />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
