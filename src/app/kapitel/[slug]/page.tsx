import { AudiobookPlayer } from "@/components/audiobook-player";
import { Prose } from "@/components/prose";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  estimateReadingTime,
  formatChapterPosition,
  getAssetHref,
  getAudiobookTrackForChapter,
  getAudiobookTracks,
  getChapterPageData,
  getPublishedChapterSummaries,
  getSnapshot,
} from "../../site-data";

type ChapterPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const chapters = await getPublishedChapterSummaries();
  return chapters.map((chapter) => ({ slug: chapter.slug }));
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const [{ slug }, snapshot, audiobookTracks] = await Promise.all([
    params,
    getSnapshot(),
    getAudiobookTracks(),
  ]);
  const { chapter, html, navigation } = await getChapterPageData(slug);
  const chapterIndex =
    snapshot.chapters.findIndex((item) => item.slug === chapter.slug) + 1;
  const currentAudiobookTrack = getAudiobookTrackForChapter(chapter, audiobookTracks);
  const availableAudiobookTracks = audiobookTracks.filter((track) => track.exists);

  return (
    <main className="page-shell">
      <SiteHeader />

      <section className="page-intro">
        <span className="eyebrow">
          {formatChapterPosition(chapterIndex, snapshot.chapters.length)}
        </span>
        <h1 className="page-title">{chapter.title}</h1>
        <p className="section-copy">
          {chapter.excerpt ?? chapter.summary ?? estimateReadingTime(chapter.body)}
        </p>
      </section>

      <section className="section">
        <article className="panel">
          <Prose>
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </Prose>
        </article>
      </section>

      {currentAudiobookTrack?.exists ? (
        <section className="section">
          <AudiobookPlayer
            description="Lyssna på det här kapitlet direkt eller öppna hela ljudboken för att hoppa mellan spår."
            initialSlug={currentAudiobookTrack.slug}
            title={`Lyssna på ${chapter.title}`}
            tracks={availableAudiobookTracks.map((track) => {
              const linkedChapter = snapshot.chapters.find(
                (item) =>
                  item.relativePath === track.sourcePath || item.slug === track.slug,
              );
              return {
                audioSrc: getAssetHref(track.path),
                durationLabel: track.durationLabel,
                durationSeconds: track.durationSeconds,
                href: linkedChapter ? `/kapitel/${linkedChapter.slug}` : "/#ljudbok",
                slug: track.slug,
                summary: linkedChapter?.summary ?? linkedChapter?.excerpt,
                title: track.title,
              };
            })}
            variant="compact"
          />
        </section>
      ) : null}

      <section className="section">
        <div className="detail-grid">
          <div className="detail">
            <span className="eyebrow">Läsrytmen</span>
            <strong>{estimateReadingTime(chapter.body)}</strong>
            <p className="section-copy">
              Kapiteltexten läses direkt från filsystemet och renderas till HTML
              vid byggning eller sidgenerering.
            </p>
          </div>
          <div className="detail">
            <span className="eyebrow">Källfil</span>
            <strong>{chapter.relativePath}</strong>
            <p className="section-copy">
              Frontmatter styr titel, ordning, utdrag och slug för kapitelvyn.
            </p>
          </div>
          <div className="detail">
            <span className="eyebrow">Navigering</span>
            <strong>{navigation.next ? "Fortsätt läsa" : "Sista kapitlet"}</strong>
            <p className="section-copy">
              Använd den nedre navigeringen för att gå vidare eller tillbaka i
              boken.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="chapter-nav">
          {navigation.previous ? (
            <a
              className="panel chapter-nav__link"
              href={`/kapitel/${navigation.previous.slug}`}
            >
              <span className="eyebrow">Föregående</span>
              <strong>{navigation.previous.title}</strong>
            </a>
          ) : (
            <div className="panel chapter-nav__link chapter-nav__link--muted">
              <span className="eyebrow">Föregående</span>
              <strong>Bokens början</strong>
            </div>
          )}

          {navigation.next ? (
            <a
              className="panel chapter-nav__link"
              href={`/kapitel/${navigation.next.slug}`}
            >
              <span className="eyebrow">Nästa</span>
              <strong>{navigation.next.title}</strong>
            </a>
          ) : (
            <div className="panel chapter-nav__link chapter-nav__link--muted">
              <span className="eyebrow">Nästa</span>
              <strong>Du har nått slutet</strong>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
