import Link from 'next/link';
import { ArrowIcon } from './icons';

const MAP_IMG = 'https://cdn.prod.website-files.com/69088e9cbe595647126a3125/6909ff40fcede156eedec149_Map.webp';

export default function HeroSection() {
  return (
    <section className="section hero-home-section">
      <div className="video-hero-home w-background-video w-background-video-atom">
        <video autoPlay loop muted playsInline>
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        <div className="w-layout-blockcontainer main-container w-container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="master-hero-home">
            <div className="content-hero-home">
              <div className="w-dyn-list">
                <div role="list" className="w-dyn-items">
                  <div role="listitem" className="w-dyn-item">
                    <a href="#results" className="tag-wrap w-inline-block">
                      <div className="label-master light"><div className="label-small">Portal</div></div>
                      <div className="label-small">2024/2025 Session — Term 1 results now available online.</div>
                    </a>
                  </div>
                </div>
              </div>

              <h1>Excellence is a child&apos;s first lesson</h1>

              <div className="button-wrap-hero-home">
                <a href="/results" className="cta-main w-inline-block">
                  <div className="button-text-mask"><div className="button-text">Check Results</div></div>
                  <div className="button-icon-wrap right">
                    <div className="icon-button w-embed"><ArrowIcon /></div>
                    <div className="icon-button w-embed"><ArrowIcon /></div>
                  </div>
                  <div className="button-bg" />
                </a>
                <Link href="/login" className="cta-main w-variant-1ff8d96e-78cc-eac8-de90-206ecdaded5f w-inline-block">
                  <div className="button-text-mask">
                    <div className="button-text w-variant-1ff8d96e-78cc-eac8-de90-206ecdaded5f">Staff Portal</div>
                  </div>
                  <div className="button-bg w-variant-1ff8d96e-78cc-eac8-de90-206ecdaded5f" />
                </Link>
              </div>
            </div>

            <div className="map-card">
              <div className="image-wrap-map">
                <img src={MAP_IMG} loading="lazy" alt="School location map" className="image-cover" />
              </div>
              <div className="label-small">Find us</div>
            </div>
          </div>
        </div>

        <div className="overlay-hero-home" />
      </div>
    </section>
  );
}
