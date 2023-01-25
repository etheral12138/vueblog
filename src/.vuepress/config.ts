import {defineUserConfig} from "vuepress";
import {autoCatalogPlugin} from "vuepress-plugin-auto-catalog";
import { hopeTheme } from "vuepress-theme-hope";
import theme from "./theme";
export default defineUserConfig({
    base: "/",
    locales: {
        "/": {
            lang: "zh-CN",
            title: "Etheral的博客",
            description: " ",
        },
    },
    plugins: [
    ],
    theme,
    shouldPrefetch: false,
})
