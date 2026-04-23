---
name: "Update Portfolio Index"
description: "Update index.md to add, remove, or revise repository entries on the jambolo.github.io portfolio site. Use when maintaining section placement, sort order, hosted links, and documentation links."
argument-hint: "Describe the repo or change to make in index.md"
agent: "agent"
model: "GPT-5 (copilot)"
---

Update [index.md](../index.md) for the requested repository or portfolio change.

Requirements:

- Follow the section and entry rules in [index-portfolio.instructions.md](../instructions/index-portfolio.instructions.md).
- Preserve the existing structure and tone of the page unless the request explicitly asks for a rewrite.
- Put the repository in exactly one section.
- Maintain the required sort order for the affected section.
- Include hosted links for browser-run applications when available.
- Include API documentation links for libraries when available.
- If required hosted links or documentation links are missing, say so explicitly instead of inventing them.

When the request is ambiguous, inspect the existing neighboring entries in `index.md` and make the smallest consistent change.

Return:

- A short summary of what changed.
- Any missing hosted links, missing docs, or unresolved classification questions.