import {defineUserConfig} from "vuepress";
import {autoCatalogPlugin} from "vuepress-plugin-auto-catalog";
import { hopeTheme } from "vuepress-theme-hope";
// @ts-ignore
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
        autoCatalogPlugin(),
    ],
    theme,
    shouldPrefetch: false,
})
