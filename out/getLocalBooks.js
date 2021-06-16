"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalBooks = void 0;
const fs = require('fs');
const Path = require('path');
const LocalNovelsPath = '/Users/zhangxing/Desktop/zhufeng_vscode2011/novel';
function getLocalBooks() {
    // const files = fs.readdirSync(LocalNovelsPath);
    const files = [];
    const localNovelList = [];
    // console.log(files);
    files.forEach((file) => {
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
exports.getLocalBooks = getLocalBooks;
//# sourceMappingURL=getLocalBooks.js.map