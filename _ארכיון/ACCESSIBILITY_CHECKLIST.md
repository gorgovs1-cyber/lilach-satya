# רשימת בדיקות נגישות — תבנית לאתרים עבריים RTL
> תקן WCAG 2.1 AA · תקן ישראלי 5568 · תקנות שוויון זכויות לאנשים עם מוגבלות

---

## 1. HTML סמנטי

```html
<!-- שפה וכיוון -->
<html lang="he" dir="rtl">

<!-- Skip link — חובה ראשון ב-body -->
<a class="skip-link" href="#main-content">דלג לתוכן הראשי</a>

<!-- ניווט ראשי -->
<nav id="nav" aria-label="ניווט ראשי">...</nav>

<!-- תוכן ראשי -->
<main id="main-content">
  <section>...</section>
</main>

<!-- פוטר -->
<footer>...</footer>
```

---

## 2. ARIA

### כפתור המבורגר
```html
<button
  id="hamburger"
  aria-label="פתח תפריט"
  aria-expanded="false"
  aria-controls="mm">
  <span></span><span></span><span></span>
</button>
```

### תפריט נייד
```html
<div id="mm" role="dialog" aria-modal="true" aria-label="תפריט ניווט">
  <button id="mmClose" aria-label="סגור">✕</button>
  ...
</div>
```

### טאבים
```html
<!-- JS מוסיף את ה-ARIA דינמית -->
<div class="tabs-list" role="tablist">
  <button class="tab-btn active"
    role="tab"
    id="tab-1"
    aria-controls="panel-1"
    aria-selected="true"
    data-tab="1">...</button>
</div>
<div class="tab-panel active"
  role="tabpanel"
  id="panel-1"
  aria-labelledby="tab-1"
  tabindex="0"
  data-panel="1">...</div>
```

### FAQ אקורדיון
```html
<!-- JS מוסיף role="button" tabindex="0" aria-expanded="false" -->
<div class="faq-q">
  <span>שאלה?</span>
  <div class="faq-icon" aria-hidden="true">+</div>
</div>
```

### אלמנטים דקורטיביים
```html
<!-- אייקונים, אווטארים, מרכאות — להסתיר מקוראי מסך -->
<div class="icon" aria-hidden="true">☸</div>
<div class="avatar" aria-hidden="true">מ</div>
<span class="quote" aria-hidden="true">"</span>
```

### WhatsApp וקישורים צפים
```html
<a href="https://wa.me/..." aria-label="שלחו הודעה בוואטסאפ">...</a>
<a href="accessibility.html" aria-label="הצהרת נגישות">...</a>
```

---

## 3. CSS

```css
/* Skip Link */
.skip-link {
  position: absolute; top: -100%; right: 0;
  background: var(--lavender-d); color: #fff;
  padding: 12px 24px; font-size: 14px; font-weight: 700;
  text-decoration: none; z-index: 9999;
  border-radius: 0 0 8px 8px; transition: top .2s;
}
.skip-link:focus { top: 0; }

/* Focus Visible */
:focus-visible {
  outline: 3px solid var(--lavender-d);
  outline-offset: 3px;
  border-radius: 4px;
}

/* ניגודיות מינימלית — 4.5:1 לטקסט רגיל */
/* בדוק ב: https://webaim.org/resources/contrastchecker/ */
--muted: #6E6780; /* לא בהיר מזה על רקע לבן */

/* כפתור נגישות צף */
.a11y-float {
  position: fixed;
  bottom: 92px; left: 28px; /* מעל WhatsApp */
  z-index: 300;
  width: 52px; height: 52px;
  background: var(--lavender-d);
  color: #fff; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; text-decoration: none;
  box-shadow: 0 4px 16px rgba(122,101,163,.4);
}

/* prefers-reduced-motion — חובה */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
  .rv { opacity: 1; transform: none; transition: none; }
}

/* ניגודיות קישורי פוטר — לא מתחת ל-70% */
.f-links a { color: rgba(255,255,255,.75); }
```

---

## 4. JavaScript

