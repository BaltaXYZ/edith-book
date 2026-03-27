import { AudiobookPlayer } from "@/components/audiobook-player";
import { EmptyState } from "@/components/empty-state";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  formatAudiobookTrackDuration,
  getAssetHref,
  getAudiobookManifest,
  getAudiobookStatus,
  getAudiobookTracks,
  getChapterForAudiobookTrack,
  getSnapshot,
} from "../site-data";

export default async function AudiobookPage() {
  const [snapshot, status, manifest, tracks] = await Promise.all([
    getSnapshot(),
    getAudiobookStatus(),
    getAudiobookManifest(),
    getAudiobookTracks(),
  ]);

  const availableTracks = tracks.filter((track) => track.exists);

  return (
    <main className="page-shell">
      <SiteHeader chapterCount={snapshot.chapters.length} />

      <section className="page-intro">
        <span className="eyebrow">Ljudbok</span>
        <h1 className="page-title">Lyssna kapitel for kapitel</h1>
        <p className="section-copy">
          {snapshot.metadata.audiobook?.description ??
            "En sammanhallen ljudboksvy med kapitelvis upplasning, tydlig spellista och varm svensk rost."}
        </p>
      </section>

      <section className="section">
        <div className="detail-grid">
          <div className="detail">
            <span className="eyebrow">Status</span>
            <strong>{status.state}</strong>
            <p className="section-copy">
              {status.state === "ready"
                ? "Alla kapitelspår finns pa plats och ar redo att lyssnas pa."
                : "Ljudboken ar under uppbyggnad och visar bara de spår som redan finns."}
            </p>
          </div>
          <div className="detail">
            <span className="eyebrow">Spår</span>
            <strong>{manifest?.trackCount ?? availableTracks.length}</strong>
            <p className="section-copy">
              Ett ljudspår per kapitel ger tydlig navigering och enkel fortsättning.
            </p>
          </div>
          <div className="detail">
            <span className="eyebrow">Speltid</span>
            <strong>
              {manifest?.totalDurationLabel ??
                formatAudiobookTrackDuration(
                  availableTracks.reduce(
                    (sum, track) => sum + track.durationSeconds,
                    0,
                  ),
                )}
            </strong>
            <p className="section-copy">
              Upplasningen ar genererad med den svenska rosten {manifest?.voice ?? snapshot.metadata.audiobook?.voice ?? "Alva"}.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        {availableTracks.length > 0 ? (
          <AudiobookPlayer
            description={snapshot.metadata.audiobook?.intro}
            title={snapshot.metadata.audiobook?.label ?? "Ljudbok"}
            tracks={availableTracks.map((track) => {
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
            variant="full"
          />
        ) : (
          <EmptyState
            body="Kör ljudgenereringen med `pnpm audiobook:generate` for att fylla den har sidan med verkliga kapitelspår."
            title="Ljudboken väntar på sina spår"
          />
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
