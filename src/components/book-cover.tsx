type BookCoverProps = {
  title: string;
  subtitle: string;
  authorLabel: string;
  imageUrl?: string | null;
};

export function BookCover({
  title,
  subtitle,
  authorLabel,
  imageUrl,
}: BookCoverProps) {
  if (imageUrl) {
    return (
      <div className="book-cover book-cover--image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={`Omslag för ${title}`} src={imageUrl} />
      </div>
    );
  }

  return (
    <div className="book-cover">
      <span className="book-cover__label">{authorLabel}</span>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}
