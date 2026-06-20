window.addEventListener('scroll',()=>
  document.getElementById('nav').classList.toggle('scrolled',scrollY>40));

/* ── Mobile menu ── */
const hamburger = document.getElementById('hamburger');
const mm        = document.getElementById('mm');
const mmOverlay = document.getElementById('mmOverlay');
const mmClose   = document.getElementById('mmClose');

function openMenu(){
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded','true');
  hamburger.setAttribute('aria-label','סגור תפריט');
  mm.classList.add('open');
  mmOverlay.classList.add('open');
  document.body.style.overflow='hidden';
  mm.querySelector('.mm-close').focus();
}
function closeMenu(){
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded','false');
  hamburger.setAttribute('aria-label','פתח תפריט');
  mm.classList.remove('open');
  mmOverlay.classList.remove('open');
  document.body.style.overflow='';
}

hamburger.addEventListener('click', ()=> mm.classList.contains('open') ? closeMenu() : openMenu());
mmClose.addEventListener('click', closeMenu);
mmOverlay.addEventListener('click', closeMenu);
document.querySelectorAll('.mm-links a,.mm-cta').forEach(a=>a.addEventListener('click', closeMenu));

// ESC key closes menu
document.addEventListener('keydown', e=>{
  if(e.key==='Escape' && mm.classList.contains('open')) closeMenu();
});

// Focus trap inside mobile menu
mm.addEventListener('keydown', e=>{
  if(e.key!=='Tab') return;
  const focusable = Array.from(mm.querySelectorAll('a,button,[tabindex="0"]')).filter(el=>!el.disabled);
  const first = focusable[0], last = focusable[focusable.length-1];
  if(e.shiftKey){ if(document.activeElement===first){ e.preventDefault(); last.focus(); } }
  else { if(document.activeElement===last){ e.preventDefault(); first.focus(); } }
});

const io=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting)e.target.classList.add('in');
}),{threshold:.1});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

// Tab ARIA init
const tabList = document.querySelector('.tabs-list');
if(tabList) tabList.setAttribute('role','tablist');
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.setAttribute('role','tab');
  btn.setAttribute('id',`tab-${btn.dataset.tab}`);
  btn.setAttribute('aria-controls',`panel-${btn.dataset.tab}`);
  btn.setAttribute('aria-selected', btn.classList.contains('active') ? 'true' : 'false');
});
document.querySelectorAll('.tab-panel').forEach(panel=>{
  panel.setAttribute('role','tabpanel');
  panel.setAttribute('id',`panel-${panel.dataset.panel}`);
  panel.setAttribute('aria-labelledby',`tab-${panel.dataset.panel}`);
  panel.setAttribute('tabindex','0');
});

document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const id=btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b=>{
      b.classList.remove('active');
      b.setAttribute('aria-selected','false');
    });
    document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    btn.setAttribute('aria-selected','true');
    document.querySelector(`.tab-panel[data-panel="${id}"]`).classList.add('active');
  });
});

// Tab arrow-key navigation (WCAG 2.1 §4.1.2 – RTL: ArrowRight=prev, ArrowLeft=next)
const tabBtns = Array.from(document.querySelectorAll('.tab-btn'));
tabBtns.forEach((btn, idx) => {
  btn.addEventListener('keydown', e => {
    let next;
    if (e.key === 'ArrowRight')      next = tabBtns[(idx - 1 + tabBtns.length) % tabBtns.length];
    else if (e.key === 'ArrowLeft')  next = tabBtns[(idx + 1) % tabBtns.length];
    else if (e.key === 'Home')       next = tabBtns[0];
    else if (e.key === 'End')        next = tabBtns[tabBtns.length - 1];
    if (next) { e.preventDefault(); next.click(); next.focus(); }
  });
});

// FAQ ARIA init
document.querySelectorAll('.faq-q').forEach(q=>{
  q.setAttribute('role','button');
  q.setAttribute('tabindex','0');
  q.setAttribute('aria-expanded','false');
  const icon = q.querySelector('.faq-icon');
  if(icon) icon.setAttribute('aria-hidden','true');
});

document.querySelectorAll('.faq-q').forEach(q=>{
  function toggleFaq(){
    const item = q.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i=>{
      i.classList.remove('open');
      i.querySelector('.faq-q').setAttribute('aria-expanded','false');
    });
    if(!wasOpen){
      item.classList.add('open');
      q.setAttribute('aria-expanded','true');
    }
  }
  q.addEventListener('click', toggleFaq);
  q.addEventListener('keydown', e=>{
    if(e.key==='Enter'||e.key===' '){ e.preventDefault(); toggleFaq(); }
  });
});

function onSend(e){
  e.preventDefault();
  const b=e.target.querySelector('.btn-form');
  b.textContent='✓ ההודעה נשלחה!';
  b.style.background='var(--sage)';
  b.disabled=true;
}