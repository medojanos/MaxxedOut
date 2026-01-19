import "dotenv/config";

export default {
  "expo": {
    "name": "MaxxedOut",
    "slug": "MaxxedOut",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#F5EDED"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#F5EDED"
      },
      "edgeToEdgeEnabled": true,
      "package": "com.medojanos.MaxxedOut"
    },
    "extra": {
      "eas": {
        "projectId": "e3330407-7f87-4ede-8221-2cb3d0314beb",
      },
      API_URL: process.env.API_URL,
      WEB_URL: process.env.WEB_URL
    }
  }
}