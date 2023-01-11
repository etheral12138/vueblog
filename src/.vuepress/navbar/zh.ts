import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  "/",
  {
    text: "博文",
    icon: "edit",
    prefix: "/posts/",
    children: [
      {
        text: "前端技术",
        icon: "edit",
        prefix: "front-end/",
        children: [
          { text: "JavaScript", icon: "edit", link: "JavaScript" },
          { text: "TypeScript", icon: "edit", link: "TypeScript" },
        ],
      },
      {
        text: "数据结构与算法",
        icon: "edit",
        prefix: "algorithm/",
        children: [
          {
            text: "二叉树",
            icon: "edit",
            link: "二叉树",
          },
          {
            text: "回溯算法（DFS）",
            icon: "edit",
            link: "回溯算法（DFS）",
          },
        ],
      },
    ],
  },
]);
