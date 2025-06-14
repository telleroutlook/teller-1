import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 支持的页面
const pages = [
  '',
  'about',
  'projects',
  'faq',
  'contact',
  'privacy'
];

// 支持的语言
const languages = ['en', 'zh', 'fr', 'hi', 'ar'];

// 生成sitemap XML
function generateSitemap() {
  const baseUrl = 'https://teller.vercel.app';
  const today = new Date().toISOString().split('T')[0];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

  // 为每个页面生成URL
  pages.forEach(page => {
    const url = page ? `/${page}` : '';
    
    // 为每个语言生成URL
    languages.forEach(lang => {
      const langUrl = lang === 'en' ? url : `/${lang}${url}`;
      
      sitemap += `
  <url>
    <loc>${baseUrl}${langUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>`;

      // 添加所有语言的替代链接
      languages.forEach(altLang => {
        const altUrl = altLang === 'en' ? url : `/${altLang}${url}`;
        sitemap += `
    <xhtml:link 
      rel="alternate" 
      hreflang="${altLang}" 
      href="${baseUrl}${altUrl}"/>`;
      });

      sitemap += `
  </url>`;
    });
  });

  sitemap += `
</urlset>`;

  // 写入文件
  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, sitemap);
  console.log('Sitemap generated successfully!');
}

generateSitemap(); 