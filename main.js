/* MARICHAL — motion (GSAP + ScrollTrigger + Lenis) */
gsap.registerPlugin(ScrollTrigger);
history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = window.matchMedia('(pointer: fine)').matches;

let lenis = null;
if (!reduced) {
  lenis = new Lenis({ autoRaf: true, lerp: 0.09 });
  lenis.on('scroll', ScrollTrigger.update);
}

document.querySelectorAll('[data-scroll]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    closeMenu();
    lenis ? lenis.scrollTo(t, { duration: 1.4 }) : t.scrollIntoView({ behavior: 'smooth' });
  });
});

const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
function closeMenu() { burger.classList.remove('open'); mobileMenu.classList.remove('open'); }
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

const intro = document.getElementById('intro');
const introCount = document.getElementById('introCount');
const counter = { v: 0 };
gsap.timeline({ onComplete: () => { intro.style.display = 'none'; ScrollTrigger.refresh(); } })
  .to(counter, {
    v: 240, duration: reduced ? 0.01 : 1.15, ease: 'power2.inOut',
    onUpdate: () => { introCount.textContent = Math.round(counter.v); }
  })
  .to('.intro-inner', { yPercent: -30, opacity: 0, duration: 0.35, ease: 'power2.in' })
  .to(intro, { clipPath: 'inset(0 0 100% 0)', duration: 0.7, ease: 'power4.inOut' }, '-=0.1')
  .from('.hero-title span', { yPercent: 120, rotate: 5, duration: 0.9, stagger: 0.045, ease: 'power4.out' }, '-=0.55')
  .from('.hero-sub', { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, '-=0.5')
  .from('.hero-card, .hero-hint, .hero-brandline', { opacity: 0, duration: 0.5 }, '-=0.4')
  .to('.nav', { opacity: 1, duration: 0.5 }, '-=0.4');

if (!reduced) {
  const letters = gsap.utils.toArray('.hero-title span');
  letters.forEach((el, i) => {
    gsap.to(el, {
      y: (i % 2 ? -6 : 6),
      duration: 1.5 + (i % 3) * 0.4,
      yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.08
    });
  });

  letters.forEach((el, i) => {
    const depth = [6, 3, 5, 2, 4, 3, 6, 2.5][i] || 3;
    gsap.to(el, {
      yPercent: -depth * 6, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.4 }
    });
  });

  const proxy = { skew: 0 };
  const skewSetter = gsap.quickSetter('.hero-title span', 'skewY', 'deg');
  ScrollTrigger.create({
    onUpdate: self => {
      const skew = gsap.utils.clamp(-8, 8, self.getVelocity() / -350);
      if (Math.abs(skew) > Math.abs(proxy.skew)) {
        proxy.skew = skew;
        gsap.to(proxy, { skew: 0, duration: 0.8, ease: 'power3', overwrite: true, onUpdate: () => skewSetter(proxy.skew) });
      }
    }
  });

  const mt = document.getElementById('manifestoText');
  mt.innerHTML = mt.innerHTML.split(/(\s+)/).map(tk =>
    /^\s+$/.test(tk) ? tk : `<span class="w" style="opacity:0.12">${tk}</span>`
  ).join('');
  gsap.to('#manifestoText .w', {
    opacity: 1, stagger: 0.05, ease: 'none',
    scrollTrigger: { trigger: '.manifesto', start: 'top 75%', end: 'center 45%', scrub: true }
  });

  gsap.utils.toArray('.foto').forEach((f, i) => {
    const dir = i % 2 ? 1 : -1;
    gsap.fromTo(f,
      { y: 90 + i * 14, rotate: dir * 1.6 },
      {
        y: -(60 + i * 10), rotate: dir * -1.2, ease: 'none',
        scrollTrigger: { trigger: '.campo-stage', start: 'top bottom', end: 'bottom top', scrub: 0.6 }
      });
    gsap.from(f.querySelector('img'), {
      scale: 1.22, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: f, start: 'top 92%' }
    });
  });

  gsap.from('.campo-quote p', {
    opacity: 0, y: 30, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '.campo-quote', start: 'top 85%' }
  });
  gsap.fromTo('.campo-sig',
    { clipPath: 'inset(0 100% 0 0)' },
    { clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'power2.inOut',
      scrollTrigger: { trigger: '.campo-sig', start: 'top 88%' } });

  const track = document.querySelector('#marquee2 .marquee-track');
  const mTween = gsap.to(track, { xPercent: -50, ease: 'none', duration: 16, repeat: -1 });
  ScrollTrigger.create({
    onUpdate: self => {
      const boost = gsap.utils.clamp(1, 6, 1 + Math.abs(self.getVelocity()) / 900);
      gsap.to(mTween, { timeScale: -boost, duration: 0.3, overwrite: true });
    }
  });

  gsap.from('.serv-cell', {
    y: 70, opacity: 0, stagger: 0.09, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '.serv-grid', start: 'top 82%' }
  });

  gsap.utils.toArray('.section-title').forEach(el => {
    gsap.from(el, {
      clipPath: 'polygon(0 0, 0 0, 12% 100%, 0% 100%)', xPercent: -4,
      duration: 1, ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  gsap.from('.footer-panel', {
    y: 120, borderRadius: '60px', duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.footer-wrap', start: 'top 85%' }
  });
  gsap.from('.footer-tagline h2', {
    yPercent: 30, opacity: 0, duration: 1, ease: 'power4.out',
    scrollTrigger: { trigger: '.footer-tagline', start: 'top 80%' }
  });
  gsap.fromTo('.footer-sig',
    { clipPath: 'inset(0 100% 0 0)' },
    { clipPath: 'inset(0 0% 0 0)', duration: 1.3, ease: 'power2.inOut',
      scrollTrigger: { trigger: '.footer-tagline', start: 'top 75%' } });

  if (fine) {
    letters.forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.fromTo(el, { scaleY: 1 }, {
          scaleY: 0.82, duration: 0.12, ease: 'power2.in',
          onComplete: () => gsap.to(el, { scaleY: 1, duration: 1.1, ease: 'elastic.out(1.2, 0.32)' })
        });
      });
    });
  }
} else {
  gsap.set('.nav', { opacity: 1 });
  document.querySelectorAll('.marquee-track').forEach(t => { t.style.animation = 'marqueeFallback 20s linear infinite'; });
}

