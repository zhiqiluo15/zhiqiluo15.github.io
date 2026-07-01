# 变更日志

> **修改代码前，请先阅读本日志。**  
> 这里记录了设计决策和重构意图，避免重复踩坑或推翻之前的合理选择。

## 2026-07-01

### 重构
- 抽出 `base.css`（全局 reset / 字体）和 `theme.css`（暗色主题套件），页面只需按需引用
- 抽出 `theme.js`（星星生成、日期），与内联 script 告别
- 拆分为两层架构：`base.css` 所有页面共享，`theme.css` + `theme.js` 可选套用

### 清理
- 移除失效的外部资源引用（assets 目录、字体预加载），消除 404 请求
- 清理冗余 CSS（`height: 100%`、`position: relative`、`overflow-x: hidden`、重复 font-family、默认 font-weight）

### 调整
- 删除左上角"灵弦华夏"标题，与 Hero 区域重复
- 删除首页无用的 Escape 键监听
- `index.html` 从 217 行精简到 38 行

### 新增
- 创建 `CHANGELOG.md`，记录设计决策与变更历史
