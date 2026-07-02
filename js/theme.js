/* === theme.js === */
(function () {
    // 生成星空
    const starsContainer = document.getElementById('stars');
    if (starsContainer) {
        for (let i = 0; i < 150; i++) {
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
    }

    // 更新页脚日期
    const dateEl = document.getElementById('date');
    if (dateEl) {
        const now = new Date();
        dateEl.textContent = now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0');
    }
})();
