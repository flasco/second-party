import { delay } from '../utils';

interface IPayload<T> {
  id: number;
  content: T;
  isWorking?: number;
}

class Queue<T = any> {
  #id = 0;
  #preArr: IPayload<T>[] = [];
  #workArr: IPayload<T>[] = [];
  #inProcess = 0;
  #concurrent: number;

  constructor(concurrent = 5) {
    this.#concurrent = concurrent;
  }

  _workPush() {
    while (this.#preArr.length > 0 && this.#workArr.length < this.#concurrent) {
      const item = this.#preArr.shift() as IPayload<T>;
      this.#workArr.push(item);
    }

    const totalLen = this.#workArr.length + this.#preArr.length;

    if (totalLen < 1 && this.#inProcess < 1) this.drain();
    else this._workRun();
  }

  async _workRun() {
    const workLen = this.#workArr.length;

    for (let i = 0; i < workLen; i++) {
      const current = this.#workArr[i];
      if (current.isWorking !== 1) {
        current.isWorking = 1;
        this.#inProcess++;
        await this.work(current.content);
        const pos = this.#workArr.findIndex((val) => current.id === val.id);
        this.#workArr.splice(pos, 1);
        this.#inProcess--;

        this._workPush();
      }
    }
  }

  drain() {
    console.log('empty...');
  }

  push(item) {
    this.#preArr.push({
      id: this.#id++,
      content: item,
    });
    this.#workArr.length < this.#concurrent && this._workPush();
  }

  kill() {
    this.#workArr = [];
    this.#preArr = [];
  }

  async work(item) {
    await delay(Math.round(Math.random() * 5000));
    console.log('default work, plz overload it', item);
  }
}

export default Queue;
