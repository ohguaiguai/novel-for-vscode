import { TreeDataProvider } from 'vscode';
import NovelTreeItem, { Novel } from './NovelTreeeItem';
import { getLocalBooks } from './getLocalBooks';

export default class DataProvider implements TreeDataProvider<any> {
  // 提供单行的UI展示
  getTreeItem(info: Novel): NovelTreeItem {
    return new NovelTreeItem(info);
  }
  // 提供每一行的数据
  getChildren(): Promise<Novel[]> {
    return getLocalBooks();
  }
}