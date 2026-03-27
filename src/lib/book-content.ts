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
  coverImage: string;
  pdf: string;
}

export interface BookMetadata {
  id: string;
  title: string;
  subtitle?: string;
  language: string;
  status: string;
  description?: string;
  paths: BookPathConfig;
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
    coverImage: "assets/cover.jpg",
    pdf: "downloads/edith-sodergran-biografi.pdf",
  };

  const paths = isObject(raw?.paths) ? raw?.paths : {};
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
      coverImage: toStringOr(paths.coverImage, fallbackPaths.coverImage),
      pdf: toStringOr(paths.pdf, fallbackPaths.pdf),
    },
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
      const baseSlug = slugify(path.basename(sourcePath, path.extname(sourcePath)));
      const title = toStringOr(parsed.frontmatter.title, baseSlug.replace(/-/g, " "));
      const slug = slugify(toStringOr(parsed.frontmatter.slug, baseSlug || title));
      const order = toNumberOr(parsed.frontmatter.order, Number.MAX_SAFE_INTEGER);
      const published = toBooleanOr(parsed.frontmatter.published, true) && !toBooleanOr(parsed.frontmatter.hidden, false);

      return {
        slug,
        title,
        order,
        excerpt: typeof parsed.frontmatter.excerpt === "string" ? parsed.frontmatter.excerpt : undefined,
        summary: typeof parsed.frontmatter.summary === "string" ? parsed.frontmatter.summary : undefined,
        frontmatter: parsed.frontmatter as ChapterFrontmatter,
        body: parsed.body.trim(),
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
