import fs from "fs";
import path from "path";
import { extractHeadings, parseFrontmatter, stripFirstTitle } from "./markdown";

const lessonsDirectory = path.join(process.cwd(), "content", "lessons");
const sourcesPath = path.join(process.cwd(), "data", "sources.md");

export type Lesson = {
  lesson: number;
  slug: string;
  title: string;
  category: string;
  sources: string[];
  body: string;
  headings: ReturnType<typeof extractHeadings>;
};

export type SourceLink = {
  title: string;
  url?: string;
};

export function getLessons(): Lesson[] {
  return fs
    .readdirSync(lessonsDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => getLessonFromFile(file))
    .sort((a, b) => a.lesson - b.lesson);
}

export function getLessonBySlug(slug: string) {
  return getLessons().find((lesson) => lesson.slug === slug);
}

export function getLessonNeighbors(slug: string) {
  const lessons = getLessons();
  const index = lessons.findIndex((lesson) => lesson.slug === slug);

  return {
    previous: index > 0 ? lessons[index - 1] : undefined,
    next: index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : undefined
  };
}

export function getSourceLinks(sourceNames: string[]): SourceLink[] {
  const sourceMap = parseSourcesFile();

  return sourceNames.map((title) => ({
    title,
    url: sourceMap.get(title)
  }));
}

function getLessonFromFile(file: string): Lesson {
  const raw = fs.readFileSync(path.join(lessonsDirectory, file), "utf8");
  const { meta, body } = parseFrontmatter(raw);
  const lessonBody = stripFirstTitle(body, meta.title);

  return {
    ...meta,
    body: lessonBody,
    headings: extractHeadings(lessonBody)
  };
}

function parseSourcesFile() {
  const map = new Map<string, string>();

  if (!fs.existsSync(sourcesPath)) {
    return map;
  }

  const content = fs.readFileSync(sourcesPath, "utf8");
  const blocks = content.split(/\r?\n(?=###\s+)/);

  for (const block of blocks) {
    const title = block.match(/^###\s+(.+)$/m)?.[1]?.trim();
    const url = block.match(/^URL:\s+(.+)$/m)?.[1]?.trim();

    if (title && url) {
      map.set(title, url);
    }
  }

  return map;
}
