type ChapterCardProps = {
  href: string;
  index: number;
  title: string;
  excerpt?: string;
  readingTime?: string;
};

export function ChapterCard({
  href,
  index,
  title,
  excerpt,
  readingTime,
}: ChapterCardProps) {
  return (
    <a className="chapter-card" href={href}>
      <div className="chapter-card__number">
        {String(index).padStart(2, "0")}
      </div>
      <div className="chapter-card__body">
        <h3>{title}</h3>
        {excerpt ? <p>{excerpt}</p> : null}
      </div>
      <div className="chapter-card__meta">
        <span>Läs kapitel</span>
        {readingTime ? <span>{readingTime}</span> : null}
      </div>
    </a>
  );
}
