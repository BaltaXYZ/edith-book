import path from "node:path";
import { notFound } from "next/navigation";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";
import type {
  AssetStatusEntry,
  AudiobookAssetStatus,
  AudiobookManifest,
  AudiobookTrack,
  BookDownload,
  BookMetadata,
  BookSnapshot,
  ChapterRecord,
  ChapterSummary,
} from "@/lib/book-content";
import {
  getBookNavigation,
  loadBookSnapshot,
  loadChapterBySlug,
  inspectAudiobookAssets,
  loadAudiobookManifest,
  listAudiobookTracks,
  formatAudiobookDuration,
  toChapterSummary,
} from "@/lib/book-content";

export async function getSnapshot(): Promise<BookSnapshot> {
  return loadBookSnapshot();
}

export async function getPublishedChapterSummaries(): Promise<ChapterSummary[]> {
  const snapshot = await getSnapshot();
  return snapshot.chapters.map(toChapterSummary);
}

export async function getChapterPageData(slug: string): Promise<{
  chapter: ChapterRecord;
  html: string;
  navigation: Awaited<ReturnType<typeof getBookNavigation>>;
}> {
  const chapter = await loadChapterBySlug(slug);
  if (!chapter) {
    notFound();
  }

  const html = await renderMarkdown(chapter.body);
  const navigation = await getBookNavigation(chapter.slug);

  return { chapter, html, navigation };
}

export async function renderMarkdown(markdown: string): Promise<string> {
  const file = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "append",
      properties: {
        ariaLabel: "Lanka till rubrik",
        className: ["heading-anchor"],
      },
      content: {
        type: "text",
        value: " #",
      },
    })
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}

export function estimateReadingTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min läsning`;
}

export function getAssetHref(relativePath: string): string {
  const normalized = relativePath.replace(/^\/+/, "");
  return `/filer/${normalized}`;
}

export function getDownloadHref(download: BookDownload): string {
  return getAssetHref(download.path);
}

export function getPrimaryDownload(metadata: BookMetadata): BookDownload | undefined {
  return metadata.downloads[0];
}

export function getAssetEntry(
  entries: AssetStatusEntry[],
  kind: AssetStatusEntry["kind"],
): AssetStatusEntry | undefined {
  return entries.find((entry) => entry.kind === kind);
}

export function getStatusText(state: BookSnapshot["state"]): string {
  if (state === "ready") return "Innehållet är kopplat och klart att läsa.";
  if (state === "partial") {
    return "Delar av boken är inkopplade, men vissa filer saknas fortfarande.";
  }

  return "Sajten är förberedd för innehåll, men väntar ännu på kapitel, PDF och omslag.";
}

export function getDownloadStateText(entry?: AssetStatusEntry): string {
  if (!entry) return "Ingen nedladdning är definierad ännu.";
  return entry.exists
    ? "Filen finns i innehållsmappen och kan laddas ned direkt."
    : `Lägg filen i content/book/${entry.path} för att aktivera nedladdningen.`;
}

export function getCoverImageUrl(entries: AssetStatusEntry[]): string | null {
  const cover = getAssetEntry(entries, "cover");
  return cover?.exists ? getAssetHref(cover.path) : null;
}

export function formatChapterPosition(index: number, total: number): string {
  return `Kapitel ${index} av ${total}`;
}

export function resolveBookFilePath(relativePath: string): string {
  return path.resolve(process.cwd(), "content", "book", relativePath);
}

export async function getAudiobookManifest(): Promise<AudiobookManifest | null> {
  return loadAudiobookManifest();
}

export async function getAudiobookTracks(): Promise<AudiobookTrack[]> {
  return listAudiobookTracks();
}

export async function getAudiobookStatus(): Promise<AudiobookAssetStatus> {
  return inspectAudiobookAssets();
}

export function formatAudiobookTrackDuration(seconds: number): string {
  return formatAudiobookDuration(seconds);
}

export function getAudiobookTrackBySlug(
  tracks: AudiobookTrack[],
  slug: string,
): AudiobookTrack | null {
  return tracks.find((track) => track.slug === slug) ?? null;
}

export function getChapterForAudiobookTrack(
  chapters: ChapterRecord[],
  track: AudiobookTrack,
): ChapterRecord | null {
  return (
    chapters.find(
      (chapter) =>
        chapter.relativePath === track.sourcePath || chapter.slug === track.slug,
    ) ?? null
  );
}

export function getAudiobookTrackForChapter(
  chapter: ChapterRecord,
  tracks: AudiobookTrack[],
): AudiobookTrack | null {
  return (
    tracks.find(
      (track) =>
        track.sourcePath === chapter.relativePath || track.slug === chapter.slug,
    ) ?? null
  );
}
