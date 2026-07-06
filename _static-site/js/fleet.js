/* ============================================================
   KENI RIDES — Fleet card renderer
   Populates any [data-fleet-grid] element from window.KENI_BIKES.
   Options:
     data-limit="3"                 → only first N bikes
     data-only="slug-a,slug-b"      → specific bikes, in order
     data-exclude="slug"            → skip one bike (detail page)
   ============================================================ */
(function () {
  'use strict';

  var ICONS = {
    engine:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/></svg>',
    power:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg>',
    tank:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22c4 0 7-3.1 7-7 0-4.5-4.6-9.7-6.3-11.5a1 1 0 0 0-1.4 0C9.6 5.3 5 10.5 5 15c0 3.9 3 7 7 7Z"/></svg>'
  };

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  function cardHTML(bike) {
    var href = 'motorcycle.html?bike=' + encodeURIComponent(bike.slug);
    var img = window.KENI_BIKE_IMG(bike.slug);
    return (
      '<article class="bike-card" data-reveal>' +
      '<a class="bike-card-media" href="' + href + '" tabindex="-1" aria-hidden="true">' +
      '<span class="bike-badge">' + esc(bike.category) + '</span>' +
      '<img src="' + img + '" alt="' + esc(bike.name) + '" loading="lazy" width="800" height="600" data-placeholder-label="' + esc(bike.short) + '">' +
      '</a>' +
      '<div class="bike-card-body">' +
      '<h3><a href="' + href + '">' + esc(bike.name) + '</a></h3>' +
      '<div class="bike-card-specs">' +
      '<span>' + ICONS.engine + esc(bike.engine) + '</span>' +
      '<span>' + ICONS.power + esc(bike.power) + '</span>' +
      '<span>' + ICONS.tank + esc(bike.tank) + '</span>' +
      '</div>' +
      '<div class="bike-card-foot">' +
      '<p class="price"><small>From</small><strong>&euro;' + bike.price + ' <em>/ day</em></strong></p>' +
      '<a class="btn btn-ghost" href="' + href + '">View &amp; Book</a>' +
      '</div>' +
      '</div>' +
      '</article>'
    );
  }

  document.querySelectorAll('[data-fleet-grid]').forEach(function (grid) {
    var bikes = (window.KENI_BIKES || []).slice();

    var only = grid.dataset.only;
    if (only) {
      var order = only.split(',').map(function (s) { return s.trim(); });
      bikes = order
        .map(function (slug) { return window.KENI_GET_BIKE(slug); })
        .filter(Boolean);
    }

    var exclude = grid.dataset.exclude;
    if (exclude) {
      bikes = bikes.filter(function (b) { return b.slug !== exclude; });
    }

    var limit = parseInt(grid.dataset.limit, 10);
    if (limit) bikes = bikes.slice(0, limit);

    grid.innerHTML = bikes.map(cardHTML).join('');

    // Re-arm scroll reveal for injected cards
    var step = parseFloat(grid.dataset.stagger) || 0.07;
    var cards = grid.querySelectorAll('[data-reveal]');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if ('IntersectionObserver' in window && !reduceMotion) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
      );
      cards.forEach(function (card, i) {
        card.style.setProperty('--reveal-delay', ((i % 3) * step).toFixed(2) + 's');
        io.observe(card);
      });
    } else {
      cards.forEach(function (card) { card.classList.add('in-view'); });
    }
  });
})();
