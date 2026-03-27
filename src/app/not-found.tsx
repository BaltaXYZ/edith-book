import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell">
      <section className="page-intro">
        <span className="eyebrow">404</span>
        <h1 className="page-title">Sidan kunde inte hittas</h1>
        <p className="section-copy">
          Antingen finns inte kapitlet än, eller så har adressen ändrats.
        </p>
        <Link className="cta" href="/">
          Till startsidan
        </Link>
      </section>
    </main>
  );
}
