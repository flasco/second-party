import queue from '../src/queue';
import { delay } from '../src/utils';

test('test kill', (done) => {
  const x = new queue(5);
  x.work = async (i) => {
    await delay(Math.round(Math.random() * 3000));
    console.log('action!2', i);
  };

  for (let i = 0; i < 50; i++) {
    x.push(i);
  }

  x.drain = () => {
    console.log('done');
    done();
  };

  setTimeout(() => {
    console.log('kill');
    x.kill();
  }, 5000);
}, 9999999);
