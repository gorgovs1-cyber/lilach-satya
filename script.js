window.addEventListener('scroll',()=>
  document.getElementById('nav').classList.toggle('scrolled',scrollY>40));

const io=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting)e.target.classList.add('in');
}),{threshold:.1});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const id=btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    document.querySelector(`.tab-panel[data-panel="${id}"]`).classList.add('active');
  });
});

document.querySelectorAll('.faq-q').forEach(q=>{
  q.addEventListener('click',()=>{
    const item = q.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
    if(!wasOpen) item.classList.add('open');
  });
});

function onSend(e){
  e.preventDefault();
  const b=e.target.querySelector('.btn-form');
  b.textContent='✓ ההודעה נשלחה!';
  b.style.background='var(--sage)';
  b.disabled=true;
}