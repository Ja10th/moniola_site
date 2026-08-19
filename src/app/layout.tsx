import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Moniola Laurels Educational School — Online Portal',
  description:
    'Online result checking and school administration portal for Moniola Laurels Educational School.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* 1. Webflow base styles — loads first */}
        <link
          href="https://cdn.prod.website-files.com/69088e9cbe595647126a3125/css/bobolobo.webflow.shared.359fc7377.css"
          rel="stylesheet"
          type="text/css"
          crossOrigin="anonymous"
        />
        {/*
          2. Critical inline overrides — this <style> tag appears in the HTML
             AFTER the Webflow <link> so it always wins the cascade, even when
             both have the same specificity and both use !important.
             Fixes: overlays (height/inset), video fill, section backgrounds,
             features card radius, and navbar colors.
        */}
        <style dangerouslySetInnerHTML={{ __html: `
          *,*::before,*::after{box-sizing:border-box}
          *{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility}

          /* VIDEO: Webflow sets inset:-100% z-index:-100 on video children */
          .w-background-video>video{
            position:absolute!important;inset:0!important;
            width:100%!important;height:100%!important;
            object-fit:cover!important;object-position:center!important;
            z-index:0!important;margin:0!important;pointer-events:none!important;
          }
          .video-hero-home.w-background-video{
            position:relative!important;overflow:hidden!important;
            width:100%!important;height:100vh!important;min-height:600px!important;
            display:flex!important;align-items:center!important;padding:0!important;
          }
          .video-home.w-background-video{
            position:relative!important;overflow:hidden!important;
            width:100%!important;height:560px!important;
          }
          .video-stats.w-background-video{
            position:relative!important;overflow:hidden!important;
            width:100%!important;height:420px!important;
          }
          .video-cta.w-background-video{
            position:relative!important;overflow:hidden!important;
            width:100%!important;height:460px!important;
            display:flex!important;align-items:center!important;justify-content:center!important;
          }

          /* OVERLAYS: Webflow sets height:40-60%, inset:auto 0% 0% (bottom-anchored partial).
             We force full-cover navy gradients on every overlay. */
          .overlay-hero-home{
            background-image:none!important;
            background:linear-gradient(to bottom,rgba(10,22,40,.58) 0%,rgba(10,22,40,.10) 40%,rgba(10,22,40,.68) 100%)!important;
            width:100%!important;height:100%!important;
            position:absolute!important;inset:0!important;
            z-index:1!important;pointer-events:none!important;
          }
          .overlay-stats-bottom{
            background-image:none!important;
            background:linear-gradient(to top,rgba(10,22,40,.92) 0%,rgba(10,22,40,.20) 70%,transparent 100%)!important;
            width:100%!important;height:100%!important;
            position:absolute!important;inset:0!important;
            z-index:1!important;pointer-events:none!important;
          }
          .overlay-cta{
            background-image:none!important;
            background:linear-gradient(to bottom,rgba(10,22,40,.55) 0%,rgba(10,22,40,.82) 100%)!important;
            width:100%!important;height:100%!important;
            position:absolute!important;inset:0!important;
            z-index:1!important;pointer-events:none!important;
          }

          /* Content sits above overlays */
          .video-hero-home .main-container,
          .video-stats .main-container,
          .video-cta .content-cta{position:relative!important;z-index:2!important;}
          .overlay-video-home{position:relative!important;z-index:2!important;}

          /* HERO SECTION: strip section padding */
          .section.hero-home-section{padding-top:0!important;padding-bottom:0!important;}

          /* FEATURES: remove rounded top card floating over hero */
          .section.features-section{
            background-color:#f0f3f8!important;
            border-top-left-radius:0!important;border-top-right-radius:0!important;
            position:relative!important;z-index:3!important;
          }

          /* SECTION BACKGROUNDS */
          .section.philosophy-section{background-color:#ffffff!important;}
          .section.testimonial-home-section{background-color:#f0f3f8!important;}
          .section.faq-section{background-color:#ffffff!important;}
          .section.blog-carousel-section{background-color:#f0f3f8!important;}
          .section.stats-section{background-color:transparent!important;}

          /* NAVBAR */
          .navbar.w-nav{
            background-color:rgba(10,22,40,.97)!important;
            backdrop-filter:blur(16px)!important;
            border-bottom:1px solid rgba(255,255,255,.08)!important;
          }
          /* Hide the square bg div behind the rounded dropdown */
          .nav-mobile-bg{display:none!important;}
          .nav-menu .nav-link,.nav-menu .nav-link div,
          .nav-dropdown-toggle>div:first-child,
          .brand-nav span,.brand-nav strong,.icon-dropdown{
            color:rgba(255,255,255,.85)!important;
          }
          /* Outer wrapper — transparent, no bg */
          .nav-dropdown-list{background-color:transparent!important;border:none!important;}
          /* Inner rounded container — this is the visible dropdown card */
          .nav-inner-dropdown-list{
            background-color:#0d2045!important;
            border:1px solid rgba(255,255,255,.1)!important;
            box-shadow:0 8px 32px rgba(0,0,0,.35)!important;
          }
          .nav-dropdown-link{color:rgba(255,255,255,.8)!important;}
          .nav-dropdown-link:hover{color:#fff!important;background-color:rgba(255,255,255,.06)!important;}
          .menu-button .icon-nav-menu,.menu-button svg{color:rgba(255,255,255,.85)!important;}
          .cta-small{background-color:#1a3a6b!important;border-color:#1a3a6b!important;}
          .cta-small .button-text{color:#fff!important;}

          /* BUTTONS */
          .cta-main .button-text{color:#fff!important;}
          .cta-main .button-bg{background-color:#1a3a6b!important;}
          .cta-main .icon-button{color:#fff!important;}
          [class*="w-variant-1ff8d96e"] .button-text{color:#0a1628!important;}
          [class*="w-variant-1ff8d96e"] .button-bg{background-color:rgba(255,255,255,.92)!important;}
          .cta-tertiary,.cta-tertiary div{color:#0a1628!important;border-color:#0a1628!important;}

          /* LABEL PILLS */
          .label-master{background-color:#0a1628!important;color:#fff!important;}
          .label-master .label-small{color:#fff!important;}
          .label-master.light{background-color:rgba(255,255,255,.15)!important;}
          .label-master.light .label-small{color:rgba(255,255,255,.9)!important;}
          .tag-wrap{background-color:rgba(255,255,255,.1)!important;border-color:rgba(255,255,255,.2)!important;}
          .tag-wrap .label-small{color:rgba(255,255,255,.9)!important;}
          .wrap-about-home .label-large{color:#1a3a6b!important;}

          /* FAQ */
          .expandable-single{border-color:#dce4f0!important;}
          .faq-horizontal,.faq-vertical{background-color:#0a1628!important;}

          /* FEATURE CARDS */
          .feature-card{background-color:transparent!important;border-color:transparent!important;box-shadow:none!important;}

          /* TESTIMONIALS */
          .card-testimonial{background-color:#fff!important;border-color:#dce4f0!important;}
          .star{color:#1a3a6b!important;}

          /* FOOTER — use Webflow's own dark bg, just fix text colors */
          .content-footer{background-color:unset!important;}
          .footer-link,.footer-legal-link{color:unset!important;}
          .footer-link:hover,.footer-legal-link:hover{color:unset!important;}
          .footer-left a,.footer-left .tone-strong a{color:unset!important;}

          /* PHILOSOPHY */
          .section.philosophy-section{background-color:#fff!important;}
          .wrap-about-home .label-large{color:#1a3a6b!important;}

          /* TERM TAG */
          .term-tag{background:#1a3a6b!important;color:#fff!important;}
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}
