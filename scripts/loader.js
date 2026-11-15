/* ==========================================
   PAGE LOADER — "Load line"
   Include in <head> (not deferred) right after styles/loader.css so it
   covers the page from the first paint. Shows once per browser session;
   set ALWAYS to true to show it on every page load.
   Fires `pp:loaded` on document when the page is revealed.
========================================== */
(function () {
  var ALWAYS = false;          // true = show on every page, not just the first of a visit
  var MIN_MS = 2200;           // shortest time the loader stays up
  var MAX_MS = 7000;           // give up waiting for slow assets after this
  var KEY = 'pp-loader-seen';

  try { if (!ALWAYS && sessionStorage.getItem(KEY)) return; } catch (e) {}

  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  var CHECKS = ['Certificates', 'Hull & structure', 'Fire safety', 'Life-saving', 'MARPOL', 'ISM code', 'Navigation', 'Crew & MLC'];
  var START = 9;               // deficiencies at the start of the count

  var el = document.createElement('div');
  el.className = 'pp-loader';
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.setAttribute('aria-label', 'Loading Port Plus');
  el.innerHTML =
    '<div class="pp-loader__panel">' +
      '<div class="pp-loader__core">' +
        '<svg class="pp-loader__mark" viewBox="0 0 120 120" aria-hidden="true">' +
          '<defs><clipPath id="pp-disc"><circle cx="60" cy="60" r="41"/></clipPath></defs>' +
          '<g clip-path="url(#pp-disc)"><path class="w-back"/><path class="w-front"/></g>' +
          '<circle class="ring" cx="60" cy="60" r="44"/>' +
          '<rect class="bar" x="-6" y="57" width="132" height="6"/>' +
          '<text class="tick" x="10" y="51" text-anchor="end" font-size="13" font-weight="700" font-family="TT Commons,system-ui,sans-serif">Z</text>' +
          '<text class="tick" x="110" y="51" font-size="13" font-weight="700" font-family="TT Commons,system-ui,sans-serif">D</text>' +
        '</svg>' +
        '<div class="pp-loader__count" aria-hidden="true">0' + START + '</div>' +
        '<div class="pp-loader__label" aria-hidden="true"><span class="now">Deficiencies</span><span class="next">Zero Detention</span></div>' +
        '<div class="pp-loader__check" aria-hidden="true">Checking&nbsp;&nbsp;·&nbsp;&nbsp;<b>' + CHECKS[0] + '</b></div>' +
      '</div>' +
      '<div class="pp-loader__foot" aria-hidden="true">' +
        '<span class="pp-loader__brand"><i>Port Plus&nbsp;·&nbsp;</i><b>PSC Intelligence</b></span>' +
        '<span class="pct">000%</span>' +
      '</div>' +
    '</div>' +
    '<svg class="pp-loader__edge" viewBox="0 0 1200 90" preserveAspectRatio="none" aria-hidden="true">' +
      '<path class="e1" d="M0 0 H1200 V52 C1050 92 900 92 750 62 C600 30 450 30 300 62 C180 88 80 88 0 70 Z"/>' +
      '<path class="e2" d="M0 0 H1200 V12 C1050 50 900 52 750 28 C600 4 450 4 300 30 C180 50 80 48 0 30 Z"/>' +
    '</svg>';

  root.classList.add('pp-loading');
  root.appendChild(el);

  var q = function (s) { return el.querySelector(s); };
  var front = q('.w-front'), back = q('.w-back');
  var count = q('.pp-loader__count'), pct = q('.pct'), check = q('.pp-loader__check b');

  var t0 = performance.now(), loaded = false, p = 0, done = false, ci = 0, lastSwap = 0, lastN = START;
  window.addEventListener('load', function () { loaded = true; });
  setTimeout(function () { loaded = true; }, MAX_MS);

  // water surface inside the disc: two sine layers, same idea as the site's swell
  function wave(level, t, amp, shift, speed) {
    var d = '', x, y;
    for (x = 14; x <= 106; x += 4) {
      y = level + (calm ? 0 : amp * Math.sin(x * 0.11 + t * speed + shift) + amp * 0.4 * Math.sin(x * 0.23 - t * speed * 0.7));
      d += (x === 14 ? 'M' : ' L') + x + ' ' + y.toFixed(2);
    }
    return d + ' L106 110 L14 110 Z';
  }

  function frame(now) {
    var t = now - t0;
    // creep toward 90% while assets load, then run to the line
    var target = (loaded && t >= MIN_MS) ? 1 : 0.9 * (1 - Math.exp(-t / (MIN_MS * 0.55)));
    p += (target - p) * (target === 1 ? 0.06 : 0.05);
    if (target === 1 && p > 0.996) p = 1;

    // water rises from the bottom of the disc to the load line (y = 60)
    var level = 104 - 44 * p, amp = 2.6 * (1 - p * 0.55);
    back.setAttribute('d', wave(level - 1.5, t / 1000, amp, 1.7, 2.1));
    front.setAttribute('d', wave(level, t / 1000, amp, 0, 3.2));

    var n = Math.ceil((1 - p) * START - 0.001);  // reaches 00 only when cleared
    if (n !== lastN) { lastN = n; count.textContent = (n < 10 ? '0' : '') + n; }
    pct.textContent = ('00' + Math.round(p * 100)).slice(-3) + '%';

    if (!done && now - lastSwap > 340) {
      lastSwap = now; ci = (ci + 1) % CHECKS.length;
      check.textContent = CHECKS[ci];
    }

    if (p === 1 && !done) { done = true; finish(); }
    if (el.isConnected) requestAnimationFrame(frame);
  }

  function finish() {
    check.parentNode.innerHTML = 'Inspection&nbsp;&nbsp;·&nbsp;&nbsp;<b>Cleared</b>';
    count.textContent = '00';
    el.classList.add('is-clear');
    el.setAttribute('aria-label', 'Loaded');
    setTimeout(function () {
      el.classList.add('is-leaving');
      root.classList.remove('pp-loading');
      setTimeout(function () {
        el.remove();
        try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
        document.dispatchEvent(new CustomEvent('pp:loaded'));
      }, calm ? 450 : 1150);
    }, 750);
  }

  requestAnimationFrame(frame);
})();
