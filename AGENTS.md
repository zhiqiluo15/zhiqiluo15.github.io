# Git 协作强制规范（AI 必须严格遵守）

## 1. 禁止直接在 main 分支修改
- 任何改动（新功能、新章节、样式、bug 修复）**必须先新建分支**
- 分支命名：`feature/xxx`、`fix/xxx`、`style/xxx`、`docs/xxx`
- 示例：`feature/添加第七章`、`fix/移动端菜单错位`
- main 分支**只保留确认可展示的稳定版本**

## 2. 开工必须先同步最新代码
每次开始任务，**第一条命令必须是**：
```bash
git checkout main && git pull
```