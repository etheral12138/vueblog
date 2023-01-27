import {sidebar} from "vuepress-theme-hope";
import {about} from "./sidebar/about";
export const zhSidebar = sidebar({
    // 应该把更精确的路径放置在前边
    "/关于/": about,
    "/": [
        {
            text: "前端技术",
            icon: "note",
            prefix: "前端技术/",
            collapsible: true,
            children: [
                "JavaScript",
                "TypeScript",
                "Vue",
            ]
        },
        {
            text: "数据结构与算法",
            icon: "note",
            prefix: "数据结构与算法/",
            collapsible: true,
            children: [
                "二叉树",
                "回溯算法（DFS）",
                "动态规划",
            ]
        },
        {
            text: "数学",
            icon: "note",
            prefix: "数学/",
            children: [
                "线性代数"
            ]
        }
    ],
});
