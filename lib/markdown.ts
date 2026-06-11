export type Heading = {
  id: string;
  text: string;
  level: number;
};

export type Frontmatter = {
  lesson: number;
  slug: string;
  title: string;
  category: string;
  sources: string[];
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseFrontmatter(raw: string): { meta: Frontmatter; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);

  if (!match) {
    throw new Error("Lesson markdown is missing frontmatter.");
  }

  const yaml = match[1].split(/\r?\n/);
  const meta: Partial<Frontmatter> = { sources: [] };

  for (let index = 0; index < yaml.length; index += 1) {
    const line = yaml[index];
    const keyValue = line.match(/^([a-zA-Z]+):\s*(.*)$/);

    if (!keyValue) {
      continue;
    }

    const [, key, rawValue] = keyValue;
    const value = rawValue.replace(/^["']|["']$/g, "");

    if (key === "sources") {
      const sources: string[] = [];
      let sourceIndex = index + 1;

      while (sourceIndex < yaml.length && /^\s+-\s+/.test(yaml[sourceIndex])) {
        sources.push(yaml[sourceIndex].replace(/^\s+-\s+/, "").replace(/^["']|["']$/g, ""));
        sourceIndex += 1;
      }

      meta.sources = sources;
      index = sourceIndex - 1;
      continue;
    }

    if (key === "lesson") {
      meta.lesson = Number(value);
    } else if (key === "slug" || key === "title" || key === "category") {
      meta[key] = value;
    }
  }

  if (!meta.lesson || !meta.slug || !meta.title || !meta.category) {
    throw new Error("Lesson frontmatter is incomplete.");
  }

  return {
    meta: meta as Frontmatter,
    body: match[2].trim()
  };
}

export function extractHeadings(markdown: string) {
  return markdown
    .split(/\r?\n/)
    .map((line) => line.match(/^(#{2,3})\s+(.+)$/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => ({
      id: slugify(match[2]),
      text: match[2],
      level: match[1].length
    }));
}

export function stripFirstTitle(markdown: string, title: string) {
  return markdown.replace(new RegExp(`^#\\s+${escapeRegExp(title)}\\s*\\r?\\n+`), "");
}

export function parseQuiz(content: string) {
  const question = content.match(/question:\s*"([^"]+)"/)?.[1] ?? "理解度チェック";
  const answer = Number(content.match(/answer:\s*(\d+)/)?.[1] ?? 0);
  const explanation = content.match(/explanation:\s*"([^"]+)"/)?.[1] ?? "";
  const optionsMatch = content.match(/options:\s*\r?\n([\s\S]*?)(?:\r?\n[a-z]+:|$)/);
  const options =
    optionsMatch?.[1]
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.startsWith("- "))
      .map((line) => line.replace(/^-\s+/, "").replace(/^["']|["']$/g, "")) ?? [];

  return { question, answer, explanation, options };
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
