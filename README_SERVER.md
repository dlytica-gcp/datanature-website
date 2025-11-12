# Running DataNature Website Locally

## Important: Don't Open HTML Files Directly

Opening `index.html` directly from the file system (using `file://` protocol) causes:
- **Permissions Policy violations** (autoplay, encrypted-media, etc.)
- **CORS errors** with manifest.json
- **YouTube Error 153** (video player configuration errors)

## Solution: Use a Local Web Server

### Option 1: Python (Recommended)
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000`

### Option 2: Node.js (npx serve)
```bash
npx serve
```

### Option 3: PHP
```bash
php -S localhost:8000
```

### Option 4: VS Code Live Server Extension
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## What Was Fixed

1. ✅ Added **Permissions-Policy** meta tag to allow all required YouTube embed features
2. ✅ Created `manifest.json` file (was missing)
3. ✅ Created `cms.js` file (was missing)
4. ✅ Added graceful error handling for file:// protocol
5. ✅ Fixed YouTube embed configuration for Error 153

## Testing

After starting a local server, the website should work without errors:
- ✅ No permissions policy violations
- ✅ No CORS errors
- ✅ YouTube videos should play without Error 153
- ✅ All features should work correctly

