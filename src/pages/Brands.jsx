import './Page.css';
import './Brands.css';

const Brands = () => {
  const brands = [
    { 
      name: 'Bodax', 
      href: 'https://bodax.dev', 
      logoSrc: '/icons/logos/bodax_logomark-light.png',
      description: 'The foundation of our digital presence. Custom software development, web solutions, and technical infrastructure powering the next generation of esports.'
    },
    { 
      name: 'Bodax Skirmishes', 
      href: 'https://bodax-skirmish.web.app/', 
      logoSrc: '/icons/logos/bodax-skirmish_logo_white.svg',
      description: 'Competitive VALORANT tournaments for the community. Weekly events, automated brackets, and a platform for rising talent to showcase their skills.'
    },
    { 
      name: 'Bodax Masters', 
      href: 'https://bodax-masters.web.app/', 
      logoSrc: '/icons/logos/bdx-g_logo-horizontal.svg',
      description: 'The premier league for top-tier competition. Featuring the best teams, high-stakes matches, and professional production quality.'
    },
  ];

  return (
    <div className="page">
      <div className="container">
        <div className="page-hero">
          <span className="kicker">Ecosystem</span>
          <h1 className="h2 page-hero-title">Our Brands</h1>
          <p className="page-hero-subtitle">
            Products and experiences built by Bodax Gaming.
          </p>
        </div>

        <div className="brands-grid">
          {brands.map((brand) => (
            <a 
              key={brand.name} 
              className="ecosystem-card" 
              href={brand.href} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <div className="ecosystem-logo-container">
                {brand.logoSrc && (
                  <img 
                    src={brand.logoSrc} 
                    alt={`${brand.name} logo`} 
                    className="ecosystem-logo"
                  />
                )}
              </div>
              
              <div className="ecosystem-content">
                <h3 className="ecosystem-name">{brand.name}</h3>
                <p className="ecosystem-desc">{brand.description}</p>
                <div className="ecosystem-link">Visit Website</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Brands;
