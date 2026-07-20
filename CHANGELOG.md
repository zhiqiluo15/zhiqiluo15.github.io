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

### 设计决策
- xxx

### 清理
- xxx
```

### 说明
- **日期**：按 `YYYY-MM-DD HH:mm` 格式记录，精确到分钟
- **分类**：每项变更归入对应分类（新增 / 修改 / 修复 / 重构 / 设计决策 / 清理）
- **描述**：每条记录必须简要说明**做了什么 + 为什么这样做**，方便回溯决策理由
- **顺序**：最新的变更记录放在最前面

---

## 站点结构

> 最后更新：2026-07-19

### 文件树

```
zhiqiluo15.github.io/
├── index.html                       # 首页（星空 + 导航）
├── word-software.html               # 单词分首页（诗词 + 三入口卡片 + 时间轴）
│
├── word-list.html                   # 统一目录页模板（?category=poem|history|etymology）
├── word-detail.html                 # 统一详情页模板（?id=xxx）
│
├── css/
│   ├── base.css                     # 全局 reset + 基础排版
│   ├── theme.css                    # 主题：星空 / 导航 / 页脚 / 响应式
│   ├── word-software.css            # 单词分首页
│   └── word-template.css            # 统一模板页（目录 + 详情）样式
│
├── js/
│   ├── theme.js                     # 星空生成 + 页脚年份
│   └── supabase.js                  # Supabase 客户端 + 数据查询封装
│
├── fonts/
│   └── MaShanZheng-*.woff2          # 书法字体（12 个子集，按 unicode-range 拆分）
│
├── supabase-setup.sql               # 数据库建表 + 种子数据 SQL 脚本
├── CHANGELOG.md
└── CNAME
```

### 页面层级 & 导航流

```
index.html（首页）
  │
  └── word-software.html（单词分首页）
        ├── 以诗入词
        │   └── word-list.html?category=poem → word-detail.html?id=xxx
        ├── 以史鉴词
        │   └── word-list.html?category=history → word-detail.html?id=xxx
        └── 以词溯源
            └── word-list.html?category=etymology → word-detail.html?id=xxx
