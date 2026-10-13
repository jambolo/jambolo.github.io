# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Dependencies and CI

- `Gemfile.lock` must keep `x86_64-linux-gnu` for the Ubuntu runner and `x64-mingw-ucrt` for local Windows development.
- Keep `ruby/setup-ruby` pinned to a full commit SHA. Bump its `cache-version` only to bust a stale gem cache.

## Architecture

- Filter buttons in `default.html` use `data-filter-group` (`type`, `topic`, `status`) and `data-filter` values that must match `projectType` and `topic` values in `projectsData`. A new topic needs a button plus entries in `categoryColors` and `topicLabels`. A new project type needs only a button.
- Root-level app directories (`advent-of-code-2025-visualizations/`, `bitcoin-keys-demo/`, `drawArc/`, `not-a-clue/`, `sudokujs/`, `wordle-solver/`) are committed prebuilt output from their own repos, passed through by Jekyll unchanged. Link them with a relative `demo` path. Don't edit the minified bundles.
- `docs/<Name>/` holds generated API documentation (mostly Doxygen `html/`), linked with `docs: "docs/<Name>/html/index.html"`. Regenerate it in the source repo instead of hand-editing it.

## Portfolio Rules

Portfolio data lives in `assets/js/filter.js`, and filter controls live in `_layouts/default.html`.

- List every public non-forked jambolo repo exactly once. Archived repos stay in their normal section.
- Preserve explicit user decisions about repository inclusion.
- `projectsData` is grouped under comment headers, in this order:
  - Advent of Code: newest year first, titled `YYYY - Language`, `projectType: "aoc"`, `topic: "aoc"`. Keep 2025 Visualizations as its own entry with GitHub and hosted links. Incomplete years use `isWip: true` and remain in this section.
  - Applications: sorted alphabetically, ignoring case, `projectType: "applications"`. Include `languages` for every entry and package links such as `crate` when relevant.
  - Libraries: sorted alphabetically, ignoring case, `projectType: "libraries"`. Include `languages` for every entry. Libraries are expected to have `docs`, so report any that are missing.
  - Whitepapers: sorted alphabetically, ignoring case, `projectType: "whitepapers"`; papers and draft specifications.
  - Developer Resources: sorted alphabetically, ignoring case, `projectType: "resources"`; reusable plugins, skills, agent instructions, and workflows.
  - Built By AI (GitHub Spark): sorted alphabetically, ignoring case, `projectType: "builtbyai"`; `demo` points at the deployed `*.github.app` URL. GitHub repo links are optional.
  - WIP: sorted alphabetically, ignoring case, `isWip: true`; retain the actual `projectType`, including whitepapers and developer resources. Advent of Code entries stay in their own section with their WIP status. Render the status badge instead of adding a WIP prefix to the description.
- Topic and status are independent of project type. Finance and trading tools use `topic: "finance"`, labeled Finance & Trading.
- Keep the topic names Game AI & Theory, Game Analysis, AI Tools, and Development Tools.
- Remove empty filter buttons when their categories no longer contain projects.
- Apps that run in a browser get a verified `demo` link to the hosted copy on this site or to a deployed URL.
- Descriptions are one short sentence. If a repo has no GitHub description, infer one from its name and language.
- Never invent `demo` or `docs` links. Report them as missing.
- Preserve the existing object formatting and rendering behavior.

## Troubleshooting

- `cannot load such file -- webrick`: restore the `webrick` gem.
- Nokogiri build failures on Windows: install the MSYS2 toolchain with `ridk install 3`.
