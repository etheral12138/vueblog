set ff=unix
set -e
npm run docs:build
cd docs/.vuepress/dist
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:etheral12138/vueblog.git master:gh-pages
cd -