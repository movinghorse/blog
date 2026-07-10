'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../..');
const publicDir = path.join(root, 'public');
const distDir = path.join(root, 'dist');
const staticDir = path.join(distDir, 'static');
const serverDir = path.join(distDir, 'server');

if (!fs.existsSync(path.join(publicDir, 'index.html'))) {
  throw new Error('Missing public/index.html. Run `npm run build` first.');
}

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(staticDir, { recursive: true });
fs.cpSync(publicDir, staticDir, { recursive: true });
fs.mkdirSync(serverDir, { recursive: true });

const worker = `const INDEX_FILE = 'index.html';

function withIndexPath(url) {
  const next = new URL(url);

  if (next.pathname.endsWith('/')) {
    next.pathname += INDEX_FILE;
    return next;
  }

  if (!next.pathname.split('/').pop().includes('.')) {
    next.pathname += '/' + INDEX_FILE;
  }

  return next;
}

async function fetchAsset(request, env) {
  if (!env || !env.ASSETS || typeof env.ASSETS.fetch !== 'function') {
    return new Response('Static assets binding is unavailable.', { status: 500 });
  }

  const response = await env.ASSETS.fetch(request);
  if (response.status !== 404) return response;

  const indexRequest = new Request(withIndexPath(request.url), request);
  return env.ASSETS.fetch(indexRequest);
}

export default {
  fetch(request, env) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    return fetchAsset(request, env);
  }
};
`;

fs.writeFileSync(path.join(serverDir, 'index.js'), worker);
