"use strict";
var _id, _preArr, _workArr, _inProcess, _concurrent;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const utils_1 = require("../utils");
class Queue {
    constructor(concurrent = 5) {
        _id.set(this, 0);
        _preArr.set(this, []);
        _workArr.set(this, []);
        _inProcess.set(this, 0);
        _concurrent.set(this, void 0);
        this._workPush = () => {
            while (tslib_1.__classPrivateFieldGet(this, _preArr).length > 0 && tslib_1.__classPrivateFieldGet(this, _workArr).length < tslib_1.__classPrivateFieldGet(this, _concurrent)) {
                const item = tslib_1.__classPrivateFieldGet(this, _preArr).shift();
                tslib_1.__classPrivateFieldGet(this, _workArr).push(item);
            }
            const totalLen = tslib_1.__classPrivateFieldGet(this, _workArr).length + tslib_1.__classPrivateFieldGet(this, _preArr).length;
            if (totalLen < 1 && tslib_1.__classPrivateFieldGet(this, _inProcess) < 1)
                this.drain();
            else
                this._workRun();
        };
        this._workRun = async () => {
            const workLen = tslib_1.__classPrivateFieldGet(this, _workArr).length;
            for (let i = 0; i < workLen; i++) {
                const current = tslib_1.__classPrivateFieldGet(this, _workArr)[i];
                if (current.isWorking !== 1) {
                    current.isWorking = 1;
                    tslib_1.__classPrivateFieldSet(this, _inProcess, +tslib_1.__classPrivateFieldGet(this, _inProcess) + 1);
                    await this.work(current.content);
                    const pos = tslib_1.__classPrivateFieldGet(this, _workArr).findIndex((val) => current.id === val.id);
                    tslib_1.__classPrivateFieldGet(this, _workArr).splice(pos, 1);
                    tslib_1.__classPrivateFieldSet(this, _inProcess, +tslib_1.__classPrivateFieldGet(this, _inProcess) - 1);
                    this._workPush();
                }
            }
        };
        this.drain = () => {
            console.log('empty...');
        };
        this.push = (item) => {
            var _a;
            tslib_1.__classPrivateFieldGet(this, _preArr).push({
                id: (tslib_1.__classPrivateFieldSet(this, _id, (_a = +tslib_1.__classPrivateFieldGet(this, _id)) + 1), _a),
                content: item,
            });
            tslib_1.__classPrivateFieldGet(this, _workArr).length < tslib_1.__classPrivateFieldGet(this, _concurrent) && this._workPush();
        };
        this.kill = () => {
            tslib_1.__classPrivateFieldSet(this, _workArr, []);
            tslib_1.__classPrivateFieldSet(this, _preArr, []);
        };
        this.work = async (item) => {
            await utils_1.delay(Math.round(Math.random() * 5000));
            console.log('default work, plz overload it', item);
        };
        tslib_1.__classPrivateFieldSet(this, _concurrent, concurrent);
    }
}
_id = new WeakMap(), _preArr = new WeakMap(), _workArr = new WeakMap(), _inProcess = new WeakMap(), _concurrent = new WeakMap();
exports.default = Queue;
//# sourceMappingURL=index.js.map