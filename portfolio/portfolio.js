// Таймлайн под работами: плейхед идёт за прокруткой, клик по клипу ведёт к нему. Без скрипта работы просто идут подряд.
(function () {
  var d = document, rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  d.documentElement.classList.remove('no-js');
  var seen = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); seen.unobserve(e.target); } });
  }, { threshold: .15 });
  d.querySelectorAll('.rise').forEach(function (el, i) { el.style.transitionDelay = (i % 3) * 70 + 'ms'; seen.observe(el); });
  var work = d.querySelector('.work'), tl = d.querySelector('.timeline'), head = d.querySelector('.playhead'),
    clips = [].slice.call(d.querySelectorAll('.timeline a')), name = d.querySelector('h1');
  function top(i) { return work.offsetTop + i * d.querySelector('.panel').offsetHeight; }
  clips.forEach(function (a, i) {
    a.addEventListener('click', function (e) { e.preventDefault(); scrollTo({ top: top(i), behavior: rm ? 'auto' : 'smooth' }); });
  });
  function frame() {
    var y = scrollY, h = d.querySelector('.panel').offsetHeight, n = clips.length, p = (y - work.offsetTop) / h;
    tl.classList.toggle('on', p > -.5 && p < n - .4);
    var i = Math.max(0, Math.min(n - 1, Math.floor(p + .001))), a = clips[i], f = Math.max(0, Math.min(1, p - i));
    clips.forEach(function (c, k) { c.classList.toggle('now', k === i); });
    head.style.transform = 'translateX(' + (a.offsetLeft + a.offsetWidth * f) + 'px)';
    if (!rm) name.style.transform = 'scale(' + (1 - Math.min(y / innerHeight, 1) * .12) + ')';
  }
  addEventListener('scroll', function () { requestAnimationFrame(frame); }, { passive: true });
  addEventListener('resize', frame);
  frame();
})();
