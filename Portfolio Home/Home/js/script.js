const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasHover = matchMedia('(hover:hover)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---- load curtain ---- */
const start = () => document.body.classList.add('loaded');
if (document.readyState === 'complete') setTimeout(start, 350);
else addEventListener('load', () => setTimeout(start, 350));
setTimeout(start, 2500);

/* ---- split headings into words ---- */
$$('.split').forEach(el => {
  let i = 0;
  (function walk(n){
    [...n.childNodes].forEach(c => {
      if (c.nodeType === 3) {
        const frag = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(t => {
          if (!t) return;
          if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span'); w.className = 'w';
          const s = document.createElement('span'); s.textContent = t;
          s.style.transitionDelay = Math.min(i++ * 0.04, .7) + 's';
          w.appendChild(s); frag.appendChild(w);
        });
        c.replaceWith(frag);
      } else if (c.nodeType === 1) walk(c);
    });
  })(el);
});

/* ---- reveal on scroll ---- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); if (e.target.querySelector('[data-count]')) countUp(e.target); }
}), { threshold: .15 });
$$('.reveal, .split').forEach(el => io.observe(el));

/* ---- active nav ---- */
const links = $$('.nav-link');
const secIO = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
$$('main section').forEach(s => secIO.observe(s));

/* ---- count-up stats ---- */
function countUp(root){
  $$('[data-count]', root).forEach(el => {
    const end = +el.dataset.count, suf = el.dataset.suffix || '';
    if (reduce) { el.textContent = end + suf; return; }
    const t0 = performance.now(), dur = 1400;
    (function tick(t){
      const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(end * e) + suf;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  });
}

/* ---- scroll: header hide/show, progress bar, photo parallax ---- */
const header = $('#siteHeader'), bar = $('#progress'), shots = $$('.shot');
let lastY = scrollY, ticking = false;
function onScroll(){
  const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  header.classList.toggle('scrolled', y > 10);
  header.classList.toggle('hide', y > lastY && y > 240);
  lastY = y;
  if (!reduce) shots.forEach(s => {
    const r = s.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - innerHeight / 2) / innerHeight));
    s.style.setProperty('--py', (p * -7).toFixed(2) + '%');
  });
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
addEventListener('resize', onScroll, { passive: true });
onScroll();

/* ---- LA clock ---- */
const clock = $('#clock');
const fmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Los_Angeles', timeZoneName: 'short' });
const tick = () => clock.textContent = fmt.format(new Date());
tick(); setInterval(tick, 1000);

/* ---- magnetic buttons ---- */
if (hasHover && !reduce) $$('[data-magnetic]').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`;
  });
  el.addEventListener('mouseleave', () => el.style.transform = '');
});

/* ---- copy email ---- */
const copyBtn = $('#copyBtn');
copyBtn.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText('patrickamallari@gmail.com'); copyBtn.textContent = 'Copied ✓'; }
  catch { copyBtn.textContent = 'patrickamallari@gmail.com'; }
  setTimeout(() => copyBtn.textContent = 'Copy email', 1800);
});

/* ---- skills: expanding panels ---- */
const panels = $$('.panel');
function activate(p){
  panels.forEach(x => { const on = x === p; x.classList.toggle('active', on); x.setAttribute('aria-expanded', on); });
}
panels.forEach(p => {
  if (hasHover) p.addEventListener('mouseenter', () => activate(p));
  p.addEventListener('click', () => activate(p));
  p.addEventListener('focus', () => activate(p));
  p.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(p); } });
});

/* ---- work: cursor-following preview ---- */
const peek = $('#peek'), peekCard = $('#peekCard'), covers = $$('.cover', peek);
if (hasHover && !reduce) {
  let tx = 0, ty = 0, cx = 0, cy = 0;
  $$('.row').forEach(row => {
    row.addEventListener('mouseenter', e => {
      covers.forEach((c, i) => c.classList.toggle('on', i === +row.dataset.i));
      if (!peek.classList.contains('show')) { cx = tx = e.clientX; cy = ty = e.clientY; }
      peek.classList.add('show');
    });
    row.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    row.addEventListener('mouseleave', () => peek.classList.remove('show'));
  });
  (function loop(){
    const px = cx;
    cx += (tx - cx) * .13; cy += (ty - cy) * .13;
    const x = Math.min(cx + 32, innerWidth - 332);
    const y = Math.max(12, Math.min(cy - 190, innerHeight - 392));
    peek.style.transform = `translate3d(${x}px,${y}px,0)`;
    peekCard.style.rotate = Math.max(-8, Math.min(8, (cx - px) * 1.2)) + 'deg';
    requestAnimationFrame(loop);
  })();
}

/* ---- lightbox ---- */
const lb = $('#lb'), lbImg = $('#lbImg'), lbCount = $('#lbCount');
const photos = shots.map(s => ({ src: $('img', s).src, alt: $('img', s).alt }));
let cur = 0, lastFocus = null;
function show(i){
  cur = (i + photos.length) % photos.length;
  lbImg.classList.remove('ready');
  const img = new Image();
  img.onload = () => { lbImg.src = img.src; lbImg.alt = photos[cur].alt; requestAnimationFrame(() => lbImg.classList.add('ready')); };
  img.src = photos[cur].src;
  lbCount.textContent = `${String(cur + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
}
function openLb(i){ lastFocus = document.activeElement; lb.classList.add('open'); document.body.classList.add('locked'); show(i); $('#lbClose').focus(); }
function closeLb(){ lb.classList.remove('open'); document.body.classList.remove('locked'); lbImg.classList.remove('ready'); lastFocus && lastFocus.focus(); }
shots.forEach((s, i) => {
  s.addEventListener('click', () => openLb(i));
  s.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(i); } });
});
$('#lbClose').addEventListener('click', closeLb);
$('#lbPrev').addEventListener('click', () => show(cur - 1));
$('#lbNext').addEventListener('click', () => show(cur + 1));
lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb-stage')) closeLb(); });
addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowRight') show(cur + 1);
  if (e.key === 'ArrowLeft') show(cur - 1);
});

/* ---- swipe to navigate lightbox on touch screens ---- */
let touchX = null;
lb.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener('touchend', e => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
  touchX = null;
}, { passive: true });
