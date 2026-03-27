import type { Route } from "next";
import Link from "next/link";

const navigation = [
  { href: "/" as Route, label: "Start" },
  { href: "/om-boken" as Route, label: "Om boken" },
  { href: "/ljudbok" as Route, label: "Ljudbok" },
];

type SiteHeaderProps = {
  chapterCount: number;
};

export function SiteHeader({ chapterCount }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-header__brand" href="/">
          <span className="site-header__eyebrow">Edith Sodergran</span>
          <span className="site-header__title">Biografi online</span>
        </Link>

        <nav
          aria-label="Huvudnavigation"
          className="site-header__nav"
          data-chapter-count={chapterCount}
        >
          {navigation.map((item) => (
            <Link key={item.href} className="site-header__link" href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
