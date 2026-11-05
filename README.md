# guoyumin-hku.github.io

个人学术主页（中英双语 / 深浅色 / 单栏学术排版），纯静态 HTML + CSS + 原生 JS，
无构建步骤、无第三方依赖、无外部字体请求 —— 直接推到 GitHub Pages 即可访问：
**https://guoyumin-hku.github.io**

---

## 1. 目录结构

```
guoyumin-hku.github.io/
├── index.html              # 主页（全部内容都在这里）
├── 404.html                # 404 页面
├── assets/
│   ├── css/style.css       # 样式（配色变量在文件顶部的 :root 里）
│   ├── js/main.js          # 主题切换 / 语言切换 / 导航高亮
│   ├── favicon.svg         # 站点图标（GY 字母标）
│   └── img/                # 放照片：命名为 avatar.jpg
├── robots.txt
├── sitemap.xml
├── .nojekyll               # 让 Pages 原样托管，不要走 Jekyll
└── README.md
```

页面只有 5 个板块：**About / Education / Publications / Research / Industry**，
导航与页脚也都按这 5 项收缩过。

## 2. 本地预览

直接双击 `index.html` 即可。也可以用本地服务器（更接近线上环境）：

```powershell
cd E:\phd-files\guoyumin-hku.github.io
python -m http.server 8000
# 打开 http://localhost:8000
```

## 3. 发布到 GitHub Pages

已在本目录初始化好 git 仓库并完成提交，只差推送。

### 方式 A（推荐，得到 `guoyumin-hku.github.io` 根域名）

1. 在 GitHub 新建仓库，名称必须**正好**是 `GuoYumin-hku.github.io`（公开仓库）。
2. 推送：

```powershell
cd E:\phd-files\guoyumin-hku.github.io
git remote add origin https://github.com/GuoYumin-hku/GuoYumin-hku.github.io.git
git branch -M main
git push -u origin main
```

3. 等 1–2 分钟，访问 https://guoyumin-hku.github.io 。
   首次推送后在 **Settings → Pages** 里确认 Source 为 `Deploy from a branch` → `main` → `/ (root)`。

### 方式 B（作为普通项目仓库）

仓库可任意命名，然后在 **Settings → Pages → Source** 选 `main` / `/ (root)`，
站点地址为 `https://GuoYumin-hku.github.io/<仓库名>/`。
此时 `robots.txt`、`sitemap.xml`、`404.html` 里的绝对路径需要相应调整，
`index.html` 顶部的 `canonical` / `og:url` 也要改成新地址。

## 4. 怎么改内容

所有文字都在 `index.html` 里，中英成对出现：

```html
<span class="eq">English text</span>
<span class="zq">中文文本</span>
```

- 改某句话：分别改 `.eq` 和 `.zq` 两个兄弟元素。
- 整段文字用 `<p class="eq">` / `<p class="zq">`，列表用 `<ul class="points eq">` / `<ul class="points zq">`。
- 中英两份内容同时存在 DOM 中，靠 `<html lang>` 切换显示（`style.css` 约第 105 行）。

### 加/换头像

把照片命名为 `avatar.jpg` 放进 `assets/img/` 即自动生效（建议 400×400 以上、正方形）。
没有照片时显示 `GY` 字母标。想用其他扩展名，改 `index.html` 里
`<img src="assets/img/avatar.jpg">` 这一行。

### 改配色 / 宽度

`assets/css/style.css` 顶部 `:root` 与 `html[data-theme="dark"]` 两组变量：
`--accent` 主色（现为港大深绿 `#0b5b45`），`--maxw` 是正文最大宽度（现 44rem）。

### 改默认语言

默认英文。若想让中文访客直接看到中文，把 `index.html` 里
`<html lang="en" data-title-en=...>` 改为 `lang="zh-CN"`（语言按钮仍可切回英文）。

### 加回删掉的内容

上一版删除了 **Honors / Awards & Patent、Projects & Code、ICNGN 那篇论文、
ONEWO 数据集条目、MOEA/D 本科论文、GPU 服务器那条工作经历**。
它们都还留在 git 历史里，需要时可直接取回：

```powershell
git log -p -- index.html
```

## 5. 内容待确认（重要）

以下几处按 CV 原文照录、但建议你核对后再公开：

| 位置 | 现状 | 说明 |
|---|---|---|
| 论文第 1 条标题 | `Multimodal Large Language Models for Visual Understanding and Reasoning` | CV 里是占位符 `[Manuscript Title]`，这是**拟的占位标题**，请替换为真实标题（`index.html` 里已标 `TODO` 注释）。 |
| 硕士起止 | `2024.09 – present` | 与 CV 一致；若硕士已毕业，建议改成具体结束月。 |
| TPAMI 进度 | `Under review` | 若已中稿/被拒，记得同步改状态与 pill 样式。 |

## 6. 技术说明

- **无外部依赖**：不加载 Google Fonts / CDN / 统计脚本，国内访问快且不泄露访客信息。
- **字体**：正文系统无衬线（PingFang / 微软雅黑 / 思源），标题系统衬线（Iowan / Palatino / 宋体）。
- **深色模式**：跟随系统，手动切换后记住选择（`localStorage`）。
- **语言**：切换记住选择；`<html lang>` 与 `<title>` 同步更新。
- **无障碍**：焦点样式、`aria-label`、`prefers-reduced-motion` 支持。
- **打印**：`Ctrl+P` 自动隐藏导航、头像、链接行，输出接近一份 CV。
- **SEO**：`JSON-LD` Person 结构化数据、Open Graph、canonical、sitemap。
