import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.ionic.starter",
  appName: "Cardownik",
  webDir: "www",
  server: {
    androidScheme: "https",
  },
  plugins: {
    LocalNotifications: {
      iconColor: "#488AFF",
    },
  },
  android: {
    useLegacyBridge: true,
  },
};

export default config;
