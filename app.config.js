import 'dotenv/config';

export default {
  expo: {
    name: "aqualina-app",
    slug: "aqualina-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      edgeToEdgeEnabled: false,
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.aoristotech.aqualinaapp",
      googleServicesFile: "./env/google-services.json"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      "expo-secure-store",
      "expo-notifications"
    ],
    extra: {
      router: {},
      eas: {
        projectId: "0de17066-9498-42cc-a625-92aae2301454"
      },
      backendUri: process.env.EXPO_PUBLIC_BACKEND_URI 
    }
  }
};
