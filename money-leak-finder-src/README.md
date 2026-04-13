# Money Leak Finder — Source

Source code for the [Money Leak Finder](../money-leak-finder/) tool, built with Vite + React + TypeScript + Tailwind.

The `money-leak-finder/` folder at the repo root contains the **built output** served by GitHub Pages. This folder contains the **source** you edit.

---

## Making changes

### 1. Install dependencies
```bash
cd money-leak-finder-src
npm install
```

### 2. Run locally
```bash
npm run dev
```
Opens at `http://localhost:3000`.

### 3. Build
```bash
npx vite build --base='./'
```
The `--base='./'` flag ensures asset paths are relative, so the app works in the `/money-leak-finder/` subfolder on GitHub Pages.

### 4. Deploy
```bash
cp -r dist/* ../money-leak-finder/
```

### 5. Commit both folders
```bash
cd ..
git add money-leak-finder/ money-leak-finder-src/
git commit -m "Update Money Leak Finder"
git push
```

---

## Project structure

```
src/
  App.tsx        # Main app component
  data/
    leaks.ts     # The 17 money leak questions and data
  index.css      # Global styles
  main.tsx       # Entry point
public/
  logo.png       # KeepyCash logo (koala)
```

## Key files to edit

- **Questions/data** → `src/data/leaks.ts`
- **UI and logic** → `src/App.tsx`
- **Logo** → replace `public/logo.png`
