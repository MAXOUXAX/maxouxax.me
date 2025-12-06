import {
  defineCloudflareConfig,
  type OpenNextConfig,
} from "@opennextjs/cloudflare";

export default {
  ...defineCloudflareConfig({}),
  cloudflare: {
    skewProtection: {
      enabled: true,
    },
  },
} satisfies OpenNextConfig;
