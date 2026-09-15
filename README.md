# TypeScript Chrome Extension

A Chrome extension built with React, TypeScript, and Tailwind CSS.

## Prerequisites

- Node.js (v20.11.1 or higher)
- npm (v10.2.4 or higher)
- Google Chrome browser

## Quick Reference

Coming back to this project cold? This is the whole loop:

| I want to...                     | Command / action                                    |
| -------------------------------- | --------------------------------------------------- |
| Set up from scratch              | `npm install` → `npm run build` → load in Chrome    |
| Develop with auto-rebuild        | `npm run watch` (leave running)                     |
| See a code change in the browser | Reload the extension card at `chrome://extensions/` |
| See the popup's console / errors | Right-click the extension icon → **Inspect popup**  |
| Run the tests                    | `npm test`                                          |
| Run tests continuously           | `npm run test:watch` (leave running)                |
| Check everything before pushing  | `npm run lint && npm run type-check && npm test`    |

Full detail on each of these below.

## Getting Started

Do this the first time you clone the project, or when returning after a long
break.

### 1. Install dependencies

```bash
npm install
```

### 2. Build the extension

```bash
npm run build
```

This produces the two files the extension actually loads:

- `dist/popup.js` — your bundled React/TypeScript code
- `dist/output.css` — your compiled Tailwind CSS

Nothing will work until these exist, because `popup.html` references them
directly.

### 3. Load the extension into Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Turn on **Developer mode** (toggle, top right)
3. Click **Load unpacked**
4. Select the **project root directory** — not the `dist/` folder. Chrome needs
   `manifest.json`, which lives at the root.
5. The extension icon appears in your toolbar. Pin it (puzzle-piece icon → pin)
   so it stays visible.

### 4. Confirm it works

