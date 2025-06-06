# NovelSynth

NovelSynth is a browser extension that uses AI to enhance, analyze, and summarize web content, with a special focus on novels, articles, and educational material.

## Features

- **Content Enhancement**: Improve text quality, readability, and flow
- **Smart Summarization**: Generate concise summaries of long content
- **Content Analysis**: Get insights into text structure, complexity, and more
- **Translation**: Translate content to different languages
- **History Tracking**: Keep track of your enhancement history per domain
- **React-based UI**: Modern, responsive interface built with React and Ant Design

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development build:
   ```
   npm run dev
   ```
4. Load the extension from the `dist` folder in your browser

## Building for Production

```
npm run build
```

This will create a production-ready build in the `dist` folder.

## Tech Stack

- React for UI components
- Ant Design for UI library
- Webpack for bundling
- Chrome Extension APIs
- CSS for styling

## Folder Structure

```
novelsynth/
├── dist/                # Built extension
├── src/                 # Source code
│   ├── content/         # Content script
│   ├── popup/           # Popup UI
│   ├── utils/           # Utilities
│   ├── styles/          # CSS styles
│   ├── background.js    # Background script
│   ├── popup.js         # Popup entry point
│   └── popup.html       # Popup HTML
├── icons/               # Extension icons
├── manifest.json        # Extension manifest
├── webpack.config.js    # Webpack configuration
└── package.json         # Dependencies and scripts
```

## License

MIT
