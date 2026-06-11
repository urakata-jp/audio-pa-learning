import type { SourceLink } from "@/lib/lessons";

type RelatedLinksProps = {
  links: SourceLink[];
};

export function RelatedLinks({ links }: RelatedLinksProps) {
  if (links.length === 0) {
    return null;
  }

  return (
    <section className="related-links">
      <p className="section-label">関連ソース</p>
      <ul>
        {links.map((link) => (
          <li key={link.title}>
            {link.url ? (
              <a href={link.url} target="_blank" rel="noreferrer">
                {link.title}
              </a>
            ) : (
              <span>{link.title}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
