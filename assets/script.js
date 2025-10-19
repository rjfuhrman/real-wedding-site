// Parallax hint: move layers slightly on scroll
const layers = [...document.querySelectorAll('.layer')];
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  layers.forEach(el => {
    const speed = el.classList.contains('layer-back') ? 0.08 : el.classList.contains('layer-front') ? 0.16 : 0.24;
    el.style.transform = `translate3d(${-y*0.02}px, ${y*speed}px, 0)`;
  });
});

// Intro plays once per session
(function introOnce(){
  const el = document.getElementById('intro');
  if (!el) return;
  const already = sessionStorage.getItem('introPlayed') === '1';
  if (already) { el.classList.add('hidden'); return; }
  const finish = () => { el.classList.add('hidden'); sessionStorage.setItem('introPlayed', '1'); };
  document.getElementById('intro-enter')?.addEventListener('click', finish);
  setTimeout(finish, 5000);
})();