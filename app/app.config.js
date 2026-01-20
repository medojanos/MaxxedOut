import "dotenv/config";

export default {
  "expo": {
    "name": "MaxxedOut",
    "slug": "maxxedout",
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
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/icon.png",
        "backgroundColor": "#F5EDED"
      },
      "edgeToEdgeEnabled": true,
      "package": "com.medojanos.maxxedout"
    },
    "extra": {
      "eas": {
        "projectId": "648275ea-05c3-4716-be3f-e0bdd47054e1"
      },
      API_URL: process.env.API_URL,
      WEB_URL: process.env.WEB_URL
    }
  }
}