import type { Heading } from "@/lib/markdown";

type TableOfContentsProps = {
  headings: Heading[];
};

export function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="toc" aria-label="目次">
      <p className="section-label">目次</p>
      <ol>
        {headings.map((heading) => (
          <li key={`${heading.id}-${heading.text}`} className={heading.level === 3 ? "toc-child" : undefined}>
            <a href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
