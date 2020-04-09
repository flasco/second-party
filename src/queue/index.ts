import { delay } from '../utils';

interface IPayload<T> {
  id: number;
  content: T;
  isWorking?: number;
}

class Queue<T = any> {
  _id = 0;
  _preArr: IPayload<T>[] = [];
  _workArr: IPayload<T>[] = [];
  _inProcess = 0;
  _concurrent: number;

  constructor(concurrent = 5) {
    this._concurrent = concurrent;
  }

  _workPush() {
    while (this._preArr.length > 0 && this._workArr.length < this._concurrent) {
      const item = this._preArr.shift() as IPayload<T>;
      this._workArr.push(item);
    }

    const totalLen = this._workArr.length + this._preArr.length;

    if (totalLen < 1 && this._inProcess < 1) this.drain();
    else this._workRun();
  }

  async _workRun() {
    const workLen = this._workArr.length;

    for (let i = 0; i < workLen; i++) {
      const current = this._workArr[i];
      if (current && current.isWorking !== 1) {
        current.isWorking = 1;
        this._inProcess++;
        await this.work(current.content);
        this._inProcess--;
        const pos = this._workArr.findIndex((val) => current.id === val.id);
        this._workArr.splice(pos, 1);

        this._workPush();
      }
    }
  }

  drain() {
    console.log('empty...');
  }

  push(item) {
    this._preArr.push({
      id: this._id++,
      content: item,
    });
    this._workArr.length < this._concurrent && this._workPush();
  }

  kill() {
    this._workArr = [];
    this._preArr = [];
  }

  async work(item) {
    await delay(Math.round(Math.random() * 5000));
    console.log('default work, plz overload it', item);
  }
}

export default Queue;
