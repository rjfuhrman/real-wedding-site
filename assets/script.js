(function introOnce(){
  const el = document.getElementById('intro');
  if (!el) return;
  const already = sessionStorage.getItem('introPlayed') === '1';
  if (already) { el.classList.add('hidden'); return; }
  document.documentElement.classList.add('intro-lock');
  document.body.classList.add('intro-lock');
  const finish = () => {
    el.classList.add('hidden');
    document.documentElement.classList.remove('intro-lock');
    document.body.classList.remove('intro-lock');
    sessionStorage.setItem('introPlayed', '1');
  };
  const btn = document.getElementById('intro-enter');
  if (btn) btn.addEventListener('click', finish);
  setTimeout(finish, 4000);
})();