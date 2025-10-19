// Parallax hint
const layers = [...document.querySelectorAll('.layer')];
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  layers.forEach(el => {
    const speed = el.classList.contains('layer-back') ? 0.08 : el.classList.contains('layer-front') ? 0.16 : 0.24;
    el.style.transform = `translate3d(${-y*0.02}px, ${y*speed}px, 0)`;
  });
});

// Intro once per session
(function introOnce(){
  const el = document.getElementById('intro');
  if (!el) return;
  const already = sessionStorage.getItem('introSeen_v3') === '1';
  if (already) { el.classList.add('hidden'); return; }
  const finish = () => { el.classList.add('hidden'); sessionStorage.setItem('introSeen_v3','1'); };
  document.getElementById('intro-enter')?.addEventListener('click', finish);
  setTimeout(finish, 4800);
})();

// Easter egg
document.addEventListener('click', (e) => {
  if (!e.target.closest('.pinecone')) return;
  document.documentElement.classList.toggle('campfire');
});

// ---- Photo Reel ----
(async function initReel(){
  const reel = document.getElementById('photo-reel');
  if (!reel) return;
  let items = [];
  try {
    const res = await fetch('/assets/photos/reel.json', {cache:'no-store'});
    items = await res.json();
  } catch(e){
    // fallback sample
    items = [
      {"src":"/assets/photos/photo1.jpg","caption":"Trail selfie"},
      {"src":"/assets/photos/photo2.jpg","caption":"Sunset"},
      {"src":"/assets/photos/photo3.jpg","caption":"Snow day"},
      {"src":"/assets/photos/photo4.jpg","caption":"Downtown Durango"}
    ];
  }
  reel.innerHTML = items.map((p,i)=>`<figure><img src="${p.src}" alt="${p.caption||''}" data-idx="${i}"><figcaption>${p.caption||''}</figcaption></figure>`).join('');

  // Lightbox
  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('.lb-img');
  const btnClose = lb.querySelector('.lb-close');
  const btnPrev = lb.querySelector('.lb-prev');
  const btnNext = lb.querySelector('.lb-next');
  let idx = 0;

  function open(i){ idx=i; lbImg.src = items[idx].src; lbImg.alt = items[idx].caption||''; lb.classList.add('open'); lb.setAttribute('aria-hidden','false'); }
  function close(){ lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); }
  function prev(){ open((idx-1+items.length)%items.length); }
  function next(){ open((idx+1)%items.length); }

  reel.addEventListener('click', e => { const img = e.target.closest('img[data-idx]'); if(img) open(parseInt(img.dataset.idx,10)); });
  btnClose.addEventListener('click', close); btnPrev.addEventListener('click', prev); btnNext.addEventListener('click', next);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => { if (!lb.classList.contains('open')) return; if (e.key==='Escape') close(); if (e.key==='ArrowLeft') prev(); if (e.key==='ArrowRight') next(); });

  // Autoplay (scroll to next)
  const btnPrevCtl = document.getElementById('reel-prev');
  const btnNextCtl = document.getElementById('reel-next');
  const btnPause = document.getElementById('reel-pause');
  let playing = true;
  let timer = null;

  function scrollByOne(dir=1){
    const card = reel.querySelector('figure');
    if (!card) return;
    const w = card.getBoundingClientRect().width + parseFloat(getComputedStyle(reel).gap || 0);
    reel.scrollBy({left: dir * w, behavior:'smooth'});
  }
  function play(){ stop(); timer = setInterval(()=>scrollByOne(1), 2800); playing=true; btnPause.textContent='Pause'; }
  function stop(){ if (timer) clearInterval(timer); timer=null; playing=false; btnPause.textContent='Play'; }

  btnPrevCtl.addEventListener('click', ()=>scrollByOne(-1));
  btnNextCtl.addEventListener('click', ()=>scrollByOne(1));
  btnPause.addEventListener('click', ()=> playing ? stop() : play());

  reel.addEventListener('mouseenter', stop);
  reel.addEventListener('mouseleave', play);

  play();
})();
