# 說明

凌誠 gulp 重構版本
2019.7

## 專案建置並運行

npm install
yarn install // 暫不用
npm cache clean 清除 npm
gulp 執行

## 應用第三方

jquery @3.3.1
bootstrap @4.1.3
font-awesome @5.5.0

## gulp 4 安裝

1. 檢查版本
   gulp -v

2. 移除舊版 gulp
   npm rm --global gulp

3. 安裝 gulp-cli
   npm install --global gulp-cli

## 第一次自己安裝的步驟

1. 初始化
   npm init --yes

2. 安裝 gulp
   npm install --save-dev gulp@next

3. 建立 gulpfile.js
   npm -init -y

Q. 如何更新 npm?
npm install -g npm

## 檔名功能對應

[Node.JS] 在 Windows 下使用 nvm 切換 Node 版本

常用指令
nvm install <版本號>
安裝某版本之 Node

nvm list
列出已安裝清單

nvm use <版本號>
切換使用的 Node 版本

pug 語法
https://pugjs.org/zh-cn/api/getting-started.html

==== 未改善功能 ====
autoprefixer 版本前綴值設定
路徑別變數 funtion
