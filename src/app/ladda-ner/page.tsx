import { DownloadCard } from "@/components/download-card";
import { EmptyState } from "@/components/empty-state";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  getDownloadHref,
  getDownloadStateText,
  getSnapshot,
} from "../site-data";

export default async function DownloadsPage() {
  const snapshot = await getSnapshot();
  const downloads = snapshot.metadata.downloads;

  return (
    <main className="page-shell">
      <SiteHeader chapterCount={snapshot.chapters.length} />

      <section className="page-intro">
        <span className="eyebrow">Nedladdningar</span>
        <h1 className="page-title">Bokfiler och bilagor</h1>
        <p className="section-copy">
          Har samlas hela boken som PDF och eventuella fler filer nar de finns i
          innehallsstrukturen.
        </p>
      </section>

      <section className="section">
        {downloads.length > 0 ? (
          <div className="download-grid">
            {downloads.map((download) => {
              const entry = snapshot.assetStatus.entries.find(
                (asset) => asset.path === download.path,
              );

              return (
                <DownloadCard
                  key={download.path}
                  href={entry?.exists ? getDownloadHref(download) : undefined}
                  label={download.type}
                  state={getDownloadStateText(entry)}
                  title={download.label}
                />
              );
            })}
          </div>
        ) : (
          <EmptyState
            body="Definiera nedladdningar i content/book/metadata.json for att visa dem har."
            title="Inga nedladdningar ar konfigurerade"
          />
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
