/* VUCCIRIA — la criée, révélations, typo réactive au défilement */
(function () {
  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mode QA : captures d'écran sans animations */
  var qa = new URLSearchParams(location.search).has('qa');
  if (qa) {
    document.documentElement.classList.add('qa');
    reduit = true;
  }

  /* ---- Animation d'entrée « la criée » ---- */
  var criee = document.getElementById('criee');
  if (criee) {
    var deja = sessionStorage.getItem('vucciria-criee');
    if (reduit || deja) {
      criee.classList.add('criee-finie');
    } else {
      criee.classList.add('criee-anime');
      sessionStorage.setItem('vucciria-criee', '1');
      criee.addEventListener('animationend', function (e) {
        if (e.animationName === 'criee-part') criee.classList.add('criee-finie');
      });
      /* filet de sécurité si une animation est interrompue */
      setTimeout(function () { criee.classList.add('criee-finie'); }, 3000);
    }
  }

  if (reduit) return;

  /* ---- Révélations au scroll ---- */
  var cibles = document.querySelectorAll(
    '.etiquette, .titre, .nom-corps, .nom-lieu, .etal-item, .carte-bloc, ' +
    '.carte-appel, .lieu-corps, .lieu-photo, .lieu-avis, .infos-bloc, .carte-note'
  );
  cibles.forEach(function (el) { el.classList.add('revele'); });

  var obsRevele = new IntersectionObserver(function (entrees) {
    entrees.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obsRevele.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  cibles.forEach(function (el) { obsRevele.observe(el); });

  /* ---- Typo réactive au défilement ----
     Les grands titres [data-stretch] s'élargissent légèrement
     quand ils entrent dans le viewport (axe wdth d'Archivo). */
  var stretchables = document.querySelectorAll('[data-stretch]');
  stretchables.forEach(function (el) {
    var base = parseFloat(getComputedStyle(el).fontStretch) || 100;
    el.dataset.stretchBase = base;
  });
  var obsStretch = new IntersectionObserver(function (entrees) {
    entrees.forEach(function (e) {
      var base = parseFloat(e.target.dataset.stretchBase) || 100;
      e.target.style.fontStretch = (e.isIntersecting ? Math.min(base + 10, 125) : base) + '%';
    });
  }, { threshold: 0.4 });
  stretchables.forEach(function (el) { obsStretch.observe(el); });
})();
