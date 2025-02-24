# Testing PWA Features on Android Device

## Prerequisites
- Node.js installed on your development machine
- An Android device with Chrome browser
- Both your computer and Android device on the same network

## Setup Steps

1. Build and serve the application:
```bash
npm run build
npm run start
```

2. Set up HTTPS access (choose one method):

   ### Using ngrok:
   1. Install ngrok: `npm install -g ngrok`
   2. Run ngrok: `ngrok http 3000`
   3. Copy the HTTPS URL provided by ngrok

   ### Or using local network:
   1. Find your computer's local IP address
   2. Access via `http://your-ip-address:3000`

3. On your Android device:
   1. Open Chrome browser
   2. Navigate to your application's HTTPS URL
   3. Wait for the "Add to Home Screen" prompt
   4. If no prompt appears:
      - Tap the three dots menu (⋮)
      - Select "Add to Home Screen"
      - Follow the prompts

4. The app will now be installed on your device as a PWA
   - Look for the app icon on your home screen
   - Launch it to verify it opens in standalone mode

## Troubleshooting

If you don't see the "Add to Home Screen" prompt:
1. Ensure your manifest.json is properly configured
2. Verify your service worker is registered
3. Check that you're accessing the site via HTTPS
4. Make sure the PWA criteria are met in Chrome DevTools > Application > Manifest
