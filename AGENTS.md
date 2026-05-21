# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Overview

This is a Hexo blog repository. The blog is deployed to GitHub Pages at https://www.yeahxj.com/.

## Common Commands

- `npm run server` - Start local dev server (http://localhost:4000)
- `npm run build` - Generate static files to `./public`
- `npm run clean` - Clear generated files and cache

## Site Configuration

- Root config: `_config.yml`
- Active theme: `linen` (configured in `_config.yml` theme field)
- Theme `next` exists in `themes/next/` with full configuration but is not currently active

## Content Structure

- Posts: `source/_posts/` (Markdown files)
- Attachments: `source/_attachments/`
- Custom pages: `source/` (aboutme.md, tools/, coding/, jobs/)
- Generated public files output to `public/`

## Deployment

GitHub Actions workflow in `.github/workflows/pages.yml` handles CI/CD:
- Triggers on push to `main` branch and manual `workflow_dispatch`
- Uses Node 22
- Installs dependencies with `npm ci`
- Builds `./public`, uploads it as a GitHub Pages artifact, and deploys with `actions/deploy-pages`
- Do not run `npm run deploy` manually for this project; pushing to `main` triggers deployment automatically.
- Production URL: https://www.yeahxj.com/

## Architecture Notes

- Uses EJS templates, Marked renderer, and Stylus for styles
- URL structure: `/:year/:month/:day/:title/`
- Posts sorted by date descending
- Pagination: 10 posts per page