```

每级页面末端都有返回上一级链接。

### CSS 引用规则

```
base.css + theme.css      → 所有页面必引
+ word-software.css       → 仅 word-software.html
+ word-template.css       → 仅 word-list.html / word-detail.html
```

### 设计约定

- **零框架**：纯 HTML + CSS + JS，无前端框架
- **数据层**：单词内容存储在 Supabase 数据库，运行时通过 API 查询；`supabase-setup.sql` 为建表+种子数据脚本，存在 GitHub 仓库作为数据蓝图，需在 Supabase SQL Editor 手动执行
- **数据与代码分离**：GitHub 仓库管代码+SQL 脚本，Supabase 管运行时数据。新增内容流程：编辑 SQL → 推 GitHub → 在 Supabase 执行 INSERT
- **三链路统一范式**：目录页用列表条目 + 悬浮左移 + 金线动画；详情页用词卡两列网格布局
- **字体自托管**：Ma Shan Zheng 拆分 12 个 WOFF2 按需加载，正文宋体回退链，不走 Google Fonts
- **导航**：竖排固定右侧，移动端改为底部横排
- **布局单位**：所有内容容器 max-width 统一为 1100px（桌面端约占屏幕 75%），专注桌面端体验
- **Ruby 拼音硬性规则**：每日诗句已移除拼音，纯汉字 `letter-spacing: 0.75em`、`line-height: 2.5`。详情页原文 `letter-spacing: 0.45em`、`font-size: 1.3rem`、`line-height: 2.8`。`ruby` 标签内 `letter-spacing: 0` 保持拼音与汉字不散开
- **英文字母间距统一**：所有英文/拉丁文本 `letter-spacing: 0.07em–0.08em`，词卡英文单词 0.08em，定义和出处 0.07em
- **中文字间距统一**：无 ruby 中文文本（列表、摘要、标签等）`letter-spacing: 0.1em–0.15em`
- **Supabase URL**：https://vacfnpexbwjqscrltwds.supabase.co
- **Supabase anon key**（公开，前端使用）：`sb_publishable_bzHhPvrtJiiGrfE1eWldtA_1wYtEnQJ`
- **Supabase service_role key**（加密存储，需解密时联系罗智奇获取密码）：
  ```
  salt:  AepL3Lug2JzCVh6Pr/vBTg==
  iv:    Fc8WWdp+LM6Brcch6G1Uvg==
  data:  c0kVHeXLMkIvqv0SnoROVavqNM3tVqNlzAtiwFhcSj2IJG7pkgp4gRoMWjQAHbov
  ```
  解密方法（Node.js）：
  ```js
  const crypto = require('crypto');
  function decrypt(passphrase, {salt, iv, data}) {
    const key = crypto.pbkdf2Sync(passphrase, Buffer.from(salt, 'base64'), 100000, 32, 'sha256');
    const d = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'base64'));
    return d.update(data, 'base64', 'utf8') + d.final('utf8');
  }
  // 使用：decrypt(passphrase, { salt, iv, data })
  ```
  浏览器控制台解密方法：
  ```js
  async function decrypt(passphrase, {salt, iv, data}) {
    const k = await crypto.subtle.importKey('raw',
      new TextEncoder().encode(passphrase),
      { name: 'PBKDF2' }, false, ['deriveKey']);
    const dk = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: Uint8Array.from(atob(salt), c=>c.charCodeAt(0)),
        iterations: 100000, hash: 'SHA-256' },
      k, { name: 'AES-CBC', length: 256 }, false, ['decrypt']);
    const ct = Uint8Array.from(atob(data), c=>c.charCodeAt(0));
    const buf = await crypto.subtle.decrypt(
      { name: 'AES-CBC', iv: Uint8Array.from(atob(iv), c=>c.charCodeAt(0)) },
      dk, ct);
    return new TextDecoder().decode(buf);
  }
  // 使用：decrypt(passphrase, { salt, iv, data }).then(console.log)
  ```
- **模板页**：`word-list.html?category=` / `word-detail.html?id=` 为数据库驱动页面，所有内容从 Supabase 动态加载
- **排版规则**：所有字号 ≤ 1rem 的元素必须加粗（`font-weight: 700`），确保中文小字和拼音/英文字母清晰可辨；诗词拼音 `rt` 字号不低于 0.85rem

---

## 2026-07-20

### 修复
- **拼音 `rt` 字号过小**：`word-template.css` 中 `.detail-context rt` 新增 `font-size: 0.85rem; font-weight: 700`，此前浏览器默认约 0.65rem，低于设计约定下限
- **`.nav a.active` 重复定义**：从 `word-software.css` 和 `word-template.css` 移除各自重复的激活态规则，统一到 `theme.css` 中 `.nav a:hover, .nav a.active` 一处管理
- **详情页诗句字间距无效**：`.detail-context p` 的 `letter-spacing: 0.45em` 对独立 `<ruby>` 包裹的单字不生效，改为 `.detail-context ruby { margin-right: 0.45em }` 直接给每个 ruby 元素加右间距，恢复字间呼吸感

### 修改
- **当日诗词加载过渡**：`word-software.html` 中 Supabase 异步替换当日诗词时加入 200ms 渐隐 → 更新内容 → 渐显过渡，`word-software.css` 中 `.daily-poem` 增加 `transition: opacity 0.5s ease`，避免硬编码兜底被突然替换的闪烁感
- **当日诗词初始隐藏**：`.daily-poem` 初始 `opacity: 0`，Supabase 数据就绪后再淡入；失败则显示硬编码兜底。彻底消除刷新时"先看到滕王阁序再跳变"的问题
- **详情页剥离拼音**：`word-detail.html` 渲染 `poem_lines` 时用正则剥离 `<ruby><rt>` 标签，仅保留纯汉字，同步恢复 `.detail-context p` 的 `letter-spacing: 0.45em` 字间距

---

## 2026-07-19

### 清理
- **移除遗留静态页面**：删除 6 个旧静态页面及对应 CSS，所有内容已迁移至 Supabase，统一由 word-list.html + word-detail.html 模板驱动
- 更新 CHANGELOG「站点结构」章节，反映清理后的实际文件树、导航流和 CSS 引用规则

### 新增
- **以诗入词：杜甫《春望》**：国破山河在→花溅泪鸟惊心→烽火家书，许渊冲英译，词卡 beacon / war / ruin / petal / bird / letter / scratch / hairpin / thin
- **以史鉴词：丝绸之路**：张骞凿空西域→驼铃万里横贯欧亚→文明对流不止丝绸与香料，词卡 silk / caravan / spice / porcelain / merchant / monk / bazaar / damask
- **以词溯源：台风 Typhoon**：粤语「大风」走海路 + 希腊 Typhon 走陆路→16 世纪葡萄牙海图中双源合一，词卡 typhoon / tempest / hurricane / monsoon / vortex / spiral / voyage
- 数据通过 service_role key 直接写入 Supabase，同步更新 `supabase-setup.sql` 脚本

### 重构
- **Supabase 接入**：引入 Supabase 数据层，替代硬编码页面
  - 建表 `categories` / `entries` / `word_cards` / `daily_poems`（见 `supabase-setup.sql`）
  - 客户端 `js/supabase.js` 封装所有查询方法
  - 三级条目（行路难 / 鸦片战争 / 茶）的数据已迁移入库
- **统一模板页**：
  - `word-list.html` — 统一目录页，按 `?category=poem|history|etymology` 动态渲染
  - `word-detail.html` — 统一详情页，按 `?id=xxx` 加载内容 + 词卡
  - 新增 `css/word-template.css` 统一样式，替代原先三套独立 CSS 中的目录/详情部分
- **分首页动态化**：当日诗词从 `daily_poems` 表随机加载，Supabase 不可用时保留硬编码兜底

### 修改
- `word-software.html` 三入口链接指向 `word-list.html?category=xxx`
- CHANGELOG 新增「站点结构」章节，记录文件树、页面层级、CSS 引用规则、设计约定
- **全局排版优化**：
  - 所有 ≤1rem 字号元素统一加粗（`font-weight: 700`），包括拼音 rt、词卡、目录摘要、导航链接等
  - 英文字母间距整体上调至 0.05em–0.06em，拼音字号从 0.8rem 上调至 0.9rem
  - 详情页中文诗句 letter-spacing 从 0.12em 上调至 0.18em，字号 1.1→1.15rem
  - 设计约定新增「排版规则」条目，约束后续开发

### 设计决策
- **Supabase 行级安全**：所有表启用 RLS，仅 `SELECT` 授权匿名读取，不暴露写入权限
- **内容结构 JSONB**：`entries.content_data` 用 JSONB 存储不同分类的结构化内容（poem_lines / history_zh / story_zh），前端按类型渲染，避免每种分类拆多表

### 新增
- **「以史鉴词」目录页 `word-history-list.html` + `css/word-history-list.css`**：历史事件列表，每个条目含标题、时代标签、中文概要、英文摘要、目标词汇预览
- **鸦片战争详情页 `word-history-yapian.html` + `css/word-history.css`**：
  - 历史背景中文简述（坚船利炮叩开国门），金线标注关键句
  - 英文史述段落，核心词汇高亮（opium / gunboat / treaty / cede 等）
  - 词汇拆解卡片（opium / gunboat / treaty / cede / empire / port / indemnity / concession），含音标、释义、史境出处
  - 详情页与目录页底部均含返回链接
- **「以词溯源」目录页 `word-etymology-list.html` + `css/word-etymology-list.css`**：词源故事列表，每条含标题、读音路径、中文概要、英文摘要、目标词汇预览
- **茶词源详情页 `word-etymology-tea.html` + `css/word-etymology.css`**：
  - 词源叙事中文简述（闽南语 te 走海路、官话 cha 走陆路），金线标注关键句
  - 英文溯源段落，核心词汇高亮（tea / cha / chai / Silk Road 等）
  - 词汇拆解卡片（tea / cha / chai / porcelain / caravan / silk），含音标、释义、词源出处
  - 详情页与目录页底部均含返回链接

### 修改
- `word-software.html`「以史鉴词」gate 从无链接改为跳转 `word-history-list.html`
- `word-software.html`「以词溯源」gate 从无链接改为跳转 `word-etymology-list.html`

### 设计决策
- 三条链路页面结构与「以诗入词」保持一致：分首页 → 目录页 → 详情页，目录页沿用条目列表+悬浮左移+金线的交互范式
- 详情页复用诗词详情页的词卡布局，将内容区块替换为各自主题（诗词原文→历史背景/词源叙事，英文译本→英文史述/英文溯源），保持视觉统一

---

## 2026-07-18

### 清理
- 移除 `word-poem-list.html` 和 `word-poem-xinglunan.html` 中对 `word-software.css` 的冗余引用，两个页面未使用分首页相关样式，仅各自 CSS 中已包含所需样式

### 新增
- **单词分首页 `word-software.html` + `css/word-software.css`**：
  - 顶部当日诗词（中文原文 + 逐字 ruby 拼音 + 英文翻译 + 出处），纯氛围层
  - 中部三入口卡片：「以诗入词」「以史鉴词」「以词溯源」，悬浮金线亮起反馈
  - 底部隐含时间轴（先秦·希腊 → 晚清·工业革命），悬浮显示时代标签
- **以诗入词目录页 `word-poem-list.html` + `css/word-poem-list.css`**：诗词列表，每条含标题、作者、原句、英文译句，悬浮左移+金线
- **诗词详情页 `word-poem-xinglunan.html` + `css/word-poem.css`**：
  - 全诗逐字 ruby 拼音，目标句（行路难…今安在）金线标注+提亮
  - 许渊冲英文译本，目标句高亮
  - 词汇拆解卡片（journey / fork / goblet / jade / sword / sail / cleave / vast / astray），含音标、释义、诗中出处
- 详情页与目录页底部均加返回链接，无需滚回顶部

### 设计决策
- **Supabase 延后引入**：分首页与静态内容页优先硬编码完成，待内容形态稳定后再建表迁移。免费版 500MB 文本数据可长期使用
- **页面层级**：分首页 → 目录页 → 详情页，三条链路预留「以史鉴词」「以词溯源」后续扩展
- **英语朗读**：浏览器 Web Speech API（SpeechSynthesis）可直接实现，无需 Supabase 或外部服务

## 2026-07-15

### 修改
- 主标题"灵弦华夏"每个字独立渐变：灵(浅金→浅紫) 弦(浅紫→浅金) 华(浅金→浅紫) 夏(浅紫→浅金)，相邻字交替反向渐变产生呼吸节奏感，比四字统一样式更活泼
- 页脚字体加粗（font-weight: 600），暗色背景下细体字辨识度低，加粗后与正文区拉开层次
- Slogan 从中文"灵弦不灭 · 吾心华夏"改为英文 "Lingxian Eternal · Huaxia in Hearts"，英文 slogan 与导航竖排中文形成对比，增强页面国际化气质且避免标题下方重复出现大段中文

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
