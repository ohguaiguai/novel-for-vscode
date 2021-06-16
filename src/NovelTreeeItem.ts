import { TreeItem } from 'vscode';

export interface Novel {
  path: string;
  name: string;
};

export default class NovelTreeItem extends TreeItem {

  constructor(info: Novel) {
    super(`${info.name}`)

    const tips = [
      `名称:　${info.name}`,
    ]

    // tooltip是悬浮的条提示
    this.tooltip = tips.join('\r\n');
    // 我们设置一下点击该行的命令，并且传参进去
    this.command = {
      command: "openSelectedNovel",
      title: "打开该小说",
      arguments: [{ name: info.name, path: info.path }]
    }
  }
}