import queue from '../src/queue';

test('test1', async () => {
  const x = new queue(5);
  x.work = async (i) => {
    expect(i).toBe('2');
  }
  x.push('1');
})