Click the extension icon. You should see the popup with a title, a click count,
and a **Click Me** button. If you don't, jump to
[Troubleshooting](#troubleshooting).

You only do steps 1–3 once. From then on, you're in the development loop below.

## The Development Loop

### Start the watchers

Leave this running in a terminal for your whole session:

```bash
npm run watch
```

It rebuilds `dist/popup.js` and `dist/output.css` automatically every time you
save a file. It does **not** exit on its own — stop it with `Ctrl+C` when you're
done.

You can run the two halves separately if you only care about one:

```bash
npm run watch:js   # Watch TypeScript/React files
npm run watch:css  # Watch CSS files
```

### After each change: seeing the result

This is the part that catches people out. **Saving a file is not enough** —
the watcher rebuilds your code, but Chrome is still running the _old_ copy it
loaded earlier. Every time you want to see a change:

1. **Save the file.** Check the watcher terminal shows a rebuild with no errors.
2. **Go to `chrome://extensions/` and click the reload icon** (circular arrow)
   on this extension's card. This is the step that's easy to forget.
3. **Click the extension icon** to open the popup and see your change.

If the popup was already open, close and reopen it — it does not live-refresh.

### Seeing errors and console output

The popup is its own little web page with its own console. `console.log` output
and runtime errors go there, _not_ to the page you were looking at:

> Right-click the extension icon → **Inspect popup**

That opens DevTools attached to the popup. Keep it open while developing. Note
that closing the popup closes DevTools with it.

### Checking your work

Run the test suite while you develop — it's much faster than reloading Chrome
for things that don't need a browser:

```bash
npm run test:watch   # re-runs affected tests as you save
```

Before committing or pushing, run the full set:

```bash
npm run lint         # HTML + TypeScript linting
npm run type-check   # TypeScript errors
npm test             # full test suite
```

The git hooks run these for you (see [Git Hooks](#git-hooks)), but running them
yourself is faster than finding out at push time.

## Troubleshooting

### The popup is blank, or the extension won't load

- Have you run `npm run build`? Check `dist/` exists and contains **both**
  `popup.js` and `output.css`.
- Did you select the **project root** when loading unpacked, not `dist/`?
- Check the extension card at `chrome://extensions/` for a red **Errors**
  button, and click it.

### My changes aren't showing up

In order of how often it's the cause:

1. **You didn't reload the extension.** Go to `chrome://extensions/` and click
   the reload icon on the card. Saving the file alone never updates Chrome.
2. **The popup was already open.** Close and reopen it.
3. **The watcher isn't running, or it errored.** Check the terminal running
   `npm run watch` for a build error — a TypeScript error stops the rebuild, so
   Chrome keeps serving the last good bundle.
4. **Tailwind isn't picking up your classes.** `tailwind.config.js` only scans
   the paths listed in its `content` array. A new file outside those paths gets
   no CSS generated for it.

### A `chrome.*` call works in tests but fails in the browser

Check `manifest.json`. Extension APIs need to be declared in `permissions`
before Chrome will allow them at runtime.

`permissions` is currently **empty**, so the `chrome.storage` example in
`src/utils/storage.ts` will throw if you actually call it in the browser. To use
it for real, add:

```json
"permissions": ["storage"]
```

then reload the extension. The test mock deliberately doesn't enforce
permissions — it tests your logic, not Chrome's rules — so this class of problem
only shows up when you run the real thing.

### Tests are extremely slow the first time

Expected. `ts-jest` compiles everything from cold on the first run, which can
take 30 seconds or more. Subsequent runs use a cache and take a second or two.
It is not hung.

### Build errors after pulling changes

- Run `npm install` — a dependency was probably added.
- Failing that, delete `node_modules/` and `package-lock.json`, then run
  `npm install` again.
- Ensure you're on Node.js v20.11.1 or higher (`node -v`).

## Testing

Tests run on [Jest](https://jestjs.io/) with
[ts-jest](https://kulshekhar.github.io/ts-jest/) and
[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/),
in a `jsdom` environment.

### Where tests live

Test files sit next to the code they cover, named `*.test.ts` or `*.test.tsx`:

```
src/
├── App.tsx
├── App.test.tsx          # component test
└── utils/
    ├── format.ts
    ├── format.test.ts    # plain unit test
    ├── storage.ts
    └── storage.test.ts   # test using the chrome API mock
```

Shared test infrastructure lives in `tests/` and contains no tests itself.
Because esbuild bundles only from `src/index.tsx`, test files are never
included in the build output.

### Writing a component test

`@testing-library/jest-dom` matchers are registered globally, so
`toBeInTheDocument()` and friends are available without importing anything:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

it('increments the count on click', async () => {
  const user = userEvent.setup();
  render(<App title="My Extension" />);

  await user.click(screen.getByRole('button', { name: 'Click Me' }));

  expect(screen.getByText('Click count: 1')).toBeInTheDocument();
});
```

### Testing code that uses Chrome APIs

Tests run in Node, not in Chrome, so there is no real `chrome` object — any code
touching `chrome.*` would throw. `tests/setup.ts` installs a typed mock as
`globalThis.chrome` before every test. Import `chromeMock` to configure calls
and make assertions:

```ts
import { chromeMock } from '../../tests/setup';
import { readSetting } from './storage';

it('returns the stored value', async () => {
  chromeMock.storage.local.get.mockResolvedValue({ theme: 'dark' });

  await expect(readSetting('theme', 'light')).resolves.toBe('dark');
});
```

The mock is rebuilt before each test, so call history and overrides never leak
between tests.

It covers `chrome.storage.local`, `chrome.runtime` and `chrome.tabs` — the APIs
this template uses. To stub another API, add it to `ChromeMock` and
`createChromeMock()` in [`tests/mocks/chrome.ts`](tests/mocks/chrome.ts),
following the existing shape of one `jest.fn()` per method.

These tests prove your own logic is right. They can't catch a misunderstanding
of how Chrome really behaves — including missing `manifest.json` permissions —
so still load the extension and try it for anything browser-dependent.

### Notes

- `ts-jest` type-checks each test file as it runs, so `npm test` catches type
  errors as well as assertion failures. `jest.config.js` documents how to switch
  to transpile-only if the suite ever gets slow.
- `src/index.tsx` is excluded from coverage: it only mounts React into the DOM.

## Available Scripts

### Build Commands

- `npm run build` - Build both JavaScript and CSS
- `npm run build:js` - Bundle React/TypeScript code
- `npm run build:css` - Compile Tailwind CSS

### Watch Commands

- `npm run watch` - Watch both JavaScript and CSS files
- `npm run watch:js` - Watch TypeScript/React files
- `npm run watch:css` - Watch CSS files

### Testing

- `npm test` - Run the full test suite once
- `npm run test:watch` - Re-run affected tests as files change
- `npm run test:coverage` - Run the suite and write a coverage report to `coverage/`

### Linting & Formatting

- `npm run lint` - Run all linters (HTML + TypeScript)
- `npm run lint:html` - Lint HTML files with htmlhint
- `npm run lint:ts` - Lint TypeScript/React files with ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format all files with Prettier
- `npm run format:check` - Check if files are formatted correctly

## Project Structure

```
typescript_chrome_extension/
├── .github/workflows/   # CI pipeline
├── .husky/              # Git hooks configuration
├── coverage/            # Coverage reports (generated)
├── dist/                # Build output (generated)
│   ├── popup.js         # Bundled JavaScript
│   └── output.css       # Compiled CSS
├── images/              # Extension icons
│   └── icons/
├── src/                 # Source files
│   ├── App.tsx          # Main React component
│   ├── App.test.tsx     # Tests, colocated with the code they cover
│   ├── index.tsx        # React entry point
│   ├── input.css        # Tailwind CSS source
│   └── utils/           # Example helpers and their tests
├── tests/               # Shared test infrastructure (no tests itself)
│   ├── setup.ts         # jest-dom matchers + global chrome mock
│   └── mocks/chrome.ts  # Typed chrome API mock
├── manifest.json        # Chrome extension manifest
├── popup.html           # Extension popup HTML
├── package.json         # Node dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── jest.config.js       # Jest configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── eslint.config.js     # ESLint configuration
└── .prettierrc          # Prettier configuration
```

## Tech Stack

- **React 19** - UI library
- **TypeScript 5** - Type-safe JavaScript
- **Tailwind CSS 3** - Utility-first CSS framework
- **esbuild** - Fast JavaScript bundler
- **Jest 30** - Test runner
- **ts-jest** - TypeScript transform for Jest
- **React Testing Library** - Component testing
- **ESLint** - TypeScript/React linting
- **Prettier** - Code formatting
- **htmlhint** - HTML linting
- **Husky** - Git hooks for pre-commit and pre-push checks
- **lint-staged** - Run linters on staged files

## Git Hooks

This project uses Husky for two hooks.

**pre-commit** runs lint-staged against staged files only, so commits stay fast:

- HTML files are validated with htmlhint
- TypeScript/React files are linted with ESLint
- All files are formatted with Prettier

**pre-push** runs the slower, whole-project checks:

- `npm run type-check`
- `npm test`

Commits are blocked on linting or formatting issues; pushes are blocked on type
errors or failing tests. To bypass a hook in an emergency, use `--no-verify`.

## Continuous Integration

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every push to
`main` and on every pull request: lint, format check, type check, tests with
coverage, and a production build.

## Configuration Files

- `.prettierrc` - Prettier formatting rules
- `.htmlhintrc` - HTML validation rules
- `eslint.config.js` - ESLint rules for TypeScript/React
- `jest.config.js` - Jest test runner options
- `tsconfig.json` - TypeScript compiler options
- `tailwind.config.js` - Tailwind CSS content paths and theme
- `postcss.config.js` - PostCSS plugins configuration
