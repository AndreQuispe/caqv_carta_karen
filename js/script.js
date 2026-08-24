/* ============================================================
   Carta digital — interacciones
   Sin dependencias. Todo degrada con elegancia.
   ============================================================ */
(function () {
  'use strict';

  var body     = document.body;
  var welcome  = document.getElementById('welcome');
  var startBtn = document.getElementById('start');
  var music    = document.getElementById('music');
  var musicBtn = document.getElementById('musicBtn');
  var label    = document.getElementById('musicLabel');
  var eq       = document.getElementById('eq');
  var audio    = document.getElementById('audio');
  var bar      = document.querySelector('.progress__bar');

  var VOLUME = 0.7;   // volumen final de la canción
  var playing = false;
  var fadeId  = null;

  /* ── Apariciones al hacer scroll ─────────────────────── */
  var reveals = [].slice.call(document.querySelectorAll('.reveal'));

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    reveals.forEach(function (n) { io.observe(n); });
  } else {
    reveals.forEach(function (n) { n.classList.add('is-in'); });
  }

  // Red de seguridad: nada puede quedar invisible.
  setTimeout(function () {
    reveals.forEach(function (n) { n.classList.add('is-in'); });
  }, 6000);

  /* ── Hilo de progreso ────────────────────────────────── */
  function onScroll() {
    if (!bar) return;
    var sc = document.scrollingElement || document.documentElement;
    var h  = sc.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? Math.min(1, Math.max(0, sc.scrollTop / h)) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  /* ── Audio ───────────────────────────────────────────── */
  function setPlaying(on) {
    playing = on;
    if (label) label.textContent = on ? 'Música' : 'Silencio';
    if (musicBtn) musicBtn.setAttribute('aria-label', on ? 'Silenciar música' : 'Activar música');
    if (eq) eq.classList.toggle('is-paused', !on);
  }

  function fadeTo(target) {
    if (!audio) return;
    clearInterval(fadeId);
    fadeId = setInterval(function () {
      var step = target > audio.volume ? 0.05 : -0.05;
      var next = audio.volume + step;
      if ((step > 0 && next >= target) || (step < 0 && next <= target)) {
        audio.volume = target;
        clearInterval(fadeId);
        if (target === 0) audio.pause();
      } else {
        audio.volume = Math.min(1, Math.max(0, next));
      }
    }, 110);
  }

  function play() {
    if (!audio) { setPlaying(false); return; }
    audio.volume = 0;
    var p = audio.play();
    if (p && p.catch) {
      p.then(function () { setPlaying(true); fadeTo(VOLUME); })
       .catch(function () { setPlaying(false); });   // el navegador bloqueó el autoplay
    } else {
      setPlaying(true);
      fadeTo(VOLUME);
    }
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', function () {
      if (playing) { setPlaying(false); fadeTo(0); }
      else { play(); }
    });
  }

  /* ── Apertura ────────────────────────────────────────── */
  function open() {
    welcome.classList.add('is-hidden');
    body.classList.remove('is-locked');
    body.classList.add('is-open');
    if (music) music.hidden = false;
    window.scrollTo(0, 0);
    onScroll();
    play();                                        // gesto del usuario ⇒ el audio sí arranca
    setTimeout(function () { welcome.remove(); }, 1300);
  }

  if (startBtn) startBtn.addEventListener('click', open, { once: true });

  onScroll();
})();
