#!/usr/bin/env node
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const ROOT = process.cwd();
const BOOK_ROOT = path.join(ROOT, "content", "book");
const DEFAULT_VOICE = "Alva";
const DEFAULT_RATE = 165;
const DEFAULT_FORMAT = "m4a";
const DEFAULT_BITRATE = 32;
const DEFAULT_CHANNELS = 1;
const TEMP_DIR = path.join(BOOK_ROOT, "audio", ".tmp");
const FORCE = process.argv.includes("--force");
const INSPECT_ONLY = process.argv.includes("--inspect");

function slugify(input) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function formatDuration(totalSeconds) {
  const rounded = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const seconds = rounded % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function stripMarkdown(value) {
  return value
    .replace(/^---\n[\s\S]*?\n---\n/, "")
    .replace(/^#\s+/gm, "")
    .replace(/!\[[^\]]*]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/[`*_>#]/g, "")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function parseFrontmatter(source) {
  if (!source.startsWith("---\n")) {
    return { frontmatter: {}, body: source };
  }
  const endIndex = source.indexOf("\n---\n", 4);
  if (endIndex === -1) {
    return { frontmatter: {}, body: source };
  }
  const rawFrontmatter = source.slice(4, endIndex);
  const body = source.slice(endIndex + 5);
  const frontmatter = {};
  for (const line of rawFrontmatter.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf(":");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (!key) continue;
    frontmatter[key] = value.replace(/^['"]|['"]$/g, "");
  }
  return { frontmatter, body };
}

function getVoiceLine(order, title) {
  return `Kapitel ${order}. ${title}.`;
}

function parseDurationFromAfinfo(output) {
  const match = output.match(/estimated duration:\s+([0-9]+(?:\.[0-9]+)?)/i);
  if (!match) return 0;
  return Number.parseFloat(match[1]);
}

async function readJson(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch {
    return null;
  }
}

async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function hashText(text) {
  return createHash("sha256")
    .update(text)
    .digest("hex");
}

function cleanNarrationText(markdown) {
  return stripMarkdown(markdown)
    .replace(/\n{2,}/g, "\n\n")
    .trim();
}

function deriveTitleFromMarkdown(fileName, markdown) {
  const { frontmatter, body } = parseFrontmatter(markdown);
  const headingMatch = body.trim().match(/^#\s+(.+?)\n/);
  const fallbackFromName = path.basename(fileName, path.extname(fileName)).replace(/^\d+[-_]?/, "").replace(/-/g, " ");
  const rawTitle = frontmatter.title || headingMatch?.[1] || fallbackFromName;
  return String(rawTitle).replace(/^Kapitel\s+\d+\.\s*/i, "").replace(/^Kapitel\s+\d+:\s*/i, "").trim();
}

function extractBodyWithoutFirstHeading(markdown) {
  const trimmed = markdown.trim();
  const headingMatch = trimmed.match(/^#\s+(.+?)\n+([\s\S]*)$/);
  return headingMatch ? headingMatch[2].trim() : trimmed;
}

function extractOrder(fileName, body) {
  const fileMatch = path.basename(fileName).match(/^(\d+)[-_]/);
  if (fileMatch) return Number.parseInt(fileMatch[1], 10) + 1;
  const bodyMatch = body.trim().match(/^#\s+Kapitel\s+(\d+)[.:]\s+/i);
  return bodyMatch ? Number.parseInt(bodyMatch[1], 10) : Number.MAX_SAFE_INTEGER;
}

async function runSay(inputFile, outputFile, voice, rate) {
  await execFileAsync("say", ["-v", voice, "-r", String(rate), "-f", inputFile, "-o", outputFile]);
}

async function runAfconvert(inputFile, outputFile, bitrateKbps, channels) {
  await execFileAsync("afconvert", [
    inputFile,
    outputFile,
    "-f",
    "m4af",
    "-d",
    "aac",
    "-c",
    String(channels),
    "-b",
    String(bitrateKbps * 1000),
    "-q",
    "127",
  ]);
}

async function readDuration(filePath) {
  const { stdout } = await execFileAsync("afinfo", [filePath], { maxBuffer: 10 * 1024 * 1024 });
  return parseDurationFromAfinfo(stdout);
}

async function main() {
  const metadata = await readJson(path.join(BOOK_ROOT, "metadata.json"));
  if (!metadata) {
    throw new Error("metadata.json saknas eller kan inte lasas.");
  }

  const audiobookConfig = metadata.audiobook || {};
  const voice = audiobookConfig.voice || DEFAULT_VOICE;
  const rate = Number(audiobookConfig.rate || DEFAULT_RATE);
  const format = audiobookConfig.format || DEFAULT_FORMAT;
  const bitrateKbps = Number(audiobookConfig.bitrateKbps || DEFAULT_BITRATE);
  const channels = Number(audiobookConfig.channels || DEFAULT_CHANNELS);
  const manifestRelativePath = audiobookConfig.manifest || "audio/manifest.json";
  const tracksRelativeDir = audiobookConfig.tracksDir || "audio/tracks";
  const tracksDir = path.join(BOOK_ROOT, tracksRelativeDir);
  const manifestPath = path.join(BOOK_ROOT, manifestRelativePath);

  await ensureDir(TEMP_DIR);
  await ensureDir(tracksDir);

  try {
    const chaptersDir = path.join(BOOK_ROOT, metadata.paths?.chaptersDir || "chapters");
    const chapterFiles = (await fs.readdir(chaptersDir))
      .filter((name) => name.toLowerCase().endsWith(".md") && name.toLowerCase() !== "readme.md")
      .sort((a, b) => a.localeCompare(b, "sv"));

    const existingManifest = (await readJson(manifestPath)) || null;
    const existingTracksBySlug = new Map((existingManifest?.tracks || []).map((track) => [track.slug, track]));

    const tracks = [];
    let totalDurationSeconds = 0;
    let totalWordCount = 0;

    for (const fileName of chapterFiles) {
      const sourcePath = path.join(chaptersDir, fileName);
      const markdown = await fs.readFile(sourcePath, "utf8");
      const parsed = parseFrontmatter(markdown);
      const title = deriveTitleFromMarkdown(fileName, markdown);
      const body = cleanNarrationText(extractBodyWithoutFirstHeading(parsed.body));
      const parsedOrder = Number(parsed.frontmatter.order);
      const chapterOrder = Number.isFinite(parsedOrder)
        ? parsedOrder
        : extractOrder(fileName, parsed.body);
      const slug = slugify(parsed.frontmatter.slug || title || path.basename(fileName, path.extname(fileName)));
      const narration = `${getVoiceLine(chapterOrder, title)}\n\n${body}\n`;
      const textHash = hashText(
        `${narration}\nvoice:${voice}\nrate:${rate}\nformat:${format}\nbitrate:${bitrateKbps}\nchannels:${channels}`,
      );
      const trackStem = `${String(chapterOrder).padStart(2, "0")}-${slug}`;
      const outName = `${trackStem}.${format}`;
      const outPath = path.join(tracksDir, outName);
      const relativeAudioPath = path.posix.join(tracksRelativeDir, outName);
    const existing = existingTracksBySlug.get(slug);

    const isUpToDate = !FORCE && existing && existing.textHash === textHash && (await fileExists(outPath));
    let durationSeconds = 0;
    let wordCount = body.split(/\s+/).filter(Boolean).length;
    if (INSPECT_ONLY) {
      tracks.push({
        slug,
        title,
        order: chapterOrder,
        path: relativeAudioPath,
        sourcePath: path.posix.join("chapters", fileName),
        durationSeconds: Number(existing?.durationSeconds || 0),
        durationLabel: formatDuration(Number(existing?.durationSeconds || 0)),
        wordCount,
        textHash,
        voice,
        rate,
        format,
        bitrateKbps,
        channels,
      });
      totalDurationSeconds += Number(existing?.durationSeconds || 0);
      totalWordCount += wordCount;
      console.log(
        JSON.stringify(
          {
            slug,
            title,
            order: chapterOrder,
            existingHash: existing?.textHash ?? null,
            currentHash: textHash,
            exists: await fileExists(outPath),
            upToDate: Boolean(isUpToDate),
          },
          null,
          2,
        ),
      );
      continue;
    }

    if (!isUpToDate) {
        const tempTextPath = path.join(TEMP_DIR, `${outName}.txt`);
        const tempAiffPath = path.join(TEMP_DIR, `${outName}.aiff`);
        await fs.writeFile(tempTextPath, narration, "utf8");
        await runSay(tempTextPath, tempAiffPath, voice, rate);
        await runAfconvert(tempAiffPath, outPath, bitrateKbps, channels);
        durationSeconds = await readDuration(outPath);
        await fs.rm(tempTextPath, { force: true });
        await fs.rm(tempAiffPath, { force: true });
      } else {
        durationSeconds = Number(existing.durationSeconds || 0);
        if (!durationSeconds) {
          durationSeconds = await readDuration(outPath);
        }
        if (!wordCount) {
          wordCount = Number(existing.wordCount || 0);
        }
      }

      const track = {
        slug,
        title,
        order: chapterOrder,
        path: relativeAudioPath,
        sourcePath: path.posix.join("chapters", fileName),
        durationSeconds,
        durationLabel: formatDuration(durationSeconds),
        wordCount,
        textHash,
        voice,
        rate,
        format,
        bitrateKbps,
        channels,
      };

      tracks.push(track);
      totalDurationSeconds += durationSeconds;
      totalWordCount += wordCount;
  }

  if (INSPECT_ONLY) {
    return;
  }

  tracks.sort((left, right) => left.order - right.order || left.title.localeCompare(right.title, "sv"));

    const manifest = {
      version: 1,
      generatedAt: new Date().toISOString(),
      voice,
      rate,
      format,
      bitrateKbps,
      channels,
      trackCount: tracks.length,
      totalDurationSeconds,
      totalDurationLabel: formatDuration(totalDurationSeconds),
      totalWordCount,
      tracks,
    };

    await writeJson(manifestPath, manifest);
    console.log(`Wrote ${tracks.length} audiobook tracks to ${tracksDir}`);
    console.log(`Manifest: ${manifestPath}`);
    console.log(`Total duration: ${manifest.totalDurationLabel}`);
  } finally {
    await fs.rm(TEMP_DIR, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error?.stack || error);
  process.exit(1);
});
