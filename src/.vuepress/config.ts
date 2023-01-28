import {defineUserConfig} from "vuepress";
import {autoCatalogPlugin} from "vuepress-plugin-auto-catalog";
import { hopeTheme } from "vuepress-theme-hope";
import theme from "./theme";
import {componentsPlugin} from "vuepress-plugin-components";
import {searchProPlugin} from "vuepress-plugin-search-pro";
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
        searchProPlugin({
            // 索引全部内容
            indexContent: true,
            // 为分类和标签添加索引
            // customFields: [
            //     {
            //         name: "标签",
            //         getter: (page) => page.frontmatter.tag,
            //         formatter: "标签：$content",
            //     },
            // ],
        }),
    ],
    theme,
    shouldPrefetch: false,
})
