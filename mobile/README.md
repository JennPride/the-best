# Mobile app

Expo (React Native) app with auth and restaurant search via Google Maps.

## Run

```bash
npm install
npm start
```

Then open in iOS Simulator (`i`), Android emulator (`a`), or scan the QR code with Expo Go.

## Restaurant search (Google Maps / Places)

The Home screen searches for restaurants using the **Google Places API (New)** and shows results on a map.

1. **Create a Google Cloud project** and enable:
   - [Places API (New)](https://console.cloud.google.com/apis/library/places-backend.googleapis.com)
   - **Maps SDK for Android** (for the map on Android)
   - **Maps SDK for iOS** (optional; iOS can use Apple Maps without a key)

2. **Create an API key** in [Credentials](https://console.cloud.google.com/apis/credentials) and restrict it by app (Android package / iOS bundle ID) if you want.

3. **Set the key** when starting the app:

   ```bash
   export EXPO_PUBLIC_GOOGLE_MAPS_API_KEY="your-api-key"
   npm start
   ```

   Or add to a `.env` file and load it (e.g. with `expo-dotenv` or by sourcing before `npm start`).

If the key is missing, the app will show an alert when you tap Search.
