import { TreeItem, TreeItemCollapsibleState } from 'vscode';

export default class OnlineTreeItem extends TreeItem {
  constructor(info: Novel) {
    super(`${info.name}`);

    const tips = [`名称:　${info.name}`];
    this.tooltip = tips.join('\r\n');

    // 根据isDirectory属性判断是不是可折叠的组
    this.collapsibleState = info.isDirectory
      ? TreeItemCollapsibleState.Collapsed
      : TreeItemCollapsibleState.None;

    // 这里命令也换了一个，换成openOnlineNovel（注意注册一下）
    this.command = info.isDirectory
      ? undefined
      : {
          command: 'openOnlineNovel',
          title: '打开该网络小说',
          arguments: [{ name: info.name, path: info.path }],
        };
    this.contextValue = info.isDirectory ? 'online' : 'onlineChapter';
  }

  contextValue = 'online';
}
