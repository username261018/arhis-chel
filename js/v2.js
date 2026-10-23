(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;

  var top = document.getElementById('top');
  var footer = document.querySelector('.footer');
  var sync = function () {
    if (top) root.style.setProperty('--top-h', top.offsetHeight + 'px');
    if (footer) document.body.style.setProperty('--pw', footer.offsetTop + 'px');
  };
  sync();
  window.addEventListener('resize', sync);
  window.addEventListener('load', sync);
  if ('ResizeObserver' in window) new ResizeObserver(sync).observe(document.body);

  /* menu */
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu');
  if (burger && menu) {
    var setOpen = function (open) {
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Меню');
      menu.hidden = !open;
      sync();
    };
    burger.addEventListener('click', function () { setOpen(burger.getAttribute('aria-expanded') !== 'true'); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { setOpen(false); burger.focus(); } });
    window.matchMedia('(min-width: 961px)').addEventListener('change', function (m) { if (m.matches) setOpen(false); });
  }

  /* hero card rises, tilts under a precise pointer */
  var lift = document.getElementById('lift');
  if (lift) {
    var card = lift.querySelector('.lift__card');
    var shine = lift.querySelector('.lift__shine');
    if (reduce) lift.classList.add('is-up');
    else requestAnimationFrame(function () { requestAnimationFrame(function () { lift.classList.add('is-up'); }); });
    if (fine && !reduce && card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.style.transition = 'transform .12s linear';
        card.style.transform = 'rotateY(' + ((x - .5) * 12).toFixed(2) + 'deg) rotateX(' + ((.5 - y) * 10).toFixed(2) + 'deg)';
        shine.style.setProperty('--sx', (x * 100).toFixed(1) + '%');
        shine.style.setProperty('--sy', (y * 100).toFixed(1) + '%');
      });
      card.addEventListener('pointerleave', function () { card.style.transition = ''; card.style.transform = ''; });
      card.addEventListener('pointerdown', function (e) {
        var r = card.getBoundingClientRect();
        var ring = document.createElement('span');
        ring.className = 'ring';
        ring.style.left = (e.clientX - r.left) + 'px';
        ring.style.top = (e.clientY - r.top) + 'px';
        card.appendChild(ring);
        ring.addEventListener('animationend', function () { ring.remove(); });
      });
    }
  }

  /* slide cards rise on entry */
  var cards = document.querySelectorAll('.slide__card');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.remove('is-low'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    cards.forEach(function (c) {
      var r = c.getBoundingClientRect();
      if (r.top > window.innerHeight) { c.classList.add('is-low'); io.observe(c); }
    });
  }

  /* carousels: buttons, keyboard, swipe (native scroll), dots */
  document.querySelectorAll('.carousel').forEach(function (car) {
    var track = car.querySelector('.carousel__track');
    var slides = Array.prototype.slice.call(track.children);
    var prev = car.querySelector('[data-dir="-1"]');
    var next = car.querySelector('[data-dir="1"]');
    var dotsBox = car.querySelector('.carousel__dots');
    var dots = slides.map(function () { var d = document.createElement('span'); dotsBox.appendChild(d); return d; });
    var step = function () { return slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth; };
    var index = function () { return Math.round(track.scrollLeft / step()); };
    var update = function () {
      var max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
      var i = track.scrollLeft >= max ? slides.length - 1 : index();
      dots.forEach(function (d, k) { d.classList.toggle('on', k === i); });
      dotsBox.style.visibility = max > 2 ? 'visible' : 'hidden';
    };
    var go = function (dir) {
      track.scrollBy({ left: dir * step(), behavior: reduce ? 'auto' : 'smooth' });
    };
    prev.addEventListener('click', function () { go(-1); });
    next.addEventListener('click', function () { go(1); });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  /* map loads on demand */
  var load = document.querySelector('.map__load');
  if (load) load.addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.src = load.getAttribute('data-src');
    f.title = 'Arhis на карте';
    f.setAttribute('allowfullscreen', '');
    load.parentNode.appendChild(f);
    load.remove();
  });
})();
