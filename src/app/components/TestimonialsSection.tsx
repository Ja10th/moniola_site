'use client';
import { useState } from 'react';
import { StarIcon, PlayIcon, ArrowIcon } from './icons';

const CDN = 'https://cdn.prod.website-files.com/69088e9cbe595647126a3125';
const AVATAR = `${CDN}/6909ff3f6e3eca360fc2df90_Emily.webp`;

const TESTIMONIALS = [
  {
    quote: "The results portal is incredibly easy to use. I checked my daughter's report card in seconds — no stress, no waiting.",
    name: 'Mrs. Adeyemi',
    role: 'Parent of JSS2 Student',
  },
  {
    quote: 'Moniola Laurels has given my son the discipline and confidence he needed. The teachers genuinely care about every child.',
    name: 'Mr. & Mrs. Okafor',
    role: 'Parents of SSS1 Student',
  },
  {
    quote: 'The online portal keeps me updated every term. I can see grades, teacher remarks, and position — all in one place.',
    name: 'Mr. Balogun',
    role: 'Parent of JSS3 Student',
  },
];

function Stars() {
  return (
    <div className="stars-tile">
      {[0, 1, 2, 3, 4].map(i => (
        <div key={i} className="star w-embed"><StarIcon /></div>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setCurrent(i => (i + 1) % TESTIMONIALS.length);
  const t = TESTIMONIALS[current];

  return (
    <section className="section testimonial-home-section">
      <div className="w-layout-blockcontainer main-container w-container">

        <div className="headline-video-home">
          <div className="heading-home-video">
            <h2 className="no-margins">See what everyday learning looks like</h2>
          </div>
          <div className="text-wrap-home-video">
            <div>
              Step inside a day at Moniola Laurels Educational School — where structured
              learning meets genuine care. Watch how our teachers guide, challenge, and
              celebrate every student.
            </div>
          </div>
        </div>

        {/* Video section */}
        <div className="video-home w-background-video w-background-video-atom">
          <video autoPlay loop muted playsInline>
            <source src="/videos/classroom.mp4" type="video/mp4" />
          </video>
          <div className="overlay-video-home" style={{ position: 'relative', zIndex: 2 }}>
            <div className="icon-wrap-video">
              <div className="icon-medium w-embed"><PlayIcon /></div>
            </div>
            <div className="text-wrap-lightbox">
              <div className="text-body-bold">Watch the full video</div>
              <div className="tone-medium">2m 32s</div>
            </div>
          </div>
        </div>

        {/* Testimonial slider */}
        <div className="slider w-slider" style={{ position: 'relative' }} role="region" aria-label="Parent testimonials">
          <div className="mask-testimonial-slide w-slider-mask">
            <div className="slide-testimonial w-slide">
              <div className="card-testimonial">
                <div className="testimonial-slide-top-tile">
                  <Stars />
                  <div className="text-large text-body-bold">&ldquo;{t.quote}&rdquo;</div>
                </div>
                <div className="testimonial-bottom-tile">
                  <div className="image-wrap-testimonial">
                    <img loading="lazy" src={AVATAR} alt={t.name} className="image-cover" />
                  </div>
                  <div className="text-wrap-testimonial-author">
                    <div className="text-body-bold">{t.name}</div>
                    <div className="text-small tone-medium">{t.role}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button className="slider-button w-slider-arrow-left" onClick={prev} aria-label="Previous testimonial"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <div className="button-slider w-variant-3b1d5b2f-3e5d-c467-6981-e7b261b76e46">
              <div className="wrap-icon-slider w-variant-5ba9241a-7079-4c4d-345e-a0127f34962f">
                <div className="icons-slider">
                  <div className="icon-slider-button large w-embed" style={{ transform: 'rotate(180deg)' }}>
                    <ArrowIcon />
                  </div>
                </div>
              </div>
            </div>
          </button>

          <button className="slider-button w-slider-arrow-right" onClick={next} aria-label="Next testimonial"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <div className="button-slider w-variant-3b1d5b2f-3e5d-c467-6981-e7b261b76e46">
              <div className="wrap-icon-slider">
                <div className="icons-slider">
                  <div className="icon-slider-button large w-embed"><ArrowIcon /></div>
                </div>
              </div>
            </div>
          </button>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.25rem' }}
            role="tablist" aria-label="Testimonial slides">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} role="tab" aria-selected={i === current}
                aria-label={`Go to testimonial ${i + 1}`} onClick={() => setCurrent(i)}
                style={{
                  width: i === current ? 24 : 8, height: 8, borderRadius: 999,
                  background: i === current ? '#262626' : '#ccc',
                  border: 'none', cursor: 'pointer', transition: 'all 0.25s ease', padding: 0,
                }} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
