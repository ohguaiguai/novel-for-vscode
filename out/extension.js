"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const Provider_1 = require("./Provider");
const fs = require('fs');
// 激活插件
function activate(context) {
    // 提供数据的类
    const provider = new Provider_1.default();
    // 数据注册
    vscode.window.registerTreeDataProvider('novel-list', provider);
    const openSelectedNovel = vscode.commands.registerCommand('openSelectedNovel', (args) => {
        // commands.executeCommand('vscode.open', Uri.parse(args.path)); // 使用自带的解析txt功能
        // 创建webview
        // const panel = vscode.window.createWebviewPanel(
        //   'testWebview', // viewType
        //   "WebView演示", // 视图标题
        //   vscode.ViewColumn.One, // 显示在编辑器的哪个部位
        //   {
        //     enableScripts: true, // 启用JS，默认禁用
        //     retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
        //   }
        // );
        // panel.webview.html = `<html><body>你好，我是Webview</body></html>`;
        // 利用node api拿到文件
        let result = fs.readFileSync(args.path, 'utf-8');
        const panel = vscode.window.createWebviewPanel('novelReadWebview', args.name, vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true,
        });
        // 用pre标签外加部分css使保持原有样式
        panel.webview.html = `<html>
      <body>
        <pre style="flex: 1 1 auto;white-space: pre-wrap;word-wrap: break-word; color: green;">
          ${result}
        <pre>
      </body>
    </html>`;
    });
    context.subscriptions.push(openSelectedNovel);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
;
//# sourceMappingURL=extension.js.map