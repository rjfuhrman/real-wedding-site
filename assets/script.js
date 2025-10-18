// Toggle "goofy mode" when clicking the pinecone
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.pinecone');
  if (!btn) return;
  document.documentElement.classList.toggle('goofy');
  emojiBurst(btn);
});

// Hidden keyboard: type "party" to trigger confetti
let seq = '';
document.addEventListener('keydown', (e) => {
  seq += e.key.toLowerCase();
  if (seq.length > 5) seq = seq.slice(-5);
  if (seq === 'party') {
    emojiBurst(document.body, 120);
    seq = '';
  }
});

// Tiny emoji confetti
function emojiBurst(target, count=60){
  const rect = target.getBoundingClientRect();
  const cx = rect.left + rect.width/2;
  const cy = rect.top + rect.height/2;
  const emojis = ['🎉','✨','🌲','💍','🎂','🪩','🥂','🌄'];

  for (let i=0;i<count;i++){
    const span = document.createElement('span');
    span.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    span.style.position = 'fixed';
    span.style.left = cx + 'px';
    span.style.top = cy + 'px';
    span.style.pointerEvents = 'none';
    span.style.zIndex = 9999;
    span.style.fontSize = (16 + Math.random()*20) + 'px';
    document.body.appendChild(span);

    const angle = Math.random()*2*Math.PI;
    const dist = 40 + Math.random()*260;
    const dx = Math.cos(angle)*dist;
    const dy = Math.sin(angle)*dist;
    const duration = 700 + Math.random()*900;

    span.animate([
      { transform: 'translate(0,0)', opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px) rotate(${(Math.random()*360)|0}deg)`, opacity: 0 }
    ], { duration, easing: 'ease-out' }).onfinish = () => span.remove();
  }
}
