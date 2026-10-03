// Starfield: twinkling stars with gentle drift and mouse parallax
(function () {
  const c = document.getElementById('stars'), ctx = c.getContext('2d');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w, h, stars = [], mx = 0, my = 0;

  function init() {
    w = c.width = innerWidth; h = c.height = innerHeight;
    const n = Math.min(220, Math.floor(w * h / 8000));
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.3 + .3, d: Math.random() * .8 + .2,
      p: Math.random() * Math.PI * 2, s: Math.random() * .02 + .005,
      hue: [190, 175, 260][Math.floor(Math.random() * 3)]
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.p += s.s;
      s.y -= s.d * .06;
      if (s.y < -2) { s.y = h + 2; s.x = Math.random() * w; }
      const a = .35 + .65 * Math.abs(Math.sin(s.p));
      const x = s.x + mx * s.d * 14, y = s.y + my * s.d * 14;
      ctx.beginPath();
      ctx.arc(x, y, s.r, 0, 6.283);
      ctx.fillStyle = `hsla(${s.hue},90%,85%,${a})`;
      ctx.fill();
    }
    if (!still) requestAnimationFrame(draw);
  }

  addEventListener('mousemove', e => { mx = e.clientX / w - .5; my = e.clientY / h - .5; });
  addEventListener('resize', () => { init(); if (still) draw(); });
  init(); draw();
})();

// Mobile menu
const burger = document.querySelector('.burger'), menu = document.getElementById('menu');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open'); burger.setAttribute('aria-expanded', false);
}));

// Fade-in on scroll
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Highlight active nav link
const links = [...menu.querySelectorAll('a')];
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section').forEach(s => spy.observe(s));

document.getElementById('year').textContent = new Date().getFullYear();
