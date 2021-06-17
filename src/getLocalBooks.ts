const fs = require('fs');
const Path = require('path');

import { Novel } from './NovelTreeItem';
const LocalNovelsPath = '/Users/zhangxing/desktop';

export function getLocalBooks(): Promise<Novel[]> {
  const files = fs.readdirSync(LocalNovelsPath);
  // const files = [] as any;
  // console.log('111', files);
  const localNovelList = [] as Novel[];
  files.forEach((file: string) => {
    const extname = Path.extname(file).substr(1);
    if (extname === 'txt') {
      const name = Path.basename(file, '.txt');
      const path = Path.join(LocalNovelsPath, file);
      localNovelList.push({
        path,
        name,
      });
    }
  });
  return Promise.resolve(localNovelList);
}
