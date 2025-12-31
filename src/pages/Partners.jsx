import './Page.css';
import './Partners.css';

const Partners = () => {
  const partners = [
    { name: 'Bodax', href: 'https://bodax.dev', logoSrc: '/icons/logos/bodax_logomark-light.png' },
    { name: 'Bodax Skirmishes', href: 'https://bodax-skirmish.web.app/', logoSrc: '/icons/logos/bodax-skirmish_logo_white.svg' },
    { name: 'Bodax Masters', href: 'https://bodax-masters.web.app/', logoSrc: '/icons/logos/bdx-g_logo-horizontal.svg' },
  ];

  return (
    <div className="page">
      <div className="container">
        <div className="page-hero">
          <span className="kicker">Support</span>
          <h1 className="h2 page-hero-title">Our Brands</h1>
          <p className="page-hero-subtitle">
            Brands and builders who power the program. Want to partner? Reach out and we’ll talk fit.
          </p>
        </div>

        <div className="partners-grid">
          {partners.map((p) => (
            <a key={p.name} className="partner-card" href={p.href} target="_blank" rel="noopener noreferrer">
              {p.logoSrc ? (
                <div className="partner-logo">
                  <img src={p.logoSrc} alt={`${p.name} logo`} />
                </div>
              ) : null}
              <div className="partner-name">{p.name}</div>
              <div className="partner-cta">Visit →</div>
            </a>
          ))}
          <div className="partner-card partner-card--empty">
            <div className="partner-name">Your brand here</div>
            <div className="partner-cta">Contact us</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partners;


