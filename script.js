(function() {
  const starsContainer = document.getElementById('stars');
  const starCount = 150;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2 + 1;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.setProperty('--duration', (Math.random() * 3 + 2) + 's');
    star.style.setProperty('--min-opacity', Math.random() * 0.3 + 0.1);
    star.style.setProperty('--max-opacity', Math.random() * 0.5 + 0.5);
    star.style.animationDelay = Math.random() * 5 + 's';
    starsContainer.appendChild(star);
  }

  const dateEl = document.getElementById('date');
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  dateEl.textContent = year + '-' + month + '-' + day;

  // 全局 Escape 键（预留给子页面的叠加层关闭）
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const openOverlays = document.querySelectorAll('.overlay.open');
      if (openOverlays.length > 0) {
        openOverlays.forEach(ol => ol.classList.remove('open'));
        e.preventDefault();
      }
    }
  });
})();