// src/components/BookingSuccess.jsx
import { useEffect, useState } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Outfit:wght@300;400;500&display=swap');

  :root {
    --gold: #b8892e;
    --gold-light: #d4a84b;
    --gold-pale: #f5ead5;
    --bg: #ffffff;
    --bg2: #fdfcf9;
    --text: #1a1510;
    --muted: #9a8f7e;
    --border: #ede5d4;
  }

  .bs-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    font-family: 'Outfit', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .bs-root::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 70% 55% at 50% 0%, #fdf3e0 0%, transparent 65%),
      radial-gradient(ellipse 50% 40% at 100% 100%, #fef8ee 0%, transparent 60%);
    pointer-events: none;
  }

  .bs-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(180,140,60,.1) 1px, transparent 1px);
    background-size: 36px 36px;
    pointer-events: none;
  }

  .bs-card {
    position: relative;
    z-index: 1;
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 28px;
    padding: 56px 52px 48px;
    width: 100%;
    max-width: 420px;
    text-align: center;
    box-shadow:
      0 0 0 1px rgba(180,140,60,.07),
      0 4px 6px rgba(0,0,0,.03),
      0 20px 60px rgba(180,140,60,.07),
      0 40px 80px rgba(0,0,0,.05);
    opacity: 0;
    transform: translateY(28px) scale(.97);
    animation: bs-rise .7s cubic-bezier(.22,.8,.36,1) .1s forwards;
  }

  @keyframes bs-rise {
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .bs-card::before {
    content: '';
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: 64px; height: 3px;
    background: linear-gradient(90deg, transparent, var(--gold-light), transparent);
    border-radius: 0 0 4px 4px;
    opacity: 0;
    animation: bs-fade .4s ease 1.8s forwards;
  }

  @keyframes bs-fade { to { opacity: 1; } }

  .bs-ring-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 32px;
  }

  .bs-ring {
    position: relative;
    width: 92px;
    height: 92px;
    opacity: 0;
    animation: bs-fade .3s ease .7s forwards;
  }

  .bs-ring svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .bs-ring-bg      { fill: var(--gold-pale); }
  .bs-ring-track   { fill: none; stroke: var(--border); stroke-width: 2; }

  .bs-ring-progress {
    fill: none;
    stroke: var(--gold);
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-dasharray: 263;
    stroke-dashoffset: 263;
    animation: bs-draw 1.1s cubic-bezier(.4,0,.2,1) .8s forwards;
    transform-origin: center;
    transform: rotate(-90deg);
  }

  @keyframes bs-draw { to { stroke-dashoffset: 0; } }

  .bs-check {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    opacity: 0;
    transform: scale(.4) rotate(-15deg);
    animation: bs-pop .45s cubic-bezier(.34,1.56,.64,1) 1.8s forwards;
  }

  @keyframes bs-pop {
    to { opacity: 1; transform: scale(1) rotate(0deg); }
  }

  .bs-eyebrow {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: .22em;
    text-transform: uppercase;
    color: var(--gold);
    margin: 0 0 10px;
    opacity: 0;
    animation: bs-up .5s ease 2s forwards;
  }

  .bs-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: 38px;
    font-weight: 300;
    color: var(--text);
    margin: 0 0 14px;
    line-height: 1.15;
    letter-spacing: -.02em;
    opacity: 0;
    animation: bs-up .5s ease 2.15s forwards;
  }

  .bs-heading em {
    font-style: italic;
    color: var(--gold);
  }

  .bs-subtext {
    font-size: 14px;
    font-weight: 300;
    color: var(--muted);
    line-height: 1.7;
    margin: 0 0 36px;
    opacity: 0;
    animation: bs-up .5s ease 2.3s forwards;
  }

  @keyframes bs-up {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .bs-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border) 30%, var(--border) 70%, transparent);
    margin: 0 0 30px;
    opacity: 0;
    animation: bs-fade .5s ease 2.4s forwards;
  }

  .bs-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 13px 30px;
    font-family: 'Outfit', sans-serif;
    font-size: 12.5px;
    font-weight: 500;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: #fff;
    background: var(--gold);
    border: none;
    border-radius: 100px;
    cursor: pointer;
    transition: background .2s, transform .15s, box-shadow .2s;
    box-shadow: 0 4px 20px rgba(184,137,46,.22);
    opacity: 0;
    animation: bs-up .5s ease 2.55s forwards;
  }

  .bs-btn:hover {
    background: var(--gold-light);
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(184,137,46,.3);
  }

  .bs-btn:active {
    transform: translateY(0);
  }

  .bs-btn-arrow {
    font-size: 15px;
    transition: transform .2s;
    display: inline-block;
  }

  .bs-btn:hover .bs-btn-arrow {
    transform: translateX(4px);
  }

  .bs-particle {
    position: absolute;
    border-radius: 50%;
    background: var(--gold-light);
    pointer-events: none;
    opacity: 0;
    animation: bs-float var(--dur, 4s) ease-in-out var(--delay, 0s) infinite;
  }

  @keyframes bs-float {
    0%   { opacity: 0;   transform: translate(0, 0) scale(1); }
    20%  { opacity: .2;  }
    80%  { opacity: .08; }
    100% { opacity: 0;   transform: translate(var(--tx, 0px), var(--ty, -80px)) scale(.2); }
  }
`;

const particles = [
  { w: 5, h: 5, left: "20%", top: "70%", delay: "2.6s", dur: "4.5s", tx: "14px",  ty: "-90px"  },
  { w: 3, h: 3, left: "80%", top: "62%", delay: "3.1s", dur: "5s",   tx: "-10px", ty: "-75px"  },
  { w: 6, h: 6, left: "52%", top: "78%", delay: "2.9s", dur: "4.2s", tx: "6px",   ty: "-100px" },
  { w: 3, h: 3, left: "36%", top: "58%", delay: "3.6s", dur: "5.5s", tx: "-16px", ty: "-80px"  },
  { w: 4, h: 4, left: "68%", top: "74%", delay: "2.3s", dur: "4.8s", tx: "11px",  ty: "-95px"  },
];

export default function BookingSuccess({ onReset }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      <style>{css}</style>
      <div className="bs-root">
        {mounted && particles.map((p, i) => (
          <div
            key={i}
            className="bs-particle"
            style={{
              width: p.w, height: p.h,
              left: p.left, top: p.top,
              "--delay": p.delay,
              "--dur":   p.dur,
              "--tx":    p.tx,
              "--ty":    p.ty,
            }}
          />
        ))}

        <div className="bs-card">
          <div className="bs-ring-wrap">
            <div className="bs-ring">
              <svg viewBox="0 0 92 92">
                <circle className="bs-ring-bg"       cx="46" cy="46" r="38" />
                <circle className="bs-ring-track"    cx="46" cy="46" r="42" />
                <circle className="bs-ring-progress" cx="46" cy="46" r="42" />
              </svg>
              <div className="bs-check">✦</div>
            </div>
          </div>

          <p className="bs-eyebrow">Reservation Confirmed</p>
          <h2 className="bs-heading">
            Your seat is<br /><em>secured.</em>
          </h2>
          <p className="bs-subtext">
            We've received your booking and will be in touch shortly with your confirmation details.
          </p>

          <div className="bs-divider" />

          <button className="bs-btn" onClick={onReset}>
            Book Another Slot
            <span className="bs-btn-arrow">→</span>
          </button>
        </div>
      </div>
    </>
  );
}