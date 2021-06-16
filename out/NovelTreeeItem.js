"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
;
class NovelTreeItem extends vscode_1.TreeItem {
    constructor(info) {
        super(`${info.name}`);
        const tips = [
            `名称:　${info.name}`,
        ];
        // tooltip是悬浮的条提示
        this.tooltip = tips.join('\r\n');
        // 我们设置一下点击该行的命令，并且传参进去
        this.command = {
            command: "openSelectedNovel",
            title: "打开该小说",
            arguments: [{ name: info.name, path: info.path }]
        };
    }
}
exports.default = NovelTreeItem;
//# sourceMappingURL=NovelTreeeItem.js.map