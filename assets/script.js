// Parallax layers
const layers = [...document.querySelectorAll('.layer')];
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  layers.forEach(el => {
    const speed = el.classList.contains('layer-back') ? 0.08 : el.classList.contains('layer-front') ? 0.16 : 0.24;
    el.style.transform = `translate3d(${-y*0.02}px, ${y*speed}px, 0)`;
  });
});

// Pinecone toggles campfire mode + emoji confetti
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.pinecone');
  if (!btn) return;
  document.documentElement.classList.toggle('campfire');
  emojiBurst(btn, 90);
});

// Hidden keyboard: type "party" to trigger confetti
let seq = '';
document.addEventListener('keydown', (e) => {
  seq += e.key.toLowerCase();
  if (seq.length > 5) seq = seq.slice(-5);
  if (seq === 'party') { emojiBurst(document.body, 140); seq=''; }
});

function emojiBurst(target, count=60){
  const rect = target.getBoundingClientRect();
  const cx = rect.left + rect.width/2;
  const cy = rect.top + rect.height/2;
  const emojis = ['🎉','✨','🌲','⛰️','🔥','💍','🪩','🥂','🌄'];
  for (let i=0;i<count;i++){
    const span = document.createElement('span');
    span.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    span.style.position = 'fixed';
    span.style.left = cx + 'px';
    span.style.top = cy + 'px';
    span.style.pointerEvents = 'none';
    span.style.zIndex = 9999;
    span.style.fontSize = (16 + Math.random()*22) + 'px';
    document.body.appendChild(span);
    const angle = Math.random()*2*Math.PI;
    const dist = 40 + Math.random()*260;
    const dx = Math.cos(angle)*dist;
    const dy = Math.sin(angle)*dist;
    const duration = 800 + Math.random()*1100;
    span.animate([
      { transform: 'translate(0,0)', opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px) rotate(${(Math.random()*360)|0}deg)`, opacity: 0 }
    ], { duration, easing: 'ease-out' }).onfinish = () => span.remove();
  }
}

// ---- Gallery auto-render + lightbox ----
(async function initGallery(){
  const grid = document.getElementById('gallery-grid');
  if(!grid) return;

  let photos = [];
  try {
    const res = await fetch('assets/photos/photos.json', { cache: 'no-store' });
    photos = await res.json();
  } catch(e){ console.warn('No photos.json found; falling back to default.'); }

  if (!Array.isArray(photos) || photos.length === 0) {
    photos = [{src:'assets/photos/photo1.jpg', alt:'Photo'}];
  }

  grid.innerHTML = photos.map((p,i)=>{
    const r = Math.random() < .5 ? 0 : 1;
    return `<figure style="--r:${r}"><img src="${p.src}" alt="${p.alt||''}" loading="lazy" data-idx="${i}"></figure>`;
  }).join('');

  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('.lb-img');
  const btnClose = lb.querySelector('.lb-close');
  const btnPrev = lb.querySelector('.lb-prev');
  const btnNext = lb.querySelector('.lb-next');
  let idx = 0;

  function open(i){
    idx = i;
    lbImg.src = photos[idx].src;
    lbImg.alt = photos[idx].alt || '';
    lb.classList.add('open');
    lb.setAttribute('aria-hidden','false');
  }
  function close(){
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden','true');
  }
  function prev(){ open((idx - 1 + photos.length) % photos.length); }
  function next(){ open((idx + 1) % photos.length); }

  grid.addEventListener('click', e => {
    const img = e.target.closest('img[data-idx]');
    if (!img) return;
    open(parseInt(img.dataset.idx, 10));
  });
  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', prev);
  btnNext.addEventListener('click', next);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });
})();