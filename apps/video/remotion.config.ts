import path from "node:path";
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

Config.overrideWebpackConfig((current) => {
  return {
    ...current,
    resolve: {
      ...current.resolve,
      alias: {
        ...current.resolve?.alias,
        "@": path.resolve(process.cwd(), "src"),
      },
    },
  };
});
