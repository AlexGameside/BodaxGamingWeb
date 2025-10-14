import './Impressum.css';

const Impressum = () => {
  return (
    <div className="impressum-page">
      <div className="impressum-container">
        <h1 className="impressum-title">IMPRESSUM</h1>
        
        <section className="impressum-section">
          <h2 className="section-title">Angaben gemäß § 5 TMG</h2>
          <div className="section-content">
            <p><strong>Bodax Gaming</strong></p>
            <p>Max Bode</p>
            <p>Musterstraße 123</p>
            <p>12345 Musterstadt</p>
            <p>Deutschland</p>
          </div>
        </section>

        <section className="impressum-section">
          <h2 className="section-title">Kontakt</h2>
          <div className="section-content">
            <p>Telefon: +49 (0) 123 456789</p>
            <p>E-Mail: info@bodaxgaming.com</p>
          </div>
        </section>

        <section className="impressum-section">
          <h2 className="section-title">Umsatzsteuer-ID</h2>
          <div className="section-content">
            <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:</p>
            <p>DE123456789</p>
          </div>
        </section>

        <section className="impressum-section">
          <h2 className="section-title">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <div className="section-content">
            <p>Max Bode</p>
            <p>Musterstraße 123</p>
            <p>12345 Musterstadt</p>
          </div>
        </section>

        <section className="impressum-section">
          <h2 className="section-title">Haftung für Inhalte</h2>
          <div className="section-content">
            <p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
            <p>Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>
          </div>
        </section>

        <section className="impressum-section">
          <h2 className="section-title">Haftung für Links</h2>
          <div className="section-content">
            <p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.</p>
            <p>Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.</p>
          </div>
        </section>

        <section className="impressum-section">
          <h2 className="section-title">Urheberrecht</h2>
          <div className="section-content">
            <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.</p>
            <p>Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.</p>
          </div>
        </section>

        <section className="impressum-section">
          <h2 className="section-title">Streitschlichtung</h2>
          <div className="section-content">
            <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a></p>
            <p>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
            <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Impressum;
