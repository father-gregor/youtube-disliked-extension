# <img src="src/assets/icons/icon128.png" width="45" align="left"> Youtube Disliked (Google Chrome Extension) 

> Google Chrome extension - missing 'Disliked' section for Youtube

Adds new section 'Disliked' to Youtube UI to show a list of all videos that you disliked via selected account.

#### Features
- Button in Youtube sidebar to open disliked videos list
- New section in 'Library' to show latest disliked videos
- Dark mode (depends on Youtube's current theme)
- Multi-language (depends on Youtube's current language)

## Install

[Download in **Chrome Web Store**](https://github.com/father-gregor/youtube-disliked-extension "Install extension from Chrome Web Store") (not yet)

## Development

Extension written in Typescript (mostly) with React for UI and Webpack for bundling. If you need example of how to use React for browser extension or example of Webpack configuration feel free to use this repo as a start.

### Preparation
Before you can build or load extension to browser you first need to create `vault.env` file in the root of repo folder and fill-in environment variables. Because extension need to make authorized requests to Youtube, you'll need to register OAuth key via [Google Console](https://console.developers.google.com/) and add it to `vault.env`.

### Install Dependencies

```
npm i
```

### Build

For production:
```
npm run build
```
For development with watch mode:
```
npm run watch
```

### Load to Chrome

1. Clone repo: `git checkout https://github.com/father-gregor/youtube-disliked-extension.git`
2. Go to Chrome extensions page - chrome://extensions
3. Enable Developer mode
4. Click on "Load unpacked extension", select folder with builded extension `...repo-path/dist/youtube-disliked`

