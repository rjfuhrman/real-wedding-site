(function introOnce(){
  const el = document.getElementById('intro');
  if (!el) return;
  const already = sessionStorage.getItem('introPlayed') === '1';
  if (already) { el.classList.add('hidden'); return; }
  const finish = () => { el.classList.add('hidden'); sessionStorage.setItem('introPlayed', '1'); };
  const btn = document.getElementById('intro-enter'); if (btn) btn.addEventListener('click', finish);
  setTimeout(finish, 5000);
})();