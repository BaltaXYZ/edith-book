import type { Route } from "next";
import Link from "next/link";

const navigation = [
  { href: "/" as Route, label: "Start" },
  { href: "/om-boken" as Route, label: "Om boken" },
  { href: "/kapitel" as Route, label: "Kapitel" },
  { href: "/ladda-ner" as Route, label: "Ladda ner" },
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

        <nav aria-label="Huvudnavigation" className="site-header__nav">
          {navigation.map((item) => (
            <Link key={item.href} className="site-header__link" href={item.href}>
              {item.label}
            </Link>
          ))}
          <span className="site-header__meta">{chapterCount} kapitel</span>
        </nav>
      </div>
    </header>
  );
}
