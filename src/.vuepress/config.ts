import { defineUserConfig } from "vuepress";
import theme from './theme.ts';

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "zh-CN",
      title: "Etheral的博客",
      description: " ",
    },
  },

  theme,

  shouldPrefetch: false,
});