/* Fondo topo animado (canvas, estilo landonorris) */
(function topo() {
  const cv = document.getElementById('topoCanvas');
  if (!cv || reduced) return;
  const ctx = cv.getContext('2d');
  let W, H, t = 0;
  const LINES = 7;
  const AMP = 46;

  function size() {
    W = cv.width = innerWidth * devicePixelRatio;
    H = cv.height = innerHeight * devicePixelRatio;
  }
  size();
  window.addEventListener('resize', size);

  function lineY(i, x, tt) {
    const base = (H / (LINES + 1)) * (i + 1);
    return base
      + Math.sin(x / W * 4.2 + i * 1.7 + tt * 0.6) * AMP * devicePixelRatio * 0.7
      + Math.sin(x / W * 9 + tt * 1.1 + i) * AMP * devicePixelRatio * 0.28;
  }

  function draw() {
    t += 0.008;
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < LINES; i++) {
      const isLive = i === 3;
      ctx.beginPath();
      const step = 14 * devicePixelRatio;
      for (let x = -step; x <= W + step; x += step) {
        const y = lineY(i, x, t);
        x <= 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      if (isLive) {
        ctx.strokeStyle = 'rgba(225,6,0,0.4)';
        ctx.lineWidth = 1.5 * devicePixelRatio;
        ctx.setLineDash([7 * devicePixelRatio, 13 * devicePixelRatio]);
        ctx.lineDashOffset = -t * 260 * devicePixelRatio;
      } else {
        ctx.strokeStyle = 'rgba(10,10,10,0.09)';
        ctx.lineWidth = 1 * devicePixelRatio;
        ctx.setLineDash([]);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

const st = document.createElement('style');
st.textContent = '@keyframes marqueeFallback{from{transform:translateX(0)}to{transform:translateX(-50%)}}';
document.head.appendChild(st);
