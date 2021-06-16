# webview

web view 生命周期 生命周期包括三部分：

- 创建：panel = vscode.window.createWebviewPanel()
- 显示：panel.webview.html = htmlString
- 关闭：panel.dispose() 主动关闭，panel.onDidDispose 设置关闭时清理的内容。

出于安全考虑，WebView 默认无法直接访问本地资源，它在一个孤立的上下文中运行，想要加载本地图片、js、css 等必须通过特殊的 vscode-resource:协议，网页里面所有的静态资源都要转换成这种格式，否则无法被正常加载。
