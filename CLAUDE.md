# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Environment

- **OS:** Windows 10/11 (Git Bash or PowerShell)
- **Ruby:** 3.2.2 (UCRT) — do not use Ruby 4.0+; it breaks native C-extensions required by Jekyll 3.9
- **Platform token:** `x64-mingw-ucrt` — must be present in `Gemfile.lock` to avoid GitHub Actions build failures; add with `bundle lock --add-platform x64-mingw-ucrt`

## Commands

```bash
# Install dependencies
bundle install

# Serve locally with live reload
bundle exec jekyll serve

# Build site to _site/
bundle exec jekyll build

# Update github-pages and all pinned deps
bundle update github-pages
```

The local server runs at `http://localhost:4000` by default.

## Gemfile Requirements

The `Gemfile` must include these blocks:

```ruby
source "https://rubygems.org"

gem "github-pages", group: :jekyll_plugins   # mirrors GitHub Pages environment; do NOT add gem "jekyll" separately

gem "webrick", "~> 1.7"                      # Ruby 3.0+ removed WEBrick; required for local serve

gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]  # Windows timezone fix
```

## Common Errors

- **`cannot load such file -- webrick`** — Ruby 3.0+ removed WEBrick. Add `gem "webrick"` to `Gemfile`.
- **`Nokogiri` installation failure** — Missing MSYS2/DevKit. Run `ridk install 3`.
- **`Liquid` version mismatch** — Caused by having `gem "jekyll"` in the `Gemfile` alongside `github-pages`. Remove the standalone `gem "jekyll"` line.
- **GitHub Actions platform mismatch** — `Gemfile.lock` missing the Windows platform. Run `bundle lock --add-platform x64-mingw-ucrt`.

## GitHub Actions Deployment

Deployment is handled by [.github/workflows/jekyll.yml](.github/workflows/jekyll.yml). A push to `master` (or a manual trigger via `workflow_dispatch`) runs a two-job pipeline: **build** then **deploy**.

### Workflow design notes

- `ruby-version: '3.2'` — must stay in sync with the Ruby version used locally to generate `Gemfile.lock`. Changing this without re-locking locally will cause bundler platform errors.
- `ruby/setup-ruby` is pinned to a full commit SHA (not a tag) to prevent supply-chain attacks. The comment above the `uses:` line links to the corresponding release. To update: find the new SHA at <https://github.com/ruby/setup-ruby/releases>, update both the SHA and the comment.
- `cache-version: 0` — increment this number to force a full re-download of cached gems (e.g. after a corrupted cache or a lockfile change that doesn't bust the cache automatically).
- `Gemfile.lock` must list `x86_64-linux` under `PLATFORMS` so the Ubuntu runner can resolve gems. If it goes missing, run `bundle lock --add-platform x86_64-linux` locally.
- `wdm` is declared with `platforms: [:mingw, :mswin, :x64_mingw]` in the `Gemfile` so bundler does not attempt to install it on the Linux runner.

### Debugging a failed deployment

1. Go to the repo's **Actions** tab and open the failed run.
2. Build failures (bad gems, Jekyll errors) will be in the **build** job logs.
3. Deploy failures (permissions, Pages not configured) will be in the **deploy** job logs.
4. A common first-run failure is the GitHub Pages source not being set to Actions — the deploy job exits with a 404/403 from the Pages API.

## Deployment Constraints

GitHub Pages uses the Standard Legacy Builder, which pins Jekyll to 3.9.x and does not support Jekyll 4.x or custom plugins. All gem versions must match what is listed at <https://pages.github.io/versions/>.

## Architecture

This is a minimal Jekyll site pinned to the `github-pages` gem (v232, Jekyll 3.10.0) and deployed via GitHub Pages. The theme is `jekyll-theme-architect` with no customizations — no `_layouts/`, `_includes/`, or `_data/` directories exist.

**Content** lives almost entirely in [index.md](index.md), a single Markdown file with `layout: default` front matter. It serves as a portfolio/showcase page linking to external GitHub repos and hosted apps.

**Embedded projects** are pre-built and committed as static subdirectories — Jekyll does not build them, it just passes them through:

- [advent-of-code-2025-visualizations/](advent-of-code-2025-visualizations/) — WebM videos + HTML index for AoC visualizations
- [drawArc/](drawArc/), [wordle-solver/](wordle-solver/), [not-a-clue/](not-a-clue/) — pre-built React apps
- [sudokujs/](sudokujs/) — standalone web app
- [docs/](docs/) — Doxygen-generated C++ API documentation for various libraries

Adding new content to the site means either editing [index.md](index.md) or dropping a new pre-built project directory at the repo root.
