import '../pages/Home.css'; // Import Home styles first
import './Impressum.css';

const Impressum = () => {
  return (
    <div className="impressum-page">
      <section className="home-hero custom-page-hero">
        <div className="container">
          <div className="home-hero-inner">
            <div className="home-hero-kicker">Legal Information</div>
            <h1 className="home-hero-title">Impressum</h1>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <div className="legal-content">
            <div className="legal-block">
              <h2 className="legal-title">Angaben gemäß § 5 TMG</h2>
              <div className="legal-text">
                <p><strong>Bodax UG (haftungsbeschränkt)</strong></p>
                <p>Comeniusstr. 3</p>
                <p>81667 München</p>
                <p>Deutschland</p>
                
                <p style={{ marginTop: '16px' }}><strong>Vertreten durch:</strong><br />Alexander Kechagias</p>

                <p style={{ marginTop: '16px' }}><strong>Registereintrag:</strong><br />
                Eintragung im Handelsregister.<br />
                Registergericht: Amtsgericht München<br />
                Registernummer: [wird nachgereicht]</p>

                <p style={{ marginTop: '16px' }}><strong>Umsatzsteuer-ID:</strong><br />
                Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
                [wird nachgereicht]</p>
              </div>
            </div>

            <div className="legal-block">
              <h2 className="legal-title">Kontakt</h2>
              <div className="legal-text">
                <p>E-Mail: <a href="mailto:info@bodax-gaming.de" className="text-link">info@bodax-gaming.de</a></p>
              </div>
            </div>

            <div className="legal-block">
              <h2 className="legal-title">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
              <div className="legal-text">
                <p>Alexander Kechagias</p>
                <p>Bodax UG (haftungsbeschränkt)</p>
                <p>Comeniusstr. 3</p>
                <p>81667 München</p>
              </div>
            </div>

            <div className="legal-block">
              <h2 className="legal-title">Haftung für Inhalte</h2>
              <div className="legal-text">
                <p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
                <p>Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>
              </div>
            </div>

            <div className="legal-block">
              <h2 className="legal-title">Haftung für Links</h2>
              <div className="legal-text">
                <p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.</p>
                <p>Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.</p>
              </div>
            </div>

            <div className="legal-block">
              <h2 className="legal-title">Urheberrecht</h2>
              <div className="legal-text">
                <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.</p>
                <p>Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.</p>
              </div>
            </div>

            <div className="legal-block">
              <h2 className="legal-title">Streitschlichtung</h2>
              <div className="legal-text">
                <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-link">https://ec.europa.eu/consumers/odr/</a></p>
                <p>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
                <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Impressum;
