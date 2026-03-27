import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSnapshot } from "../site-data";

export default async function AboutBookPage() {
  const snapshot = await getSnapshot();

  return (
    <main className="page-shell">
      <SiteHeader chapterCount={snapshot.chapters.length} />

      <section className="page-intro">
        <span className="eyebrow">Om boken</span>
        <h1 className="page-title">Hur boken blev till</h1>
        <p className="section-copy">
          Underlaget i bokprojektet Book-sodergran visar ett arbete som byggdes
          med ovanligt mycket disciplin och ovanligt lite tålamod med
          halvfärdiga lösningar.
        </p>
      </section>

      <section className="section stack">
        <div className="panel">
          <span className="eyebrow">Startskottet</span>
          <h2>Forst kom styrsystemet, sedan prosan</h2>
          <p className="section-copy">
            Projektet borjade inte med ett romantiskt kast in i kapitel ett.
            Forst sattes discovery, beslut, riskregister, leveransdefinition och
            arbetsregler pa plats. Malbilden var tydlig redan tidigt: en
            fullangdsbiografi om Edith Sodergran, omkring 55 000 till 70 000 ord,
            levererad som ett verkligt bokmanus i Markdown och DOCX.
          </p>
        </div>

        <div className="detail-grid">
          <div className="detail">
            <span className="eyebrow">Orkestratorn</span>
            <strong>Holl ihop allt</strong>
            <p className="section-copy">
              En huvudredaktor agerade grindvakt for hela kedjan och stoppade
              varje frestelse att kalla en snygg skiss for ett färdigt kapitel.
            </p>
          </div>
          <div className="detail">
            <span className="eyebrow">Specialisterna</span>
            <strong>Sju roller</strong>
            <p className="section-copy">
              Biografiforskare, faktagranskare, litteraranalytiker,
              strukturredaktor, stilredaktor och riskgranskare jobbade runt
              manuset som en liten, mycket petig redaktion.
            </p>
          </div>
          <div className="detail">
            <span className="eyebrow">Arbetstakten</span>
            <strong>Iteration for iteration</strong>
            <p className="section-copy">
              Kapitelplanen gick stegvis fran oversikt och tidiga ar till sena
              verk och eftermale, sa att boken kunde byggas som helhet och inte
              som en rad ensamstående essäer.
            </p>
          </div>
        </div>

        <div className="panel">
          <span className="eyebrow">Verkstaden</span>
          <h2>En bokmaskin med fler bromsar an genvägar</h2>
          <p className="section-copy">
            Det mest underhallande i materialet ar hur envist allt vagrar bli
            slarvigt. Fakta skulle sparas till källor. Citat skulle kontrolleras.
            Sjukdomsperspektivet fick inte tillatas svalla ut och forklara hela
            personen. Myten kring Edith Sodergran skulle inte få gå före människan.
          </p>
          <p className="section-copy">
            Samtidigt handlade arbetet inte bara om att vara korrekt. Kapitel
            skulle ocksa ha rytm, oppningar, tyngdpunkt och ett avslut som drog
            lasaren vidare. Med andra ord: projektet betedde sig mindre som en
            anteckningshög och mer som en redaktion som vägrade släppa igenom
            något som inte bar sin egen vikt som bokprosa.
          </p>
          <p className="section-copy">
            Det ar darfor den färdiga boken kanns sa samlad. Under ytan finns en
            ganska arbetsglad liten armé av roller, checklistor, discovery-noter
            och kvalitetsgrindar. Pa ytan marks bara det viktigaste: att texten
            ror sig framåt med klarhet, nerv och respekt for sitt ämne.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
