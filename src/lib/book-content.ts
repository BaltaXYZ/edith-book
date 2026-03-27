import { promises as fs } from "node:fs";
import path from "node:path";

export type BookContentState = "placeholder" | "partial" | "ready";
export type AssetKind = "cover" | "pdf" | "download" | "asset";

export interface BookDownload {
  label: string;
  type: string;
  path: string;
}

export interface BookPathConfig {
  chaptersDir: string;
  assetsDir: string;
  downloadsDir: string;
  audioDir: string;
  coverImage: string;
  pdf: string;
}

export interface AudiobookConfig {
  label: string;
  description?: string;
  intro?: string;
  voice: string;
  rate: number;
  format: string;
  bitrateKbps: number;
  channels: number;
  manifest: string;
  tracksDir: string;
}

export interface AudiobookManifestTrack {
  slug: string;
  title: string;
  order: number;
  path: string;
  sourcePath: string;
  durationSeconds: number;
  durationLabel: string;
  wordCount: number;
  textHash: string;
  voice: string;
  rate: number;
  format: string;
  bitrateKbps: number;
  channels: number;
}

export interface AudiobookManifest {
  version: number;
  generatedAt: string;
  voice: string;
  rate: number;
  format: string;
  bitrateKbps: number;
  channels: number;
  trackCount: number;
  totalDurationSeconds: number;
  totalDurationLabel: string;
  totalWordCount: number;
  tracks: AudiobookManifestTrack[];
}

export type AudiobookState = BookContentState;

export interface AudiobookTrack extends AudiobookManifestTrack {
  exists: boolean;
}

export interface AudiobookAssetStatus {
  state: AudiobookState;
  manifestPath: string;
  manifestExists: boolean;
  missingTracks: AudiobookTrack[];
  tracks: AudiobookTrack[];
}

export interface BookMetadata {
  id: string;
  title: string;
  subtitle?: string;
  language: string;
  status: string;
  description?: string;
  paths: BookPathConfig;
  audiobook?: AudiobookConfig;
  downloads: BookDownload[];
  notes?: string[];
}

export interface ChapterFrontmatter {
  title?: string;
  slug?: string;
  order?: number;
  excerpt?: string;
  summary?: string;
  published?: boolean;
  hidden?: boolean;
  [key: string]: unknown;
}

export interface ChapterRecord {
  slug: string;
  title: string;
  order: number;
  excerpt?: string;
  summary?: string;
  frontmatter: ChapterFrontmatter;
  body: string;
  sourcePath: string;
  relativePath: string;
  published: boolean;
}

export interface ChapterSummary {
  slug: string;
  title: string;
  order: number;
  excerpt?: string;
  summary?: string;
  relativePath: string;
}

export interface ChapterNavigation {
  previous?: ChapterSummary;
  next?: ChapterSummary;
}

export interface AssetStatusEntry {
  kind: AssetKind;
  label: string;
  path: string;
  exists: boolean;
  required: boolean;
}

export interface AssetStatusReport {
  state: BookContentState;
  entries: AssetStatusEntry[];
  missingRequired: AssetStatusEntry[];
}

export interface BookSnapshot {
  metadata: BookMetadata;
  chapters: ChapterRecord[];
  assetStatus: AssetStatusReport;
  state: BookContentState;
}

