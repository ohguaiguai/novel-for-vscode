"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NovelTreeeItem_1 = require("./NovelTreeeItem");
const getLocalBooks_1 = require("./getLocalBooks");
class DataProvider {
    // 提供单行的UI展示
    getTreeItem(info) {
        return new NovelTreeeItem_1.default(info);
    }
    // 提供每一行的数据
    getChildren() {
        return getLocalBooks_1.getLocalBooks();
    }
}
exports.default = DataProvider;
//# sourceMappingURL=Provider.js.map