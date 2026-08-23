/* Cookie consent gate — blocks Google Analytics (GA4) until the visitor
   actively accepts, per Amendment 13 to the Israeli Privacy Protection Law.
   Reopen anytime via window.openCookieSettings(). */
(function () {
  var GA_ID = 'G-P2RDLBCBY3';
  var STORAGE_KEY = 'cookie_consent';

  function loadGA() {
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  function getConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function setConsent(v) {
    try { localStorage.setItem(STORAGE_KEY, v); } catch (e) {}
  }

  function injectStyles() {
    if (document.getElementById('cc-styles')) return;
    var css = ''
      + '#cc-banner{position:fixed;inset-inline:0;bottom:0;z-index:9999;'
      + 'background:var(--white,#FFFBFE);border-top:1px solid var(--line,#E0D5EC);'
      + 'box-shadow:0 -4px 24px rgba(42,36,56,.12);padding:20px 24px;'
      + 'display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between;'
      + 'font-family:"Heebo",sans-serif;direction:rtl;}'
      + '#cc-banner p{margin:0;color:var(--ink,#2A2438);font-size:14px;line-height:1.6;flex:1 1 320px;}'
      + '#cc-banner a{color:var(--lavender-d,#7A65A3);}'
      + '#cc-actions{display:flex;gap:10px;flex-shrink:0;}'
      + '#cc-actions button{font-family:inherit;font-size:14px;font-weight:600;padding:10px 20px;'
      + 'border-radius:999px;border:1px solid var(--lavender-d,#7A65A3);cursor:pointer;transition:opacity .2s;}'
      + '#cc-accept{background:var(--lavender-d,#7A65A3);color:#fff;}'
      + '#cc-decline{background:transparent;color:var(--lavender-d,#7A65A3);}'
      + '#cc-banner button:hover{opacity:.85;}'
      + '@media (max-width:640px){#cc-banner{flex-direction:column;align-items:stretch;text-align:center;}}';
    var style = document.createElement('style');
    style.id = 'cc-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function hideBanner() {
    var el = document.getElementById('cc-banner');
    if (el) el.remove();
  }

  function showBanner() {
    if (document.getElementById('cc-banner')) return;
    injectStyles();
    var el = document.createElement('div');
    el.id = 'cc-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'הגדרות עוגיות');
    el.innerHTML =
      '<p>אנחנו משתמשים בעוגיית אנליטיקס (Google Analytics) כדי להבין איך משתמשים באתר ולשפר אותו. '
      + 'אפשר לאשר או לדחות, ולשנות את ההחלטה בכל עת דרך &quot;הגדרות עוגיות&quot; בתחתית האתר. '
      + 'לפרטים: <a href="privacy.html">מדיניות פרטיות</a>.</p>'
      + '<div id="cc-actions">'
      + '<button id="cc-decline" type="button">דחייה</button>'
      + '<button id="cc-accept" type="button">אישור</button>'
      + '</div>';
    document.body.appendChild(el);

    document.getElementById('cc-accept').addEventListener('click', function () {
      setConsent('granted');
      loadGA();
      hideBanner();
    });
    document.getElementById('cc-decline').addEventListener('click', function () {
      setConsent('denied');
      hideBanner();
    });
  }

  window.openCookieSettings = function () {
    showBanner();
  };

  function init() {
    var consent = getConsent();
    if (consent === 'granted') {
      loadGA();
    } else if (consent === 'denied') {
      // respect the visitor's earlier choice — do nothing
    } else {
      showBanner();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
