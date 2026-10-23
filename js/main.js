(function () {
  var root = document.documentElement;
  var top = document.getElementById('top');
  var syncTop = function () { if (top) root.style.setProperty('--top-h', top.offsetHeight + 'px'); };
  syncTop();
  window.addEventListener('resize', syncTop);

  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu');
  if (!burger || !menu) return;
  var setOpen = function (open) {
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Меню');
    menu.hidden = !open;
    syncTop();
  };
  burger.addEventListener('click', function () { setOpen(burger.getAttribute('aria-expanded') !== 'true'); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { setOpen(false); burger.focus(); } });
  window.matchMedia('(min-width: 961px)').addEventListener('change', function (m) { if (m.matches) setOpen(false); });
})();
