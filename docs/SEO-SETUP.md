# SEO Setup - Robots.txt & Sitemap Configuration

本文档描述了项目的SEO配置，包括robots.txt和sitemap的自动生成。

## 🤖 Robots.txt

### 位置
- 文件：`public/robots.txt`
- URL：`https://teller.eu.org/robots.txt`

### 配置内容
- ✅ 允许所有搜索引擎爬取
- 🚀 支持主要搜索引擎（Google、Bing、Yahoo、DuckDuckGo、百度、Yandex）
- 📍 指定sitemap位置
- ⏱️ 设置合理的爬取延迟（1秒）
- 📁 允许静态资源文件（CSS、JS、图片、字体等）

## 🗺️ Sitemap 自动生成

### 功能特点
- 🌍 **多语言支持**：自动生成5种语言的页面（英文、法文、中文、印地语、阿拉伯语）
- 🛠️ **工具页面**：包含所有4个占卜工具的页面
- 🔗 **语言切换**：每个页面包含其他语言版本的alternate链接
- ⚡ **动态生成**：支持运行时和构建时生成
- 📊 **统计信息**：提供详细的URL统计和分析

### 生成的页面类型

#### 1. 首页 (Priority: 1.0)
- `https://teller.eu.org/` (默认英文)
- `https://teller.eu.org/en/` (英文)
- `https://teller.eu.org/fr/` (法文)
- `https://teller.eu.org/zh/` (中文)
- `https://teller.eu.org/hi/` (印地语)
- `https://teller.eu.org/ar/` (阿拉伯语)

#### 2. 工具页面 (Priority: 0.8)
每种语言下包含以下工具页面：
- `/tarot` - 塔罗牌占卜
- `/astrology` - 占星术
- `/numerology` - 数字命理学
- `/chinese-zodiac` - 中国生肖

总共 **25个页面**：
- 5个首页（每种语言1个）
- 20个工具页面（4个工具 × 5种语言）

### API 端点

#### 1. 动态Sitemap生成
```
GET /api/sitemap.xml
```
- 实时生成XML格式的sitemap
- 包含所有语言和工具页面组合
- 缓存24小时

#### 2. Sitemap信息查看
```
GET /api/admin/sitemap-info
```
- 查看sitemap统计信息
- 按语言分组的URL列表
- 配置信息和示例URL

### 构建脚本

#### 1. 静态生成
```bash
npm run generate:sitemap
```
生成静态sitemap文件到 `public/sitemap.xml`

#### 2. 查看信息
```bash
npm run sitemap:info
```
查看当前sitemap统计信息（需要服务器运行）

### 开发使用

#### 1. 启动开发服务器
```bash
npm run dev
```

#### 2. 查看sitemap
- 访问：`http://localhost:3000/api/sitemap.xml`
- 查看信息：`http://localhost:3000/api/admin/sitemap-info`

#### 3. 构建生产版本
```bash
npm run generate
```
自动生成静态sitemap文件

### 配置文件

#### 1. 类型定义 (`types/sitemap.ts`)
- 定义sitemap相关的TypeScript类型
- 配置常量和优先级设置

#### 2. 生成器工具 (`utils/sitemapGenerator.ts`)
- `SitemapGenerator` 类
- 支持多语言和多页面类型
- 生成XML格式sitemap
- 提供统计和分析功能

#### 3. 配置选项
```typescript
export const SITEMAP_CONFIG = {
  baseUrl: 'https://teller.eu.org',
  locales: [
    { code: 'en', iso: 'en-US', name: 'English' },
    { code: 'fr', iso: 'fr-FR', name: 'Français' },
    { code: 'zh', iso: 'zh-CN', name: '中文' },
    { code: 'hi', iso: 'hi-IN', name: 'हिन्दी' },
    { code: 'ar', iso: 'ar-SA', name: 'العربية', dir: 'rtl' }
  ],
  tools: ['tarot', 'astrology', 'numerology', 'chinese-zodiac']
}
```

### SEO最佳实践

#### 1. 优先级设置
- 首页：1.0（最高优先级）
- 工具页面：0.8（高优先级）
- 静态页面：0.6（中等优先级）

#### 2. 更新频率
- 首页：每周更新
- 工具页面：每月更新
- 静态页面：每月更新

#### 3. 语言标记
每个页面包含alternate标签，指向其他语言版本：
```xml
<xhtml:link rel="alternate" hreflang="fr-FR" href="https://teller.eu.org/fr/tarot" />
<xhtml:link rel="alternate" hreflang="zh-CN" href="https://teller.eu.org/zh/tarot" />
```

### 监控和维护

#### 1. 日志记录
- API调用会记录生成的URL数量
- 错误处理和日志记录

#### 2. 缓存策略
- Sitemap XML缓存24小时
- 适当的HTTP缓存头设置

#### 3. 验证工具
- Google Search Console提交
- Bing站长工具提交
- 定期检查sitemap有效性

### 故障排除

#### 1. 常见问题
- **404错误**：检查服务器配置和文件路径
- **XML解析错误**：验证生成的XML格式
- **缺少URL**：检查配置文件中的语言和工具列表

#### 2. 调试命令
```bash
# 检查sitemap内容
curl http://localhost:3000/api/sitemap.xml

# 查看统计信息
curl http://localhost:3000/api/admin/sitemap-info | jq .

# 验证XML格式
xmllint --noout public/sitemap.xml
```

### 未来扩展

#### 1. 添加新语言
在 `types/sitemap.ts` 中的 `SITEMAP_CONFIG.locales` 添加新语言配置

#### 2. 添加新工具
在 `types/sitemap.ts` 中的 `SITEMAP_CONFIG.tools` 添加新工具

#### 3. 添加静态页面
在 `types/sitemap.ts` 中的 `SITEMAP_CONFIG.staticPages` 添加静态页面

---

## 📞 支持

如有问题，请检查：
1. 服务器日志
2. Nuxt开发工具
3. 浏览器开发者工具
4. Google Search Console 