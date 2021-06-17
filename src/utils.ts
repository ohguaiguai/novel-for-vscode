import * as https from 'https';
import * as Fs from 'fs';
import * as Path from 'path';
import * as Open from 'open';
import { ProgressLocation, ProgressOptions, window, workspace } from 'vscode';
import * as cheerio from 'cheerio';
import DataProvider from './Provider';
import { clear } from 'console';

const DOMAIN = 'https://www.biquge.com.cn';
// 这是mac下路径,windows要去win的路径, mac下xxx要替换自己主机名字
const LocalNovelsPath = '/Users/zhangxing/desktop';
// 请求
const request = async (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let chunks = '';
      if (!res || res.statusCode !== 200) {
        reject(new Error('网络请求错误!'));
        return;
      }
      res.on('data', (chunk) => {
        chunks += chunk.toString('utf8');
      });
      res.on('end', () => {
        resolve(chunks);
      });
    });
  });
};

// 一个全局系统提示
export class Notification {
  private isStop = false;
  private options: ProgressOptions = {
    location: ProgressLocation.Notification,
    title: 'loading...',
  };

  constructor(title?: string) {
    if (title) {
      this.options.title = title;
    }
    this.start();
  }

  async start() {
    this.isStop = false;
    window.withProgress(this.options, async () => {
      await new Promise((resolve) => {
        const timer = setInterval(() => {
          if (this.isStop) {
            clearInterval(timer);
            resolve(undefined);
          }
        }, 500);
      });
    });
  }

  stop() {
    this.isStop = true;
  }
}

export function openLocalDir() {
  const fileDir = workspace.getConfiguration().get('novel.fileDir', '');
  Open(fileDir || LocalNovelsPath);
}

export function getLocalBooks(): Promise<Novel[]> {
  const files = Fs.readdirSync(LocalNovelsPath);
  const localNovelList = [] as any;
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

export const searchOnline = async function (provider: DataProvider) {
  const msg = await window.showInputBox({
    password: false,
    ignoreFocusOut: false,
    placeHolder: '请输入小说的名字',
    prompt: '',
  });

  const notification = new Notification(`搜索: ${msg}`);

  if (msg) {
    provider.treeNode = await search(msg);
    provider.refresh(true);
  }

  notification.stop();
};

export const search = async (keyword: string) => {
  const result = [] as any;
  try {
    const res = await request(DOMAIN + '/search.php?q=' + encodeURI(keyword));
    // console.log(res);

    const $ = cheerio.load(res);
    $('.result-list .result-item.result-game-item').each(function (
      i: number,
      elem: any
    ) {
      const title = $(elem).find('a.result-game-item-title-link span').text();
      const author = $(elem)
        .find(
          '.result-game-item-info .result-game-item-info-tag:nth-child(1) span:nth-child(2)'
        )
        .text();
      const path = $(elem).find('a.result-game-item-pic-link').attr().href;
      console.log(title, author, path);

      result.push({
        name: `${title} - ${author}`,
        isDirectory: true,
        path,
      });
    });
  } catch (error) {
    console.warn(error);
  }
  return result;
};

export const getChapter = async (pathStr: string) => {
  const result = [] as any;
  try {
    const res = await request(DOMAIN + pathStr);
    const $ = cheerio.load(res);
    $('#list dd').each(function (i: number, elem: any) {
      const name = $(elem).find('a').text();
      const path = $(elem).find('a').attr().href;
      result.push({
        name,
        isDirectory: false,
        path,
      });
    });
  } catch (error) {
    console.warn(error);
  }
  return result;
};

export const getContent = async (pathStr: string) => {
  let result = '';
  try {
    const res = await request(DOMAIN + pathStr);
    const $ = cheerio.load(res);
    const html = $('#content').html();
    result = html ? html : '';
  } catch (error) {
    console.warn(error);
  }
  return result;
};
