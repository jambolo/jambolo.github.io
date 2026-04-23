# Project Guidelines

- `CLAUDE.md` is retired in this repository. Treat the files under `.github/` as the source of truth for agent guidance.

## Environment

- This repository is a minimal Jekyll site deployed with GitHub Pages.
- The site uses the `jekyll-theme-architect` theme with no `_layouts/`, `_includes/`, or `_data/` customizations.
- Use Windows-compatible commands and assumptions.
- Use Ruby 3.2.2 UCRT for Bundler and Jekyll work. Do not move to Ruby 4.x because it breaks native extensions required by the GitHub Pages Jekyll stack.
- Keep `x64-mingw-ucrt` in `Gemfile.lock`. Add it with `bundle lock --add-platform x64-mingw-ucrt` if it goes missing.
- Keep `x86_64-linux` in `Gemfile.lock` so GitHub Actions can resolve gems on Ubuntu runners.

## Build And Run

- Install dependencies with `bundle install`.
- Serve locally with `bundle exec jekyll serve`.
- Build the site with `bundle exec jekyll build`.
- Update GitHub Pages-pinned gems with `bundle update github-pages`.
- The local development server runs at `http://localhost:4000` by default.

## Gemfile And Dependency Constraints

- Depend on `github-pages` in the `:jekyll_plugins` group. Do not add a standalone `jekyll` gem.
- Keep `webrick` in the Gemfile for local serving on Ruby 3.x.
- Keep `tzinfo-data` for Windows platforms.
- Keep `wdm` restricted to Windows platforms so Linux CI does not try to install it.
- Match gem versions to the GitHub Pages environment documented at `https://pages.github.io/versions/`.
- Do not introduce Jekyll 4.x features or unsupported custom plugins.

## GitHub Actions Deployment

- Deployment is handled by `.github/workflows/jekyll.yml` with a build job followed by deploy.
- Keep the workflow Ruby version aligned with the Ruby version used to generate `Gemfile.lock`.
- Keep `ruby/setup-ruby` pinned to a full commit SHA, not a tag.
- Increment the workflow cache version only when you need to bust a stale gem cache.

## Repository Structure

- Main site content is in `index.md`.
- Jekyll passes committed static project folders through as-is.
- Hosted project directories include `advent-of-code-2025-visualizations/`, `drawArc/`, `wordle-solver/`, `not-a-clue/`, and `sudokujs/`.
- Generated API documentation lives under `docs/`.
- When adding new site content, either edit `index.md` or add a pre-built static project directory at the repository root.

## Common Failures

- `cannot load such file -- webrick`: add or restore the `webrick` gem.
- Nokogiri install failures on Windows usually mean the MSYS2 or DevKit toolchain is missing; use `ridk install 3`.
- Liquid version mismatches usually mean someone added `gem "jekyll"` alongside `github-pages`; remove the standalone `jekyll` gem.
- GitHub Actions bundler platform failures usually mean `Gemfile.lock` is missing the required Windows or Linux platform entries.