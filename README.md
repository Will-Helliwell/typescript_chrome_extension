# TypeScript Chrome Extension

A Chrome extension built with React, TypeScript, and Tailwind CSS.

## Prerequisites

- Node.js (v20.11.1 or higher)
- npm (v10.2.4 or higher)
- Google Chrome browser

## Installation

1. Clone the repository and navigate to the project directory

2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

## Development

### Watch Mode

For active development, use watch mode to automatically rebuild when files change:

```bash
npm run watch
```

This runs both the JavaScript and CSS watchers concurrently.

You can also run them separately:

```bash
npm run watch:js   # Watch TypeScript/React files
npm run watch:css  # Watch CSS files
```

### Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right corner)
3. Click "Load unpacked"
4. Select the project directory
5. The extension icon should appear in your toolbar

### Reloading Changes

After making changes:

1. The build will automatically run if you're using `npm run watch`
2. Go to `chrome://extensions/`
3. Click the reload icon on your extension card
4. Click the extension icon to see your changes

## Production Build

To create a production build:

```bash
npm run build
```

This will:

- Bundle all React/TypeScript code into `dist/popup.js`
- Compile Tailwind CSS into `dist/output.css`

## Available Scripts

### Build Commands

- `npm run build` - Build both JavaScript and CSS
- `npm run build:js` - Bundle React/TypeScript code
- `npm run build:css` - Compile Tailwind CSS

### Watch Commands

- `npm run watch` - Watch both JavaScript and CSS files
- `npm run watch:js` - Watch TypeScript/React files
- `npm run watch:css` - Watch CSS files

### Linting & Formatting

- `npm run lint` - Run all linters (HTML + TypeScript)
- `npm run lint:html` - Lint HTML files with htmlhint
- `npm run lint:ts` - Lint TypeScript/React files with ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format all files with Prettier
- `npm run format:check` - Check if files are formatted correctly

### Testing

- `npm test` - Run the full test suite once
- `npm run test:watch` - Re-run affected tests as files change
- `npm run test:coverage` - Run the suite and write a coverage report to `coverage/`

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

`jsdom` has no `chrome` object, so `tests/setup.ts` installs a typed mock as
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

### Notes

- `ts-jest` type-checks each test file as it runs, so `npm test` catches type
  errors as well as assertion failures. `jest.config.js` documents how to switch
  to transpile-only if the suite ever gets slow.
- `src/index.tsx` is excluded from coverage: it only mounts React into the DOM.

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

## Troubleshooting

### Extension not loading

- Ensure you've run `npm run build` before loading the extension
- Check that the `dist/` directory exists and contains `popup.js` and `output.css`

### Changes not appearing

- Make sure to reload the extension in `chrome://extensions/`
- Check the browser console (right-click extension popup → Inspect) for errors

### Build errors

- Delete `node_modules/` and `package-lock.json`, then run `npm install` again
- Ensure you're using Node.js v20.11.1 or higher
