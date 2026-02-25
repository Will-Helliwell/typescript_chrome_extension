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

## Project Structure

```
typescript_chrome_extension/
├── .husky/              # Git hooks configuration
├── dist/                # Build output (generated)
│   ├── popup.js        # Bundled JavaScript
│   └── output.css      # Compiled CSS
├── images/             # Extension icons
│   └── icons/
├── src/                # Source files
│   ├── App.tsx         # Main React component
│   ├── index.tsx       # React entry point
│   ├── popup.ts        # TypeScript utility (example)
│   └── input.css       # Tailwind CSS source
├── manifest.json       # Chrome extension manifest
├── popup.html          # Extension popup HTML
├── package.json        # Node dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── eslint.config.js    # ESLint configuration
└── .prettierrc         # Prettier configuration
```

## Tech Stack

- **React 19** - UI library
- **TypeScript 5** - Type-safe JavaScript
- **Tailwind CSS 3** - Utility-first CSS framework
- **esbuild** - Fast JavaScript bundler
- **ESLint** - TypeScript/React linting
- **Prettier** - Code formatting
- **htmlhint** - HTML linting
- **Husky** - Git hooks for pre-commit checks
- **lint-staged** - Run linters on staged files

## Git Hooks

This project uses Husky to run checks before each commit:

- HTML files are validated with htmlhint
- TypeScript/React files are linted with ESLint
- All files are formatted with Prettier

Commits will be blocked if linting or formatting issues are found.

## Configuration Files

- `.prettierrc` - Prettier formatting rules
- `.htmlhintrc` - HTML validation rules
- `eslint.config.js` - ESLint rules for TypeScript/React
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