```js
/* ── תפריט נייד ── */
function openMenu() {
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  hamburger.setAttribute('aria-label', 'סגור תפריט');
  mm.classList.add('open');
  mmOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  mm.querySelector('.mm-close').focus();
}
function closeMenu() {
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'פתח תפריט');
  mm.classList.remove('open');
  mmOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

/* ESC סוגר תפריט */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mm.classList.contains('open')) closeMenu();
});

/* Focus trap בתפריט */
mm.addEventListener('keydown', e => {
  if (e.key !== 'Tab') return;
  const focusable = Array.from(mm.querySelectorAll('a,button,[tabindex="0"]')).filter(el => !el.disabled);
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
  else { if (document.activeElement === last) { e.preventDefault(); first.focus(); } }
});

/* ── טאבים — ARIA init ── */
document.querySelector('.tabs-list').setAttribute('role', 'tablist');
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.setAttribute('role', 'tab');
  btn.setAttribute('id', `tab-${btn.dataset.tab}`);
  btn.setAttribute('aria-controls', `panel-${btn.dataset.tab}`);
  btn.setAttribute('aria-selected', btn.classList.contains('active') ? 'true' : 'false');
});
document.querySelectorAll('.tab-panel').forEach(panel => {
  panel.setAttribute('role', 'tabpanel');
  panel.setAttribute('id', `panel-${panel.dataset.panel}`);
  panel.setAttribute('aria-labelledby', `tab-${panel.dataset.panel}`);
  panel.setAttribute('tabindex', '0');
});

/* ניווט חצים בטאבים (RTL: ימין=קודם, שמאל=הבא) */
const tabBtns = Array.from(document.querySelectorAll('.tab-btn'));
tabBtns.forEach((btn, idx) => {
  btn.addEventListener('keydown', e => {
    let next;
    if (e.key === 'ArrowRight')     next = tabBtns[(idx - 1 + tabBtns.length) % tabBtns.length];
    else if (e.key === 'ArrowLeft') next = tabBtns[(idx + 1) % tabBtns.length];
    else if (e.key === 'Home')      next = tabBtns[0];
    else if (e.key === 'End')       next = tabBtns[tabBtns.length - 1];
    if (next) { e.preventDefault(); next.click(); next.focus(); }
  });
});

/* ── FAQ — ARIA init ── */
document.querySelectorAll('.faq-q').forEach(q => {
  q.setAttribute('role', 'button');
  q.setAttribute('tabindex', '0');
  q.setAttribute('aria-expanded', 'false');
  const icon = q.querySelector('.faq-icon');
  if (icon) icon.setAttribute('aria-hidden', 'true');

  function toggleFaq() {
    const item = q.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });
    if (!wasOpen) { item.classList.add('open'); q.setAttribute('aria-expanded', 'true'); }
  }
  q.addEventListener('click', toggleFaq);
  q.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFaq(); }
  });
});
```

---

## 5. חובות חוקיות (ישראל)

### הצהרת נגישות — accessibility.html
חובה לפי תקנות שוויון זכויות לאנשים עם מוגבלות (2013).

**תוכן חובה:**
- רמת הנגישות (AA לפי WCAG 2.1)
- מה נעשה לשיפור הנגישות
- מגבלות ידועות
- תאימות לדפדפנים וטכנולוגיות עזר
- בסיס חוקי
- פרטי קשר לדיווח על בעיות (שם, טלפון, אימייל)
- תאריך עדכון אחרון

### כפתור נגישות צף
```html
<a class="a11y-float" href="accessibility.html" aria-label="הצהרת נגישות"
  style="position:fixed;bottom:92px;left:28px;z-index:300;...">
  <!-- SVG של סמל נגישות WCAG -->
  <svg aria-hidden="true" ...>...</svg>
</a>
```

### קישור בפוטר
```html
<li><a href="accessibility.html">הצהרת נגישות</a></li>
```

---

## 6. Favicon ו-Open Graph

```html
<head>
  <title>שם העסק | תחום</title>

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="logo.png">
  <link rel="apple-touch-icon" href="logo.png">
  <meta name="apple-mobile-web-app-title" content="שם קצר">

  <!-- SEO -->
  <meta name="description" content="תיאור האתר עד 160 תווים">

  <!-- Open Graph — לשיתוף בוואטסאפ/אינסטגרם -->
  <meta property="og:title" content="שם העסק | תחום">
  <meta property="og:description" content="תיאור קצר">
  <meta property="og:image" content="https://domain.com/logo.png">
  <meta property="og:url" content="https://domain.com">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="he_IL">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:image" content="https://domain.com/logo.png">
</head>
```

---

## 7. רשימת בדיקות לפני השקה

### בדיקות ידניות
- [ ] ניווט מקלדת בלבד (Tab, Enter, Space, Esc, חצים)
- [ ] Skip link מופיע בלחיצת Tab ראשונה
- [ ] Focus נראה בכל אלמנט אינטראקטיבי
- [ ] תפריט נייד — פוקוס נשאר בפנים, ESC סוגר
- [ ] טאבים — חצים עובדים
- [ ] FAQ — Enter/Space פותחים/סוגרים
- [ ] כל התמונות עם alt מתאים
- [ ] אלמנטים דקורטיביים עם aria-hidden

### כלים אוטומטיים
- [ ] [WAVE](https://wave.webaim.org) — בדיקת נגישות כללית
- [ ] [Contrast Checker](https://webaim.org/resources/contrastchecker/) — ניגודיות צבעים
- [ ] [axe DevTools](https://www.deque.com/axe/) — תוסף Chrome
- [ ] VoiceOver (Mac/iOS) או NVDA (Windows) — קורא מסך

### בדיקת ניגודיות מינימום
| שימוש | יחס מינימלי |
|-------|------------|
| טקסט רגיל | 4.5:1 |
| טקסט גדול (18px+) | 3:1 |
| רכיבי UI (כפתורים, קווים) | 3:1 |

---

## 8. CNAME ו-GitHub Pages

```
# קובץ CNAME בשורש הריפו
domain.com
```

### DNS Records ב-Namecheap (או כל רשם)
| Type | Host | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | username.github.io |

---

*תבנית זו נבנתה בפרויקט lilachhazan.com — יוני 2026*
