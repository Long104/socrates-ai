# MIGRATION_PLAN.md — Socrates AI Monorepo

> Pure structural move. No logic changes. Preserves all working API + state machine.

---

## 0. ADR & Decision

**Context:** Hackathon deadline July 21 2026 5pm PT. Working Next.js 16 single-app. Pure structural move to Turborepo monorepo. No logic changes.

**Decision:** 2 packages (`ui` + `core`) + 1 app (`web`). Packages export **source** (no build step — `transpilePackages` handles compilation). Biome replaces ESLint.

**YAGNI Note:** Single consumer means packages add overhead. User explicitly requested skill-compliant structure. Honoring request. No `auth`/`db`/`store`/`api` packages — YAGNI.

**Discarded:**
- tRPC/oRPC router package — only 4 API routes, not worth abstraction
- Zustand store package — state lives in page.tsx, no global store
- Package build step (tsup/tsc) — `transpilePackages` compiles source directly

---

## 1. Final Directory Structure

```
socrates-ai/
├── apps/
│   └── web/
│       ├── src/
│       │   └── app/
│       │       ├── api/
│       │       │   ├── deconstruct/route.ts
│       │       │   ├── reflect/route.ts
│       │       │   ├── synthesize/route.ts
│       │       │   └── test/route.ts
│       │       ├── globals.css
│       │       ├── layout.tsx
│       │       ├── page.tsx
│       │       └── favicon.ico
│       ├── package.json
│       ├── next.config.ts
│       ├── tsconfig.json
│       ├── postcss.config.mjs
│       ├── components.json
│       └── .env.local
├── packages/
│   ├── core/
│   │   ├── src/
│   │   │   ├── types.ts
│   │   │   ├── prompts.ts
│   │   │   ├── openai.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── ui/
│   │   ├── src/
│   │   │   ├── header.tsx
│   │   │   ├── chat-panel.tsx
│   │   │   ├── graph-canvas.tsx
│   │   │   ├── belief-node.tsx
│   │   │   ├── components/       ← shadcn/21st.dev installed here
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── typescript-config/
│       ├── base.json
│       ├── nextjs.json
│       ├── react-library.json
│       └── package.json
├── biome.json
├── lefthook.yml
├── mise.toml
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
├── tsconfig.json
├── .gitignore
└── .env.local
```

---

## 2. Package Boundaries

| Package | Scope | Contains | Dependencies |
|---|---|---|---|
| `@workspace/core` | Types + AI logic | `types.ts`, `prompts.ts`, `openai.ts` | `openai` |
| `@workspace/ui` | React components | `header`, `chat-panel`, `graph-canvas`, `belief-node` + shadcn primitives | `@workspace/core`, `@xyflow/react`, `react` (peer) |
| `@workspace/web` | Next.js app | routes, layout, page, API routes | `@workspace/core`, `@workspace/ui`, `@xyflow/react`, `next`, `react` |
| `@workspace/typescript-config` | Shared tsconfig | base/nextjs/react-library JSON | — |

**Rule:** `ui` depends on `core`. `core` depends on nothing internal. `web` depends on both. No circular deps.

---

## 3. Port List

### 3.1 `lib/` → `packages/core/src/`

| Source | Destination | Import Changes |
|---|---|---|
| `lib/types.ts` | `packages/core/src/types.ts` | None — pure interfaces |
| `lib/prompts.ts` | `packages/core/src/prompts.ts` | None — pure string consts |
| `lib/openai.ts` | `packages/core/src/openai.ts` | None — `import OpenAI from "openai"` unchanged |
| *(new)* | `packages/core/src/index.ts` | Barrel |

### 3.2 `components/` → `packages/ui/src/`

| Source | Destination | Import Changes |
|---|---|---|
| `components/Header.tsx` | `packages/ui/src/header.tsx` | None |
| `components/ChatPanel.tsx` | `packages/ui/src/chat-panel.tsx` | `@/lib/types` → `@workspace/core` |
| `components/BeliefNode.tsx` | `packages/ui/src/belief-node.tsx` | `@/lib/types` → `@workspace/core` |
| `components/GraphCanvas.tsx` | `packages/ui/src/graph-canvas.tsx` | `./BeliefNode` → `./belief-node` AND `@/lib/types` → `@workspace/core` |
| *(new)* | `packages/ui/src/index.ts` | Barrel |

### 3.3 `app/` → `apps/web/src/app/`

