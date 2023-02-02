import {defineUserConfig} from "vuepress";
import theme from "./theme";
import {componentsPlugin} from "vuepress-plugin-components";
import {docsearchPlugin} from "@vuepress/plugin-docsearch";
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
                components: ["BiliBili", "FontIcon"],
                componentOptions: {
                    fontIcon: {
                        assets: "iconfont"
                    }
                },
                rootComponents: {
                    backToTop: true,
                }
            },
        ),
        docsearchPlugin({
            apiKey: "d9bd0d6112b4d1f34d32bc7f58fb9c3b",
            appId: "4HTLIER5EQ",
            indexName: "etheral",
            // disableUserPersonalization: true,
            placeholder: "搜索文章",
        }),
    ],
    head: [
        ["link", {rel: "preconnect", href: "https://fonts.googleapis.com"}],
        [
            "link",
            {rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: ""},
        ],
        [
            "link",
            {
                href: "https://fonts.googleapis.com/css2?family=Noto+Serif+SC&display=swap",
                rel: "stylesheet",
            },
        ],

        // <link rel="preconnect" href="https://fonts.googleapis.com">
        // <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        // <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC&display=swap" rel="stylesheet">
    ],
    theme,
    shouldPrefetch: false,
})
