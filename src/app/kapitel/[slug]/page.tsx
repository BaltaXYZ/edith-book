import { Prose } from "@/components/prose";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  estimateReadingTime,
  formatChapterPosition,
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
  const [{ slug }, snapshot] = await Promise.all([params, getSnapshot()]);
  const { chapter, html, navigation } = await getChapterPageData(slug);
  const chapterIndex =
    snapshot.chapters.findIndex((item) => item.slug === chapter.slug) + 1;

  return (
    <main className="page-shell">
      <SiteHeader chapterCount={snapshot.chapters.length} />

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

      <section className="section">
        <div className="detail-grid">
          <div className="detail">
            <span className="eyebrow">Lasrytmen</span>
            <strong>{estimateReadingTime(chapter.body)}</strong>
            <p className="section-copy">
              Kapiteltexten lases direkt fran filsystemet och renderas till HTML
              vid byggning eller sidgenerering.
            </p>
          </div>
          <div className="detail">
            <span className="eyebrow">Kallfil</span>
            <strong>{chapter.relativePath}</strong>
            <p className="section-copy">
              Frontmatter styr titel, ordning, utdrag och slug for kapitelvyn.
            </p>
          </div>
          <div className="detail">
            <span className="eyebrow">Navigering</span>
            <strong>{navigation.next ? "Fortsatt lasa" : "Sista kapitlet"}</strong>
            <p className="section-copy">
              Anvand den nedre navigeringen for att ga vidare eller tillbaka i
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
              <span className="eyebrow">Foregaende</span>
              <strong>{navigation.previous.title}</strong>
            </a>
          ) : (
            <div className="panel chapter-nav__link chapter-nav__link--muted">
              <span className="eyebrow">Foregaende</span>
              <strong>Bokens borjan</strong>
            </div>
          )}

          {navigation.next ? (
            <a
              className="panel chapter-nav__link"
              href={`/kapitel/${navigation.next.slug}`}
            >
              <span className="eyebrow">Nasta</span>
              <strong>{navigation.next.title}</strong>
            </a>
          ) : (
            <div className="panel chapter-nav__link chapter-nav__link--muted">
              <span className="eyebrow">Nasta</span>
              <strong>Du har natt slutet</strong>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
