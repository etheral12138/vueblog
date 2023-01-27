import {defineUserConfig} from "vuepress";
import {autoCatalogPlugin} from "vuepress-plugin-auto-catalog";
import { hopeTheme } from "vuepress-theme-hope";
import theme from "./theme";
import {componentsPlugin} from "vuepress-plugin-components";
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
        componentsPlugin({
                components: ["BiliBili","FontIcon"],
                componentOptions:{
                    fontIcon:{
                        assets:"iconfont"
                    }
                },
                rootComponents: {
                    backToTop: true,
                }
            },
        ),
    ],
    theme,
    shouldPrefetch: false,
})