| Source | Destination | Import Changes |
|---|---|---|
| `app/layout.tsx` | `apps/web/src/app/layout.tsx` | None |
| `app/globals.css` | `apps/web/src/app/globals.css` | ADD `@source "../../../../packages/ui/src";` after `@import "tailwindcss";` |
| `app/favicon.ico` | `apps/web/src/app/favicon.ico` | None |
| `app/page.tsx` | `apps/web/src/app/page.tsx` | `@/components/*` → `@workspace/ui`; `@/lib/types` → `@workspace/core` |
| `app/api/deconstruct/route.ts` | `apps/web/src/app/api/deconstruct/route.ts` | `@/lib/openai`, `@/lib/prompts`, `@/lib/types` → `@workspace/core` |
| `app/api/reflect/route.ts` | `apps/web/src/app/api/reflect/route.ts` | Same 3 changes |
| `app/api/synthesize/route.ts` | `apps/web/src/app/api/synthesize/route.ts` | Same 3 changes |
| `app/api/test/route.ts` | `apps/web/src/app/api/test/route.ts` | `@/lib/openai` → `@workspace/core` |

---

## 4. New Files to Create

### 4.1 Root Configs

**`pnpm-workspace.yaml`** (REPLACE):
```yaml
packages:
  - "apps/*"
  - "packages/*"

allowBuilds:
  sharp: true
  unrs-resolver: true
```

**`package.json`** (REPLACE root):
```json
{
  "name": "socrates-ai",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "start": "turbo start",
    "check": "biome check --write --unsafe .",
    "lint": "biome check ."
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.4",
    "lefthook": "^1.11.0",
    "turbo": "^2.5.0",
    "typescript": "^5"
  }
}
```

**`turbo.json`**:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "start": {
      "cache": false,
      "persistent": true
    },
    "check": {
      "dependsOn": ["^check"]
    }
  }
}
```

**`biome.json`**:
```json
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "files": {
    "ignore": [".next", "node_modules", "dist", "coverage"]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "semicolons": "always",
      "trailingCommas": "es5"
    }
  }
}
```

**`lefthook.yml`**:
```yaml
pre-commit:
  parallel: true
  jobs:
    - run: pnpm check
      glob: "*.{ts,tsx,js,jsx,json}"
```

**`mise.toml`**:
```toml
[tools]
node = "22"
pnpm = "9"

[env]
_.file = ".env.local"
```

**`tsconfig.json`** (REPLACE root — project references):
```json
{
  "files": [],
  "references": [
    { "path": "./apps/web" },
    { "path": "./packages/ui" },
    { "path": "./packages/core" }
  ]
}
```

**`.gitignore`** (MODIFY):
```gitignore
# dependencies
node_modules

# next.js
.next/
out/

# production
build

# misc
.DS_Store
*.pem

# debug
*-debug.log*

