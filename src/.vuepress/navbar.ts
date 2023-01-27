import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  {
    text: "技术文章",
    icon: "article",
    link: "/Home"
  },
  {
    text: "关于",
    children: [
      {
        text: "关于作者",
        link: "/关于/author" },
      {
        text: "关于网站",
        link: "/timeline/",
      },
    ],
  },
]);
