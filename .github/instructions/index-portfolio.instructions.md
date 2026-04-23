---
description: "Use when editing index.md, maintaining the portfolio page, adding repos to the site, or reorganizing Advent of Code, Applications, Libraries, GitHub Spark Projects, or WIP entries."
applyTo: "index.md"
---

# Portfolio Index Guidelines

- `index.md` is intended to document all public non-forked repos at `https://github.com/jambolo`.
- Every repo should appear in exactly one section.
- Archived repos stay listed with active repos; do not create a separate archive section unless explicitly asked.

## Section Rules

- Advent of Code: one entry per year, sorted newest first. Use headings in the form `### YYYY - Language`. Append `(Completed)` when that year is fully solved. Keep the 2025 Visualizations project as its own entry with both GitHub and hosted links.
- Applications: sort alphabetically. Include a language bullet for every entry. If the app runs standalone in a browser, include a hosted copy on this site or a deployed URL and add a `[Try it!]` link. Add package links such as `[crates.io]` when relevant.
- Libraries: sort alphabetically. Include a language bullet for every entry. Include an `[API Documentation]` link when docs exist. Libraries are expected to have documentation links, so call out missing docs instead of silently omitting them.
- GitHub Spark Projects: use deployed `*.github.app` links. GitHub repo links are optional.
- WIP: sort alphabetically. Start the description with `**(WIP)**`.

## Content Rules

- Keep descriptions to one short sentence.
- If a repository has no GitHub description, infer a short one from the repo name and language.
- Prefer the existing style and heading structure already used in `index.md` unless the user asks for a broader rewrite.