export const DEFAULT_BOOK_ROOT = path.join(process.cwd(), "content", "book");

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toStringOr(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function toNumberOr(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function toBooleanOr(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function cleanFrontmatterValue(raw: string): unknown {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed;
    }
  }
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (!Number.isNaN(Number(trimmed)) && trimmed !== "") return Number(trimmed);
  const quoted = trimmed.match(/^(['"])(.*)\1$/);
  return quoted ? quoted[2] : trimmed;
}

function parseMarkdownFrontmatter(source: string): { frontmatter: Record<string, unknown>; body: string } {
  if (!source.startsWith("---\n")) {
    return { frontmatter: {}, body: source };
  }

  const endIndex = source.indexOf("\n---\n", 4);
  if (endIndex === -1) {
    return { frontmatter: {}, body: source };
  }

  const rawFrontmatter = source.slice(4, endIndex);
  const body = source.slice(endIndex + 5);
  const frontmatter: Record<string, unknown> = {};

  for (const line of rawFrontmatter.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf(":");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (!key) continue;
    frontmatter[key] = cleanFrontmatterValue(value);
  }

  return { frontmatter, body };
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function extractOrderFromFilename(fileName: string): number | null {
  const match = path.basename(fileName).match(/^(\d+)[-_]/);
  if (!match) return null;

  return Number.parseInt(match[1], 10) + 1;
}

function stripOrderPrefix(fileName: string): string {
  return path.basename(fileName, path.extname(fileName)).replace(/^\d+[-_]?/, "");
}

function stripChapterPrefix(title: string): string {
  return title
    .replace(/^kapitel\s+\d+\.\s*/i, "")
    .replace(/^kapitel\s+\d+:\s*/i, "")
    .trim();
}

function extractHeadingAndBody(markdown: string): { heading?: string; body: string } {
  const trimmed = markdown.trim();
  const headingMatch = trimmed.match(/^#\s+(.+?)\n+([\s\S]*)$/);

  if (!headingMatch) {
    return { body: trimmed };
  }

  return {
    heading: headingMatch[1].trim(),
    body: headingMatch[2].trim(),
  };
}

function stripMarkdownForExcerpt(value: string): string {
  return value
    .replace(/!\[[^\]]*]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/[*_`>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateText(value: string, maxLength = 240): string {
  if (value.length <= maxLength) return value;

  const truncated = value.slice(0, maxLength).trimEnd();
  const safeCut = truncated.lastIndexOf(" ");
  return `${(safeCut > 80 ? truncated.slice(0, safeCut) : truncated).trimEnd()}...`;
}

function inferExcerpt(markdown: string): string | undefined {
  const paragraphs = markdown
    .split(/\n\s*\n/)
    .map((paragraph) => stripMarkdownForExcerpt(paragraph))
    .filter(Boolean);

  return paragraphs[0] ? truncateText(paragraphs[0]) : undefined;
}

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function walkMarkdownFiles(rootDir: string): Promise<string[]> {
  if (!(await fileExists(rootDir))) return [];

  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  const results: string[] = [];

  for (const entry of entries) {
    const absolutePath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await walkMarkdownFiles(absolutePath)));
      continue;
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith(".md") && entry.name.toLowerCase() !== "readme.md") {
      results.push(absolutePath);
    }
  }

  return results;
}

function normalizeMetadata(raw: Record<string, unknown> | null): BookMetadata {
  const fallbackPaths: BookPathConfig = {
    chaptersDir: "chapters",
    assetsDir: "assets",
    downloadsDir: "downloads",
    audioDir: "audio",
    coverImage: "assets/cover.jpg",
    pdf: "downloads/edith-sodergran-biografi.pdf",
  };

  const paths = isObject(raw?.paths) ? raw?.paths : {};
  const audiobook = isObject(raw?.audiobook) ? raw?.audiobook : {};
  const downloads = Array.isArray(raw?.downloads) ? raw.downloads.filter(isObject) : [];

  return {
    id: toStringOr(raw?.id, "edith-sodergran-biografi-online"),
    title: toStringOr(raw?.title, "Edith Södergran – biografi online"),
    subtitle: typeof raw?.subtitle === "string" ? raw.subtitle : undefined,
    language: toStringOr(raw?.language, "sv"),
    status: toStringOr(raw?.status, "placeholder"),
    description: typeof raw?.description === "string" ? raw.description : undefined,
    paths: {
      chaptersDir: toStringOr(paths.chaptersDir, fallbackPaths.chaptersDir),
      assetsDir: toStringOr(paths.assetsDir, fallbackPaths.assetsDir),
      downloadsDir: toStringOr(paths.downloadsDir, fallbackPaths.downloadsDir),
      audioDir: toStringOr(paths.audioDir, fallbackPaths.audioDir),
      coverImage: toStringOr(paths.coverImage, fallbackPaths.coverImage),
      pdf: toStringOr(paths.pdf, fallbackPaths.pdf),
    },
    audiobook: isObject(raw?.audiobook)
      ? {
          label: toStringOr(audiobook.label, "Ljudbok"),
          description: typeof audiobook.description === "string" ? audiobook.description : undefined,
          voice: toStringOr(audiobook.voice, "Alva"),
          rate: toNumberOr(audiobook.rate, 165),
          format: toStringOr(audiobook.format, "m4a"),
          bitrateKbps: toNumberOr(audiobook.bitrateKbps, 32),
          channels: toNumberOr(audiobook.channels, 1),
          manifest: toStringOr(audiobook.manifest, "audio/manifest.json"),
          tracksDir: toStringOr(audiobook.tracksDir, "audio/tracks"),
        }
      : undefined,
    downloads: downloads.map((download) => ({
      label: toStringOr(download.label, "Nedladdning"),
      type: toStringOr(download.type, "file"),
      path: toStringOr(download.path, ""),
    })).filter((download) => Boolean(download.path)),
    notes: Array.isArray(raw?.notes) ? raw.notes.filter((note): note is string => typeof note === "string") : undefined,
  };
}

export async function loadBookMetadata(bookRoot = DEFAULT_BOOK_ROOT): Promise<BookMetadata> {
  const metadataPath = path.join(bookRoot, "metadata.json");
  const raw = await readJsonFile<Record<string, unknown>>(metadataPath);
  return normalizeMetadata(raw);
}

function formatDuration(durationSeconds: number): string {
  const totalSeconds = Math.max(0, Math.round(durationSeconds));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export async function listChapterFiles(bookRoot = DEFAULT_BOOK_ROOT): Promise<string[]> {
  const metadata = await loadBookMetadata(bookRoot);
  const chaptersRoot = path.join(bookRoot, metadata.paths.chaptersDir);
  return walkMarkdownFiles(chaptersRoot);
}

export async function listChapters(bookRoot = DEFAULT_BOOK_ROOT): Promise<ChapterRecord[]> {
  const metadata = await loadBookMetadata(bookRoot);
  const chapterFiles = await listChapterFiles(bookRoot);

  const chapters = await Promise.all(
    chapterFiles.map(async (sourcePath) => {
      const markdown = await fs.readFile(sourcePath, "utf8");
      const parsed = parseMarkdownFrontmatter(markdown);
      const relativePath = path.relative(bookRoot, sourcePath).replace(/\\/g, "/");
      const fileName = path.basename(sourcePath);
      const inferredOrder = extractOrderFromFilename(fileName);
      const baseSlug = slugify(stripOrderPrefix(fileName));
      const { heading, body } = extractHeadingAndBody(parsed.body);
      const inferredTitle = heading
        ? stripChapterPrefix(heading)
        : stripOrderPrefix(fileName).replace(/-/g, " ");
      const title = toStringOr(parsed.frontmatter.title, inferredTitle);
      const slug = slugify(toStringOr(parsed.frontmatter.slug, baseSlug || title));
      const order = toNumberOr(
        parsed.frontmatter.order,
        inferredOrder ?? Number.MAX_SAFE_INTEGER,
      );
      const published = toBooleanOr(parsed.frontmatter.published, true) && !toBooleanOr(parsed.frontmatter.hidden, false);
      const excerpt =
        typeof parsed.frontmatter.excerpt === "string"
          ? parsed.frontmatter.excerpt
          : inferExcerpt(body);
      const summary =
        typeof parsed.frontmatter.summary === "string"
          ? parsed.frontmatter.summary
          : excerpt;

      return {
        slug,
        title,
        order,
        excerpt,
        summary,
        frontmatter: parsed.frontmatter as ChapterFrontmatter,
        body,
        sourcePath,
        relativePath,
        published,
      } satisfies ChapterRecord;
    }),
  );

  const visibleChapters = chapters.filter((chapter) => chapter.published || metadata.status === "placeholder");

  return visibleChapters.sort((left, right) => {
    if (left.order !== right.order) return left.order - right.order;
    return left.title.localeCompare(right.title, "sv");
  });
}

export function toChapterSummary(chapter: ChapterRecord): ChapterSummary {
  return {
    slug: chapter.slug,
    title: chapter.title,
    order: chapter.order,
    excerpt: chapter.excerpt,
    summary: chapter.summary,
    relativePath: chapter.relativePath,
  };
}

export function getChapterNavigation(chapters: ChapterRecord[], currentSlug: string): ChapterNavigation {
  const index = chapters.findIndex((chapter) => chapter.slug === currentSlug);
  if (index === -1) return {};

  return {
    previous: index > 0 ? toChapterSummary(chapters[index - 1]) : undefined,
    next: index < chapters.length - 1 ? toChapterSummary(chapters[index + 1]) : undefined,
  };
}

export async function loadChapterBySlug(slug: string, bookRoot = DEFAULT_BOOK_ROOT): Promise<ChapterRecord | null> {
  const chapters = await listChapters(bookRoot);
  return chapters.find((chapter) => chapter.slug === slug) ?? null;
}

export async function inspectBookAssets(bookRoot = DEFAULT_BOOK_ROOT): Promise<AssetStatusReport> {
  const metadata = await loadBookMetadata(bookRoot);
  const entries: AssetStatusEntry[] = [];

  const coverPath = path.join(bookRoot, metadata.paths.coverImage);
  entries.push({
    kind: "cover",
    label: "Omslagsbild",
    path: metadata.paths.coverImage,
    exists: await fileExists(coverPath),
    required: true,
  });

  const pdfPath = path.join(bookRoot, metadata.paths.pdf);
  entries.push({
    kind: "pdf",
    label: "Hela boken som PDF",
    path: metadata.paths.pdf,
    exists: await fileExists(pdfPath),
    required: true,
  });

  for (const download of metadata.downloads) {
    const downloadPath = path.join(bookRoot, download.path);
    entries.push({
      kind: download.type === "pdf" ? "pdf" : "download",
      label: download.label,
      path: download.path,
      exists: await fileExists(downloadPath),
      required: false,
    });
  }

  const missingRequired = entries.filter((entry) => entry.required && !entry.exists);
  const hasAnyExistingAsset = entries.some((entry) => entry.exists);
  const state: BookContentState =
    missingRequired.length === 0 ? (hasAnyExistingAsset ? "ready" : "placeholder") : hasAnyExistingAsset ? "partial" : "placeholder";

  return { state, entries, missingRequired };
}

export async function loadBookSnapshot(bookRoot = DEFAULT_BOOK_ROOT): Promise<BookSnapshot> {
  const metadata = await loadBookMetadata(bookRoot);
  const chapters = await listChapters(bookRoot);
  const assetStatus = await inspectBookAssets(bookRoot);
  const state: BookContentState =
    chapters.length === 0 ? (assetStatus.entries.some((entry) => entry.exists) ? "partial" : "placeholder") : assetStatus.missingRequired.length === 0 ? "ready" : "partial";

  return {
    metadata,
    chapters,
    assetStatus,
    state,
  };
}

export async function getBookNavigation(currentSlug: string, bookRoot = DEFAULT_BOOK_ROOT): Promise<ChapterNavigation> {
  const chapters = await listChapters(bookRoot);
  return getChapterNavigation(chapters, currentSlug);
}

export async function getBookContentState(bookRoot = DEFAULT_BOOK_ROOT): Promise<BookContentState> {
  const snapshot = await loadBookSnapshot(bookRoot);
  return snapshot.state;
}

export async function loadAudiobookManifest(bookRoot = DEFAULT_BOOK_ROOT): Promise<AudiobookManifest | null> {
  const metadata = await loadBookMetadata(bookRoot);
  const manifestPath = path.join(bookRoot, metadata.audiobook?.manifest ?? "audio/manifest.json");
  const raw = await readJsonFile<AudiobookManifest>(manifestPath);
  return raw;
}

export async function listAudiobookTracks(bookRoot = DEFAULT_BOOK_ROOT): Promise<AudiobookTrack[]> {
  const manifest = await loadAudiobookManifest(bookRoot);
  if (!manifest) {
    return [];
  }

  return Promise.all(
    manifest.tracks.map(async (track) => {
      const absolutePath = path.join(bookRoot, track.path);
      return {
        ...track,
        exists: await fileExists(absolutePath),
      } satisfies AudiobookTrack;
    }),
  );
}

export async function inspectAudiobookAssets(bookRoot = DEFAULT_BOOK_ROOT): Promise<AudiobookAssetStatus> {
  const metadata = await loadBookMetadata(bookRoot);
  const manifestPath = path.join(bookRoot, metadata.audiobook?.manifest ?? "audio/manifest.json");
  const manifestExists = await fileExists(manifestPath);
  const tracks = await listAudiobookTracks(bookRoot);
  const missingTracks = tracks.filter((track) => !track.exists);
  const state: AudiobookState =
    manifestExists && missingTracks.length === 0 && tracks.length > 0
      ? "ready"
      : manifestExists && tracks.length > 0
        ? "partial"
        : "placeholder";

  return {
    state,
    manifestPath: metadata.audiobook?.manifest ?? "audio/manifest.json",
    manifestExists,
    missingTracks,
    tracks,
  };
}

export function formatAudiobookDuration(seconds: number): string {
  return formatDuration(seconds);
}
