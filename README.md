# RecMan FE Test project (React + Vite + Zustand)

A lightweight Kanban-style task board with desktop drag-and-drop, mobile-friendly actions, theming, and local persistence.

## Features
- Drag & drop **columns** and **tasks** (desktop)
- Mobile long-press action sheet for moving tasks/columns
- Multi-select, **bulk complete** and **bulk delete**
- Fuzzy search with **highlighted** matches
- **Light/Dark** theme via custom ThemeProvider
- Local persistence (via `localStorage`)
- Custom UI kit (Button, Input, Checkbox) built with Emotion
- Modals rendered via React Portal
- Path alias: `@` → `src`

## Tech Stack
- **React** + **Vite** + **TypeScript**
- **Zustand** (with `immer`, `persist`, `devtools`)
- **@atlaskit/pragmatic-drag-and-drop** (DnD)
- **Emotion** (`@emotion/react`, `@emotion/styled`)
- **Heroicons** (`@heroicons/react`)
- **uuid**

## Getting Started

### Prerequisites
- Node.js **18+**

### Install
```bash
# or npm
npm install
```

### Run Dev Server
```bash
# npm
npm run dev
```
Open http://localhost:5173

### Build
```bash
# npm
npm run build
```

### Preview Production Build
```bash
# npm
npm run preview
```

## Folder Structure (excerpt)
```
src/
  components/
    board/
      components/
        column/
        task/
    common/
      modal/
      header/
      mobile-action-sheet/
    ui/   
      button/
      card/
      checkbox/
      input/
      select/
      textarea/
  hooks
    useBodyScrollLock
    useLongPress
  store/
    useBoardStore.ts
    useModalStore.ts
  theme/
  utils/
```
## Notes
- Desktop uses pointer-based DnD; on mobile, use the long-press **action sheet** to move tasks or columns.
- State is persisted in `localStorage`; clear it to reset the board.
- If TypeScript complains about the `@` alias, ensure these configs:

**tsconfig.json**
```jsonc
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"]
    }
  }
}
```

**vite.config.ts**
```ts
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: { plugins: ["@emotion/babel-plugin"] }
    })
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") }
  }
});
```

> If using TS for `vite.config.ts`, install Node types:  
> `npm install -D @types/node`.

## License
MIT
