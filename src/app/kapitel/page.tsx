import { ChapterCard } from "@/components/chapter-card";
import { EmptyState } from "@/components/empty-state";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { estimateReadingTime, getSnapshot } from "../site-data";

export default async function ChaptersPage() {
  const snapshot = await getSnapshot();

  return (
    <main className="page-shell">
      <SiteHeader chapterCount={snapshot.chapters.length} />

      <section className="page-intro">
        <span className="eyebrow">Kapiteloversikt</span>
        <h1 className="page-title">Las online</h1>
        <p className="section-copy">
          Varje kapitel renderas fran en egen markdown-fil och far en tydlig
          plats i bokens helhet.
        </p>
      </section>

      <section className="section">
        {snapshot.chapters.length > 0 ? (
          <div className="chapter-grid">
            {snapshot.chapters.map((chapter, index) => (
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
            body="Lagg in markdown-filer i content/book/chapters med frontmatter for titel, slug och ordning. Da fylls denna oversikt automatiskt."
            title="Inga kapitel ar inkopplade an"
          />
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
