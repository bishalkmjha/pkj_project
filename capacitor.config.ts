import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  // NOTE: appId is permanent once the app is uploaded to Google Play. Change it before the first release.
  appId: "com.pkjproject.sakhi",
  appName: "Sakhi",
  webDir: "dist",
  android: { allowMixedContent: false },
  plugins: {
    LocalNotifications: { smallIcon: "ic_stat_sakhi", iconColor: "#C2416B" },
  },
};

export default config;
