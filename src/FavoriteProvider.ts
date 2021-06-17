import {
  window,
  Event,
  EventEmitter,
  TreeDataProvider,
  workspace,
} from 'vscode';
import { getChapter, getLocalBooks } from './utils';
import NovelTreeItem from './NovelTreeItem';
import OnlineTreeItem from './OnlineTreeItem';
export default class FavoriteProvider implements TreeDataProvider<Novel> {
  public refreshEvent: EventEmitter<Novel | null> =
    new EventEmitter<Novel | null>();

  readonly onDidChangeTreeData: Event<Novel | null> = this.refreshEvent.event;

  refresh() {
    this.refreshEvent.fire(null);
  }

  getTreeItem(info: Novel): NovelTreeItem {
    return new OnlineTreeItem(info);
  }

  async getChildren(element?: Novel | undefined): Promise<Novel[]> {
    console.log('FavoriteProvider element', element);
    if (element) {
      return await getChapter(element.path);
    }
    return workspace.getConfiguration().get('novel.favorites', []);
  }

  contextValue = 'favorite';
}
