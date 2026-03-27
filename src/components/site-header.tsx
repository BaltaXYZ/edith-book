import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-header__brand" href="/">
          <span className="site-header__eyebrow">Edith Södergran</span>
          <span className="site-header__title">Biografi online</span>
        </Link>
      </div>
    </header>
  );
}
