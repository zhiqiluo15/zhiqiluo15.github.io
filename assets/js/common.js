/* ============================================================
   灵弦华夏 · 全站公共脚本（common.js）
   ------------------------------------------------------------
   作用范围：所有页面共用
   提供内容：
     1. 星空背景自动生成（依据 data-stars 属性配置数量）
     2. 页脚日期自动填充（id="date"）
     3. Escape 键关闭叠加层（.overlay.open）
     4. window.LXHX 命名空间——全站扩展接口
   ------------------------------------------------------------
   扩展接口用法：
     // 注册页面初始化钩子（页面可挂载自定义逻辑）
     LXHX.onReady(function() { ... });
     // 读取全局配置
     LXHX.config.starCount;
   ============================================================ */

(function (global) {
  'use strict';

  var LXHX = {
    config: {
      starCount: 80,        // 默认星星数量
      starSizeMin: 1,       // 星星最小半径
      starSizeRange: 2.5,   // 星星半径浮动范围
      durationMin: 2,       // 闪烁周期下限
      durationRange: 4,      // 闪烁周期浮动范围
      minOpacityBase: 0.1,  // 最低不透明度基准
      maxOpacityBase: 0.5    // 最高不透明度基准
    },
    _readyCallbacks: [],
    onReady: function (fn) { this._readyCallbacks.push(fn); }
  };

  /* ---------- 星空背景生成 ---------- */
  function generateStars() {
    var container = document.getElementById('stars');
    if (!container) return;

    // 允许页面通过 data-stars 属性覆盖星星数量
    var override = container.getAttribute('data-stars');
    var count = override ? parseInt(override, 10) : LXHX.config.starCount;

    for (var i = 0; i < count; i++) {
      var star = document.createElement('div');
      star.className = 'star';
      var size = Math.random() * LXHX.config.starSizeRange + LXHX.config.starSizeMin;
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.setProperty('--duration',
        (Math.random() * LXHX.config.durationRange + LXHX.config.durationMin) + 's');
      star.style.setProperty('--min-opacity',
        (Math.random() * 0.2 + LXHX.config.minOpacityBase).toString());
      star.style.setProperty('--max-opacity',
        (Math.random() * 0.4 + LXHX.config.maxOpacityBase).toString());
      container.appendChild(star);
    }
  }

  /* ---------- 页脚日期填充 ---------- */
  function fillDate() {
    var dateEl = document.getElementById('date');
    if (!dateEl) return;
    var now = new Date();
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, '0');
    var day = String(now.getDate()).padStart(2, '0');
    dateEl.textContent = year + '-' + month + '-' + day;
  }

  /* ---------- Escape 键关闭叠加层 ---------- */
  function bindEscape() {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var openOverlays = document.querySelectorAll('.overlay.open');
        if (openOverlays.length > 0) {
          openOverlays.forEach(function (ol) { ol.classList.remove('open'); });
          e.preventDefault();
        }
      }
    });
  }

  /* ---------- 初始化 ---------- */
  function init() {
    generateStars();
    fillDate();
    bindEscape();
    // 触发页面挂载的扩展钩子
    LXHX._readyCallbacks.forEach(function (fn) {
      try { fn(); } catch (e) { console.error('[LXHX] onReady error:', e); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.LXHX = LXHX;
})(window);
