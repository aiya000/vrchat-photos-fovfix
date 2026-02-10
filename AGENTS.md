# Agent Guidelines for vrchat-photos-fovfix

This document provides guidelines for AI agents (GitHub Copilot, etc.) working on this project.

## Package Management

**IMPORTANT: This project uses Bun as the package manager.**

### ✅ DO:
- Use `bun install` to install dependencies
- Use `bun run <script>` to run scripts (e.g., `bun run dev`, `bun run build`)
- Reference `bun.lock` for dependency resolution
- Use Bun-specific commands when applicable

### ❌ DON'T:
- **Never use `npm install`, `npm run`, or any npm commands**
- **Never use `yarn` or `pnpm` commands**
- Do not generate `package-lock.json` or `yarn.lock` files
- Do not modify `bun.lock` manually

### Why Bun?
This project has chosen Bun for its speed and modern features. Using other package managers may cause:
- Lock file conflicts (`package-lock.json` vs `bun.lock`)
- Dependency resolution inconsistencies
- Unnecessary files being tracked in git

## Code Style

### Comments
- **Avoid obvious comments**: Don't add comments that merely restate what the code does
- **Good**: `// Workaround for Safari's viewport height bug`
- **Bad**: `// Update the document's lang attribute to match the detected locale` (when the code itself is `document.documentElement.lang = locale`)
- Use comments only when:
  - The code's intent is not immediately clear
  - There's a non-obvious reason for the implementation
  - Documenting a workaround or edge case

### Code Clarity
- Write self-documenting code with clear variable and function names
- Prefer code clarity over brevity
- Let the code speak for itself when possible

## Project Context

### Technology Stack
- **Framework**: Next.js 16 (with Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Package Manager**: Bun
- **Deployment**: Static Generation (`output: "export"`)

### i18n Strategy
- Default language: Japanese (`ja`)
- English support via client-side detection
- Dynamic `lang` attribute updates based on `navigator.language`

### SEO Considerations
- This is a static site (Static Generation)
- All metadata should be optimized for static export
- Use `export const dynamic = "force-static"` for route handlers when using `output: "export"`

## Testing Changes

### Before Committing
1. Run `bun run typecheck` to verify TypeScript types
2. Run `bun run build` to ensure the build succeeds
3. Check for any warnings in the build output
4. Test the generated static files in the `out/` directory

### Don't Skip
- Always validate changes compile and build successfully
- Ensure no new TypeScript errors are introduced
- Verify that static generation completes without errors

## Commit Messages

Follow Conventional Commits format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for code style changes (formatting, etc.)
- `refactor:` for code refactoring
- `chore:` for maintenance tasks

Use Japanese for commit messages if the PR conversation is in Japanese.

## Remember

1. **Always use Bun, never npm/yarn/pnpm**
2. **Avoid redundant comments - let code be self-explanatory**
3. **Test with `bun run typecheck` and `bun run build` before committing**
4. **This is a static site - ensure all changes work with `output: "export"`**
