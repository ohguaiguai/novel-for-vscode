import {
  ExtensionContext,
  commands,
  window,
  workspace,
  Uri,
  ViewColumn,
  Memento,
  ConfigurationTarget,
} from 'vscode';
import Provider from './Provider';
import FavoriteProvider from './FavoriteProvider';
import * as Fs from 'fs';
import { getContent, openLocalDir, searchOnline } from './utils';
import * as Path from 'path';

// 激活插件
export function activate(context: ExtensionContext) {
  // 数据类
  const provider = new Provider();
  const favoriteProvider = new FavoriteProvider();

  // 数据注册
  window.registerTreeDataProvider('novel-list', provider);
  window.registerTreeDataProvider('favorite-novel', favoriteProvider);

  // 定时任务
  setInterval(() => {
    provider.refresh(true);
  }, 1 * 1000 * 60 * 60 * 24);

  // menu 事件
  context.subscriptions.push(
    // commands.registerCommand(`novel.add`, () => {
    // 	provider.addFund()
    // }),
    commands.registerCommand('novel.refresh', () => {
      console.log('执行novel.refresh');
      provider.refresh(true);
    }),
    // commands.registerCommand('novel.item.remove', (fund) => {
    // 	const { code } = fund
    // 	fundHandle.removeConfig(code)
    // 	provider.refresh()
    // }),
    commands.registerCommand('addFavorite', function (args) {
      const config = workspace.getConfiguration();
      let favorites: Novel[] = config.get('novel.favorites', []);
      favorites = [...favorites, args];
      // 第三项是true为用户全局设置,反之为当前workspace设置,当前设置会覆盖全局设置,切记!
      config.update('novel.favorites', favorites, true).then(() => {
        favoriteProvider.refresh();
      });
    }),

    commands.registerCommand('searchOnlineNovel', () => searchOnline(provider)),

    commands.registerCommand('openLocalDir', () => openLocalDir()),

    commands.registerCommand('openSelectedNovel', (args) => {
      let result = Fs.readFileSync(args.path, 'utf-8');

      // 创建webview
      const panel = window.createWebviewPanel(
        'novelReadWebview', // 标识该Webview的type
        args.name, // 视图标题
        ViewColumn.One, // 显示在编辑器的哪个部位
        {
          enableScripts: true, // 启用JS，默认禁用
          retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
        }
      );
      // console.log('context.extensionPath', context.extensionPath);
      const jsSrc = panel.webview.asWebviewUri(
        Uri.file(Path.join(context.extensionPath, './static', 'localNovel.js'))
      );
      const cssSrc = panel.webview.asWebviewUri(
        Uri.file(Path.join(context.extensionPath, './static', 'localNovel.css'))
      );
      panel.webview.html = `<!DOCTYPE html>
				<html>
					<head><link rel="stylesheet" href="${cssSrc}"></head>
					<body>
						<div class="content">
							<pre style="flex: 1 1 auto;white-space: pre-wrap;word-wrap: break-word;">
								${result}
							<pre>
						</div>
					</body>
					<script src="${jsSrc}"></script>
				</html>`;

      // 给webview发消息
      // const defaultProgess = {} as any;
      // defaultProgess[args.name] = 0;
      // console.log(
      //   args.name,
      //   workspace.getConfiguration().get('novel.progress', {} as any)[args.name]
      // );

      setTimeout(() => {
        panel.webview.postMessage({
          command: 'goProgress',
          progress: workspace
            .getConfiguration()
            .get('novel.progress', {} as any)[args.name],
        });
      }, 1000);

      // 处理webview中报告的信息
      panel.webview.onDidReceiveMessage(
        (message) => {
          const progressSetting = workspace
            .getConfiguration()
            .get('novel.progress', {} as any);

          progressSetting[args.name] = message.progress;

          switch (message.command) {
            case 'updateProgress':
              return workspace
                .getConfiguration()
                .update('novel.progress', progressSetting, true);
          }
        },
        undefined,
        context.subscriptions
      );
    }),
    commands.registerCommand('openOnlineNovel', async function (args) {
      // 创建webview
      const panel = window.createWebviewPanel(
        'novelReadWebview', // 标识该Webview的type
        args.name, // 视图标题
        ViewColumn.One, // 显示在编辑器的哪个部位
        {
          enableScripts: true, // 启用JS，默认禁用
          retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
        }
      );
      panel.webview.html = await getContent(args.path);
    })
  );
}

export function deactivate() {}
