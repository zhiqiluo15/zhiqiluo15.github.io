# 变更日志

> **修改代码前，请先阅读本日志。**  
> 这里记录了设计决策和重构意图，避免重复踩坑或推翻之前的合理选择。

## 模板

```markdown
## YYYY-MM-DD HH:mm

### 新增
- xxx

### 修改
- xxx

### 修复
- xxx

### 重构
- xxx

### 清理
- xxx
```

### 说明
- **日期**：按 `YYYY-MM-DD HH:mm` 格式记录，精确到分钟
- **分类**：每项变更归入对应分类（新增 / 修改 / 修复 / 重构 / 清理）
- **描述**：简要说明变更内容及原因，方便回溯
- **顺序**：最新的变更记录放在最前面

---

## 2026-07-02

### 设计决策
- **分首页 + 同页 Tab 切换**：导航区每个条目维护一个子页面（分首页，如 `role/index.html`），内容内部用 Tab 切换展示不同分类（如人物按主角/配角/反派分组）。同页切换不刷新页面，星空动画无中断
- **Tab 切换优化思路**：
  1. **混合加载策略** — 首屏 Tab 直接写在 HTML 中，其余 Tab 用 `data-src` 标记懒加载，首次切到时才 `fetch` 插入，平衡首屏大小与切换速度
  2. **URL hash 同步** — 切换 Tab 时通过 `history.replaceState` 更新 URL hash，页面加载时读取 hash 恢复状态，使 Tab 状态可分享/收藏
  3. **纯 CSS 过渡动画** — `.tab-panel` 用 `opacity` + `translateY` 过渡，JS 配合 `requestAnimationFrame` 分帧执行 `display: block` 和 `.active`，实现自然淡入上移
  4. **抽通用脚本 `js/tabs.js`** — 所有子页面的 Tab 逻辑提取为通用模块，页面按约定写 `data-tab` 标签即可自动生效，减少重复代码
- 该方案不引入任何框架，保持纯静态站点；待首个子页面（如 role 页）完成后按需落地

### 重构
- 将 `index.html` 中的 CSS 拆分至 `css/base.css`（全局 reset 与基础排版）和 `css/theme.css`（主题视觉，含星空/导航/响应式），方便后续页面共享主题样式
- 将 `index.html` 中的 JavaScript 拆分至 `js/theme.js`（星星生成 + 页脚日期），供所有页面复用
- `index.html` 改为引用外部资源，新增 `meta description` 提升 SEO

### 修改
- 字体优化：移除对 Google Fonts 的外部依赖，马善正书法字体（Ma Shan Zheng）改为自托管 WOFF2 子集文件（共 12 个按 unicode-range 拆分的文件，浏览器按需加载），正文改用系统宋体回退链（STSong / Songti SC / Noto Serif CJK SC），消除 Google Fonts 在国内访问慢或不稳定的瓶颈
