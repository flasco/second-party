class Queue {
  _id = 0;
  _preArr = [] as any[];
  _workArr = [] as any[];
  _inProcess = 0;
  _concurrent: number;

  constructor(concurrent = 5) {
    this._concurrent = concurrent;
  }

  _workPush = () => {
    while (this._preArr.length > 0 && this._workArr.length < this._concurrent) {
      const item = this._preArr.shift();
      this._workArr.push(item);
    }

    const totalLen = this._workArr.length + this._preArr.length;

    if (totalLen < 1 && this._inProcess < 1) this.drain();
    else this._workRun();
  };

  _workRun = async () => {
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
  };

  drain = () => {
    console.log('empty...');
  };

  push = (item) => {
    this._preArr.push({
      id: this._id++,
      content: item,
    });
    this._workArr.length < this._concurrent && this._workPush();
  };

  kill = () => {
    this._workArr = [];
    this._preArr = [];
  };

  work = async (item) => {
    return new Promise((resolve) => {
      console.log('default work, plz overload it', item);
      setTimeout(resolve, Math.round(Math.random() * 5000));
    });
  };
}

export = Queue;
