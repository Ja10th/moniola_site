'use client';
import { useState } from 'react';

const FAQS = [
  {
    q: "How do I check my child's result?",
    a: "Enter the student's admission number, select the academic session and term, then input the result access PIN issued by the school. The full report card appears instantly.",
  },
  {
    q: 'Where do I get the result PIN?',
    a: 'The PIN is issued by the school registrar at the start of each term. Contact the school office if you have not received yours.',
  },
  {
    q: 'Can I print the report card?',
    a: 'Yes. After the result loads, click the "Print Report" button at the top of the page to get a clean, print-ready version.',
  },
  {
    q: 'What grading system does the school use?',
    a: 'We use the Nigerian WAEC/NECO scale: A1 (75–100), B2 (70–74), B3 (65–69), C4 (60–64), C5 (55–59), C6 (50–54), D7 (45–49), E8 (40–44), F9 (0–39).',
  },
  {
    q: 'How do I log in as a teacher or admin?',
    a: 'Click the "Staff Portal" button in the navigation bar and sign in with your school-issued credentials.',
  },
  {
    q: 'What if I see an error when checking results?',
    a: 'Double-check the admission number format, the session year, and your PIN. If the problem persists, call the school office for support.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="expandable-single">
      <button
        className="expandable-top"
        onClick={() => setOpen(prev => !prev)}
        aria-expanded={open}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          textAlign: 'left',
          cursor: 'pointer',
          padding: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div className="text-body-bold">{q}</div>
        <div className="faq-animated-box" aria-hidden="true">
          <div className="faq-horizontal" />
          {/* Vertical bar rotates to 0deg when open, hiding it (plus → minus) */}
          <div
            className="faq-vertical"
            style={{
              transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.25s ease',
            }}
          />
        </div>
      </button>

      <div
        className="expandable-bottom"
        style={{
          display: open ? 'block' : 'none',
        }}
      >
        <p className="faq-paragraph">{a}</p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  return (
    <section className="section faq-section">
      <div className="w-layout-blockcontainer main-container w-container">
        <div className="headline-faq">
          <div className="label-master">
            <div className="label-small">FAQ</div>
          </div>
          <h2 className="text-h1 no-margins">No stress. No surprises.</h2>
          <div>Clear answers for parents and students using our portal.</div>
        </div>

        <div className="faq-block">
          {FAQS.map(faq => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