# env files
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# turbo
.turbo
```

### 4.2 `packages/typescript-config/`

**`package.json`**:
```json
{
  "name": "@workspace/typescript-config",
  "private": true
}
```

**`base.json`**:
```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "incremental": true,
    "forceConsistentCasingInFileNames": true,
    "jsx": "react-jsx"
  }
}
```

**`nextjs.json`**:
```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**`react-library.json`**:
```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

### 4.3 `packages/core/`

**`package.json`**:
```json
{
  "name": "@workspace/core",
  "version": "0.1.0",
  "private": true,
  "exports": {
    ".": "./src/index.ts"
  },
  "main": "./src/index.ts",
  "dependencies": {
    "openai": "^6.48.0"
  },
  "devDependencies": {
    "@workspace/typescript-config": "workspace:*",
    "typescript": "^5"
  }
}
```

**`tsconfig.json`**:
```json
{
  "extends": "@workspace/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

**`src/index.ts`**:
```ts
export * from "./types";
export * from "./prompts";
export { openai, MODEL, provider } from "./openai";
```

### 4.4 `packages/ui/`

**`package.json`**:
```json
{
  "name": "@workspace/ui",
  "version": "0.1.0",
  "private": true,
  "exports": {
    ".": "./src/index.ts"
  },
  "main": "./src/index.ts",
  "dependencies": {
    "@workspace/core": "workspace:*",
    "@xyflow/react": "^12.11.2"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@workspace/typescript-config": "workspace:*",
    "typescript": "^5"
  }
}
```

**`tsconfig.json`**:
```json
{
  "extends": "@workspace/typescript-config/react-library.json",
  "include": ["src"]
}
```

**`src/index.ts`**:
```ts
export { default as Header } from "./header";
export { default as ChatPanel } from "./chat-panel";
export { default as GraphCanvas } from "./graph-canvas";
export { default as BeliefNode } from "./belief-node";
```

### 4.5 `apps/web/`

**`package.json`**:
```json
{
  "name": "@workspace/web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "@workspace/core": "workspace:*",
    "@workspace/ui": "workspace:*",
    "@xyflow/react": "^12.11.2",
    "next": "16.2.10",
    "openai": "^6.48.0",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@workspace/typescript-config": "workspace:*",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

**`tsconfig.json`**:
```json
{
  "extends": "@workspace/typescript-config/nextjs.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

**`next.config.ts`** (CRITICAL):
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/core"],
};

export default nextConfig;
```

**`postcss.config.mjs`** (copy as-is):
```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

**`components.json`** (for shadcn installs into packages/ui):
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "../../apps/web/src/app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "phosphor",
  "aliases": {
    "components": "@workspace/ui",
    "utils": "@workspace/ui/lib/utils",
    "ui": "@workspace/ui/components",
    "lib": "@workspace/ui/lib",
    "hooks": "@workspace/ui/hooks"
  }
}
```

---

## 5. Removal List (DESTRUCTIVE — execute LAST)

| File | Reason |
|---|---|
| `eslint.config.mjs` | Replaced by Biome |
| `app/` (entire dir) | Moved to `apps/web/src/app/` |
| `components/` (entire dir) | Moved to `packages/ui/src/` |
| `lib/` (entire dir) | Moved to `packages/core/src/` |
| `next.config.ts` (root) | Moved to `apps/web/next.config.ts` |
| `postcss.config.mjs` (root) | Moved to `apps/web/postcss.config.mjs` |
| `tsconfig.json` (root) | Replaced by project-references version |
| `next-env.d.ts` (root) | Auto-regenerates in `apps/web/` |
| `.next/` (root) | Stale, regenerates in `apps/web/` |

---

## 6. Step-by-Step Execution Order

### Phase A: Scaffold (create-only)

**Step 1** — Create directories:
```bash
mkdir -p apps/web/src/app/api/deconstruct
mkdir -p apps/web/src/app/api/reflect
mkdir -p apps/web/src/app/api/synthesize
mkdir -p apps/web/src/app/api/test
mkdir -p packages/core/src
mkdir -p packages/ui/src
mkdir -p packages/typescript-config
```

**Step 2** — Create root configs (§4.1): `turbo.json`, `biome.json`, `lefthook.yml`, `mise.toml`, root `tsconfig.json`, root `.gitignore`

**Step 3** — Modify root `package.json` (§4.1)

**Step 4** — Modify `pnpm-workspace.yaml` (§4.1)

**Step 5** — Create `packages/typescript-config/` files (§4.2)

**Step 6** — Create `packages/core/package.json` + `tsconfig.json` (§4.3)

**Step 7** — Create `packages/ui/package.json` + `tsconfig.json` (§4.4)

**Step 8** — Create `apps/web/package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `components.json` (§4.5)

### Phase B: Port Files (git mv + rewrite)

**Step 9** — Port `lib/` → `packages/core/src/`:
```bash
git mv lib/types.ts packages/core/src/types.ts
git mv lib/prompts.ts packages/core/src/prompts.ts
git mv lib/openai.ts packages/core/src/openai.ts
```
Create `packages/core/src/index.ts` (§4.3). No import changes in these 3 files.

**Step 10** — Port `components/` → `packages/ui/src/`:
```bash
git mv components/Header.tsx packages/ui/src/header.tsx
git mv components/ChatPanel.tsx packages/ui/src/chat-panel.tsx
git mv components/BeliefNode.tsx packages/ui/src/belief-node.tsx
git mv components/GraphCanvas.tsx packages/ui/src/graph-canvas.tsx
```
Create `packages/ui/src/index.ts` (§4.4). Rewrite imports (§3.2).

**Step 11** — Port `app/` → `apps/web/src/app/`:
```bash
git mv app/layout.tsx apps/web/src/app/layout.tsx
git mv app/globals.css apps/web/src/app/globals.css
git mv app/favicon.ico apps/web/src/app/favicon.ico
git mv app/page.tsx apps/web/src/app/page.tsx
git mv app/api/deconstruct/route.ts apps/web/src/app/api/deconstruct/route.ts
git mv app/api/reflect/route.ts apps/web/src/app/api/reflect/route.ts
git mv app/api/synthesize/route.ts apps/web/src/app/api/synthesize/route.ts
git mv app/api/test/route.ts apps/web/src/app/api/test/route.ts
```
Rewrite imports (§3.3).

