type DownloadCardProps = {
  href?: string;
  label: string;
  title: string;
  state: string;
};

export function DownloadCard({
  href,
  label,
  title,
  state,
}: DownloadCardProps) {
  const className = href
    ? "download-card"
    : "download-card download-card--inactive";

  const content = (
    <>
      <span className="download-card__label">{label}</span>
      <h3 className="download-card__title">{title}</h3>
      <p className="download-card__state">{state}</p>
    </>
  );

  if (href) {
    return (
      <a className={className} href={href}>
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}
