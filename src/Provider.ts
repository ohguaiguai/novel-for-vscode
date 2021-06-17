import { window, Event, EventEmitter, TreeDataProvider } from 'vscode';
import { getChapter, getLocalBooks } from './utils';
import NovelTreeItem from './NovelTreeItem';
import OnlineTreeItem from './OnlineTreeItem';
export default class DataProvider implements TreeDataProvider<Novel> {
  public refreshEvent: EventEmitter<Novel | null> =
    new EventEmitter<Novel | null>();

  //TreeDataProvider 需要提供一个 onDidChangeTreeData 属性，该属性是 EventEmitter 的一个实例，然后通过触发 EventEmitter 实例进行数据的更新，每次调用 refresh 方法相当于重新调用了 getChildren 方法。
  readonly onDidChangeTreeData: Event<Novel | null> = this.refreshEvent.event;

  // 判断列表是本地还是在线
  public isOnline = false;

  public treeNode: Novel[] = [];

  constructor() {
    getLocalBooks().then((res) => {
      this.treeNode = res;
    });
  }

  refresh(isOnline: boolean) {
    this.isOnline = isOnline;
    this.refreshEvent.fire(null);
  }

  public fire(): void {
    this.refreshEvent.fire(null);
  }

  // 提供单行的UI展示
  getTreeItem(info: Novel): NovelTreeItem {
    if (this.isOnline) return new OnlineTreeItem(info);

    return new NovelTreeItem(info);
  }
  // 提供每一行的数据 展开之后
  async getChildren(element?: Novel | undefined): Promise<Novel[]> {
    console.log('Provider element', element);
    if (element) {
      return await getChapter(element.path);
    }
    return this.treeNode;
  }
}
