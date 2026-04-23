---
name: "Troubleshoot Jekyll And Pages"
description: "Diagnose local Jekyll, Bundler, Gemfile.lock platform, or GitHub Pages deployment issues in the jambolo.github.io repository. Use when builds fail, gems mismatch, or the Pages workflow breaks."
argument-hint: "Describe the Jekyll, Bundler, or GitHub Pages failure"
agent: "agent"
model: "GPT-5 (copilot)"
---

Investigate and fix the reported Jekyll, Bundler, or GitHub Pages problem in this repository.

Requirements:

- Follow the repository constraints in [copilot-instructions.md](../copilot-instructions.md).
- Prefer the smallest change that fixes the root cause.
- Keep the repository compatible with the GitHub Pages gem set and legacy builder.
- Do not add a standalone `jekyll` gem.
- Preserve required `Gemfile.lock` platforms, especially `x64-mingw-ucrt` and `x86_64-linux`.
- Check for the common failure cases documented in the repo instructions before proposing broader changes.

Suggested workflow:

- Inspect the failing command, error message, or workflow logs.
- Verify the Gemfile and lockfile constraints for GitHub Pages compatibility.
- Check whether the failure is local development, dependency resolution, or GitHub Actions deployment.
- Apply the minimal repair and validate it with the narrowest relevant command.

Return:

- Root cause.
- Exact fix made or recommended.
- Any validation run.
- Any remaining deployment prerequisite outside the repository, such as GitHub Pages source configuration.