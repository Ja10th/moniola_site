import Link from 'next/link';

const CDN = 'https://cdn.prod.website-files.com/69088e9cbe595647126a3125';

export default function PhilosophySection() {
  return (
    <section className="section philosophy-section">
      <div className="w-layout-blockcontainer main-container w-container">
        <div className="w-layout-grid phi-halves">

          {/* Left image column */}
          <div className="left-column">
            <div className="image-wrap-column">
              <img
                src={`${CDN}/6909ff41c14eed0fcefcb56b_Philosophy.webp`}
                loading="lazy"
                alt="Students working together in class"
                className="image-cover"
              />
            </div>
            <img
              src={`${CDN}/6909ff3f8c90b823345c4617_Drawing.webp`}
              loading="lazy"
              alt="Student artwork"
              className="image-absolute-1"
            />
            <img
              src={`${CDN}/6909ff4067ee8b8ecfd2a01d_Story%20Pink%20SVG.svg`}
              loading="lazy"
              alt=""
              className="image-absolute-2"
            />
            <img
              src={`${CDN}/6909ff408a4a68ad634286f2_Light%20Story.svg`}
              loading="lazy"
              alt=""
              className="image-absolute-3"
            />
          </div>

          {/* Right content column */}
          <div className="content-column">
            <div className="label-master">
              <div className="label-small">OUR PHILOSOPHY</div>
            </div>
            <div className="heading-column">
              <h2 className="no-margins">
                Education deserves presence — not just performance
              </h2>
              <div>
                At Moniola Laurels Educational School, we believe school years aren&apos;t just about
                passing exams — they&apos;re about forming character. We build an environment
                of discipline, curiosity, and genuine care for every student&apos;s growth.
              </div>
            </div>
            <Link
              href="/about"
              className="cta-main w-variant-1ff8d96e-78cc-eac8-de90-206ecdaded5f w-inline-block"
            >
              <div className="button-text-mask">
                <div className="button-text w-variant-1ff8d96e-78cc-eac8-de90-206ecdaded5f">
                  Read Our Story
                </div>
              </div>
              <div className="button-bg w-variant-1ff8d96e-78cc-eac8-de90-206ecdaded5f" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
