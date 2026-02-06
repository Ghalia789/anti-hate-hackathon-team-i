# Extension Browser Installation Guide

## Chrome / Brave

### Development Mode

1. **Build the extension**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Load in browser**
   - Open Chrome/Brave
   - Navigate to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top-right)
   - Click **Load unpacked**
   - Select the `frontend/dist` folder
   - Extension icon should appear in toolbar

3. **Configure API URL**
   - Click extension icon
   - Extension will connect to `http://localhost:5000/api` by default
   - Make sure backend is running

### Production Build

For production deployment:
```bash
cd frontend
npm run build
# Package dist folder as .zip
zip -r extension.zip dist/
```

Upload to Chrome Web Store or distribute manually.

## Firefox

### Temporary Installation (Development)

1. **Build the extension**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Load in Firefox**
   - Open Firefox
   - Navigate to `about:debugging#/runtime/this-firefox`
   - Click **Load Temporary Add-on**
   - Select `frontend/dist/manifest.json`
   - Extension icon should appear in toolbar

**Note**: Temporary extensions are removed when Firefox closes.

### Permanent Installation

For permanent installation, you need to:
1. Sign the extension through Firefox Add-ons
2. Create an account on https://addons.mozilla.org
3. Submit your extension for review

Or use Firefox Developer Edition:
```bash
# Install web-ext
npm install -g web-ext

# Run in Firefox Developer Edition
cd frontend/dist
web-ext run --firefox=firefoxdeveloperedition
```

## Edge

Same process as Chrome:
1. Navigate to `edge://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select `frontend/dist` folder

## Opera

1. Navigate to `opera://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select `frontend/dist` folder

## Testing the Extension

### 1. Check Installation
- Extension icon should appear in browser toolbar
- Click icon to open popup
- Should see "Anti-Hate Speech" interface

### 2. Test Manual Analysis
- Click extension icon
- Enter text in textarea: "This is a wonderful day!"
- Click "Analyze Text"
- Should see sentiment and toxicity results

### 3. Test Real-time Detection
- Click the toggle button to **Active**
- Visit any website with text input (e.g., Twitter, Facebook)
- Start typing in a text field
- After 1 second of inactivity, text will be analyzed
- Toxic content will show a warning below the field

### 4. Verify API Connection
- Open browser DevTools (F12)
- Go to Console tab
- Look for any error messages
- Should see "Anti-hate detection initialized" when active

## Troubleshooting

### Extension not loading
- Check that `manifest.json` is in the correct location
- Verify all files are built correctly
- Check browser console for errors

### API connection failed
- Ensure backend is running: `curl http://localhost:5000/api/health`
- Check CORS settings in backend
- Verify API_URL in `frontend/src/App.jsx`

### Real-time detection not working
- Make sure extension is **Active** (green toggle)
- Check browser console for errors
- Verify permissions in `manifest.json`

### Icons not showing
- Icons should be in `frontend/public/icons/` directory
- Create placeholder icons if missing:
  - 16x16px: `icon16.png`
  - 48x48px: `icon48.png`
  - 128x128px: `icon128.png`

## Creating Icons

If icons are missing, create them:

```bash
# Using ImageMagick to create placeholder icons
cd frontend/public
mkdir -p icons

# Create simple colored squares as placeholders
convert -size 16x16 xc:#667eea icons/icon16.png
convert -size 48x48 xc:#667eea icons/icon48.png
convert -size 128x128 xc:#667eea icons/icon128.png
```

## Development Tips

### Hot Reload
For development with auto-reload:
```bash
cd frontend
npm run dev
# Open http://localhost:3000 in browser
```

### Debug Extension
- Right-click extension icon → "Inspect popup"
- Opens DevTools for extension popup
- Can debug React components and API calls

### View Background Script Logs
- Open `chrome://extensions/`
- Find your extension
- Click "background page" or "service worker"
- View console logs from background script

### Monitor Content Script
- Open any webpage
- Open DevTools (F12)
- Console will show content script logs
- Look for "Anti-hate detection" messages

## Updating the Extension

When you make changes:
```bash
# Rebuild
cd frontend
npm run build

# Reload in browser
# Chrome/Brave: go to chrome://extensions/ and click reload icon
# Firefox: remove and re-add temporary extension
```

## Distribution

### Chrome Web Store
1. Create developer account ($5 one-time fee)
2. Package extension as .zip
3. Upload to Chrome Web Store Dashboard
4. Fill in details and submit for review

### Firefox Add-ons
1. Create account on addons.mozilla.org
2. Submit extension for review
3. Wait for approval (usually 1-3 days)

### Self-hosting
Share the .zip file directly:
- Users download .zip
- Extract to folder
- Load as unpacked extension (development mode)
