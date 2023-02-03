import {defineUserConfig} from "vuepress";
import theme from "./theme";
import {componentsPlugin} from "vuepress-plugin-components";
import {docsearchPlugin} from "@vuepress/plugin-docsearch";
// import {docsearchPlugin} from "@vuepress/plugin-docsearch";
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
                    // addThis:"ra-63dc12199f1d32ff"
                }
            },
        ),
        docsearchPlugin({
            apiKey: "17a7f3d58e4252f9f9bce1fc64d70a08",
            appId: "S39EFURQDU",
            indexName: "etheralcc",
            disableUserPersonalization: true,
            locales: {
                "/": {
                    placeholder: "搜索文档",
                    translations: {
                        button: {
                            buttonText: "搜索文档",
                            buttonAriaLabel: "搜索文档",
                        },
                        modal: {
                            searchBox: {
                                resetButtonTitle: "清除查询条件",
                                resetButtonAriaLabel: "清除查询条件",
                                cancelButtonText: "取消",
                                cancelButtonAriaLabel: "取消",
                            },
                            startScreen: {
                                recentSearchesTitle: "搜索历史",
                                noRecentSearchesText: "没有搜索历史",
                                saveRecentSearchButtonTitle: "保存至搜索历史",
                                removeRecentSearchButtonTitle: "从搜索历史中移除",
                                favoriteSearchesTitle: "收藏",
                                removeFavoriteSearchButtonTitle: "从收藏中移除",
                            },
                            errorScreen: {
                                titleText: "无法获取结果",
                                helpText: "你可能需要检查你的网络连接",
                            },
                            footer: {
                                selectText: "选择",
                                navigateText: "切换",
                                closeText: "关闭",
                                searchByText: "搜索提供者",
                            },
                            noResultsScreen: {
                                noResultsText: "无法找到相关结果",
                                suggestedQueryText: "你可以尝试查询",
                                openIssueText: "你认为该查询应该有结果？",
                                openIssueLinkText: "点击反馈",
                            },
                        },
                    },
                },
            },
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
