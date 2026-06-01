'use strict';

const path = require('path');

const DATE_SLUG = /^(\d{4})-(\d{2})-(\d{2})-(.+)$/;

function cleanSlug(slug) {
  if (typeof slug !== 'string') return slug;
  const match = slug.match(DATE_SLUG);
  return match ? match[4] : slug;
}

function legacySlug(slug) {
  if (typeof slug !== 'string') return null;
  return DATE_SLUG.test(slug) ? slug : null;
}

function slugFromSource(source) {
  if (typeof source !== 'string') return null;
  return path.basename(source, path.extname(source));
}

function sitePath(path) {
  const root = hexo.config.root || '/';
  return `${root.replace(/\/?$/, '/')}${String(path).replace(/^\/+/, '')}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

hexo.extend.filter.register('post_permalink', data => {
  if (typeof data !== 'object' || data === null || data.__permalink) return data;

  const oldSlug = data.legacy_slug || legacySlug(data.slug) || legacySlug(slugFromSource(data.source));
  if (!oldSlug) return data;

  data.legacy_slug = oldSlug;
  data.slug = cleanSlug(oldSlug);

  return data;
}, 9);

hexo.extend.generator.register('legacy_post_redirects', locals => {
  const { url } = hexo.config;
  const redirects = [];

  locals.posts.forEach(post => {
    const oldSlug = post.legacy_slug || legacySlug(post.slug) || legacySlug(slugFromSource(post.source));
    if (!oldSlug) return;

    const newPath = sitePath(post.path);
    const oldPath = `${post.date.format('YYYY/MM/DD')}/${oldSlug}/index.html`;
    const canonical = url ? `${url.replace(/\/$/, '')}${newPath}` : newPath;

    redirects.push({
      path: oldPath,
      data: `<!doctype html>
<html lang="${escapeHtml(hexo.config.language || 'zh-CN')}">
<head>
  <meta charset="utf-8">
  <meta name="robots" content="noindex">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <meta http-equiv="refresh" content="0; url=${escapeHtml(newPath)}">
  <title>Redirecting...</title>
</head>
<body>
  <p>Redirecting to <a href="${escapeHtml(newPath)}">${escapeHtml(newPath)}</a>.</p>
  <script>
    location.replace(${JSON.stringify(newPath)} + location.search + location.hash);
  </script>
</body>
</html>`
    });
  });

  return redirects;
});
