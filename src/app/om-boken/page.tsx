import { EmptyState } from "@/components/empty-state";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSnapshot, getStatusText } from "../site-data";

export default async function AboutBookPage() {
  const snapshot = await getSnapshot();

  return (
    <main className="page-shell">
      <SiteHeader chapterCount={snapshot.chapters.length} />

      <section className="page-intro">
        <span className="eyebrow">Om boken</span>
        <h1 className="page-title">{snapshot.metadata.title}</h1>
        <p className="section-copy">
          {snapshot.metadata.description ??
            "Bokupplagan kombinerar oversikt, online-lasning och nedladdning i ett samlat redaktionellt uttryck."}
        </p>
      </section>

      <section className="section stack">
        <div className="panel">
          <span className="eyebrow">V1-fokus</span>
          <h2>Lasupplevelse fore extra funktioner</h2>
          <p className="section-copy">
            Den har versionen prioriterar en tydlig startsida, ett lugnt
            kapitelupplagg, PDF-nedladdning och en innehallspipeline som gor det
            enkelt att ersatta placeholder-lage med riktiga bokfiler.
          </p>
        </div>

        <div className="detail-grid">
          <div className="detail">
            <span className="eyebrow">Innehallstillstand</span>
            <strong>{snapshot.state}</strong>
            <p className="section-copy">{getStatusText(snapshot.state)}</p>
          </div>
          <div className="detail">
            <span className="eyebrow">Sprak</span>
            <strong>{snapshot.metadata.language.toUpperCase()}</strong>
            <p className="section-copy">
              Forsta releasen ar byggd med svenska som primart las- och
              navigationssprak.
            </p>
          </div>
          <div className="detail">
            <span className="eyebrow">Modell</span>
            <strong>Filbaserad</strong>
            <p className="section-copy">
              Kapitel, omslag och nedladdningar kopplas in via filer i projektet
              snarare an databas eller CMS.
            </p>
          </div>
        </div>

        {snapshot.metadata.notes?.length ? (
          <div className="panel">
            <span className="eyebrow">Arbetsnoteringar</span>
            <ul className="section-copy">
              {snapshot.metadata.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        ) : (
          <EmptyState
            body="Nar bokens slutliga metadata och redaktionella beskrivningar laggs in kommer denna sida att kunna visa en mer fullstandig presentation."
            title="Mer redaktionellt material kan laggas till"
          />
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
