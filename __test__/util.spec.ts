import { delay } from '../src/utils';

test('test delay', async () => {
  const st = Date.now();
  await delay(3000);
  const stamp = Date.now() - st;
  expect(stamp).toBeGreaterThanOrEqual(3000);
});