### Phase C: Environment

**Step 12** — Copy `.env.local` to web app:
```bash
cp .env.local apps/web/.env.local
```
Keep root copy for mise. Do NOT touch contents.

### Phase D: Verify

**Step 13** — Install:
```bash
pnpm install
```
Expected: workspace links created, `apps/web/node_modules/@workspace/{core,ui}` symlinks exist, zero errors.

**Step 14** — Build:
```bash
pnpm build
```
Expected: `turbo run build` → `@workspace/web#build` → Next.js compiles → `.next/` in `apps/web/` → "✓ Compiled successfully".

**Step 15** — Dev:
```bash
pnpm dev
```
Expected: Next.js dev server on `localhost:3000` → app loads → belief input overlay visible.

**Step 16** — Biome format:
```bash
pnpm check
```

### Phase E: Cleanup (DESTRUCTIVE)

**Step 17** — Remove root-level files:
```bash
rm eslint.config.mjs
rm next.config.ts
rm postcss.config.mjs
rm next-env.d.ts
rm -rf .next
rm -rf app
rmdir lib components 2>/dev/null || true
```

**Step 18** — Commit:
```bash
git add -A
git commit -m "feat: migrate to pnpm/turborepo monorepo structure"
```

---

## 7. Verification Gate

| Command | What It Tests | Pass Criteria |
|---|---|---|
| `pnpm install` | Workspace linking | 0 errors. `apps/web/node_modules/@workspace/core` symlink exists |
| `pnpm build` | Next.js compiles all imports | `apps/web/.next/BUILD_ID` exists. No "Module not found" |
| `pnpm dev` | Runtime works | localhost:3000 loads. Belief input → deconstruct API → graph renders |
| `pnpm check` | Biome lint+format | 0 errors |
| Manual: POST `/api/test` | DeepSeek env var accessible | Returns `{ success: true, model: "deepseek-chat", provider: "deepseek" }` |

---

## 8. Risk Callouts

### RISK #1 — Tailwind v4 Content Detection (CRITICAL)
**Problem:** Tailwind v4 auto-scans current project tree. `packages/ui/src/*.tsx` is OUTSIDE `apps/web/` — Tailwind won't see classes. Components render unstyled.
**Fix:** `@source "../../../../packages/ui/src";` in `apps/web/src/app/globals.css` (Step 11).
**Path math:** From `apps/web/src/app/globals.css` → up 4 dirs (`app→src→web→apps→root`) → into `packages/ui/src`.

### RISK #2 — transpilePackages (CRITICAL)
**Problem:** Without `transpilePackages: ["@workspace/ui", "@workspace/core"]`, Next.js can't compile workspace packages. Error: `Module not found: Can't resolve '@workspace/ui'`.
**Fix:** `apps/web/next.config.ts` must include `transpilePackages` (Step 8).

### RISK #3 — @xyflow/react CSS Import
`graph-canvas.tsx` imports `@xyflow/react/dist/style.css`. With `transpilePackages`, Next.js processes CSS imported in workspace packages. Should work but verify in build.

### RISK #4 — `packages/ui` peer deps for `react`/`react-dom`
`react` listed as peerDependency in `packages/ui`. `apps/web` provides it. pnpm handles this. May need `.npmrc` with `strict-peer-dependencies=false` if warnings appear.

### RISK #5 — `.next/` location
After migration, `.next/` lives in `apps/web/`. Root `.next/` is stale (Step 17 removes it).

### RISK #6 — `next-env.d.ts`
Next.js auto-generates in the app directory. Root one is stale. Step 17 removes it; Next regenerates in `apps/web/`.

### RISK #7 — DeepSeek API key
`packages/core/src/openai.ts` reads `process.env.DEEPSEEK_API_KEY`. Next.js API routes access `process.env` server-side. `.env.local` must be in `apps/web/` (Step 12).
**Verify:** Hit `/api/test` → returns `provider: "deepseek"`.

### RISK #8 — Turbo Dev Overhead (Minor)
`pnpm dev` → `turbo dev` → `next dev` adds ~1s startup vs direct. For faster iteration, run `pnpm --filter @workspace/web dev` to bypass turbo.

---

## End

Execute Phase A → B → C → D → E top-to-bottom. No backtracking. All file moves use `git mv` to preserve history.
