import { constants } from '../src/constants';
import makeid from '../src/utils/makeid';
import Byteroo from '../src';

const wait = (n: number) => new Promise((resolve) => setTimeout(resolve, n));

describe('test CacheContainer', () => {
  it('test set and get method', async () => {
    const storage = new Byteroo({
      name: makeid(8),
      path: constants.IN_MEMORY_STORAGE,
    });
    const container = await storage.getContainer(makeid(8), {
      type: 'cache',
      ttl: 1,
    });
    container.set('testval', 'testval');
    expect(container.get('testval')).not.toBeUndefined();
    await wait(2000);
    expect(container.get('testval')).toBeUndefined();
  });
  it('test list method', async () => {
    const storage = new Byteroo({
      name: makeid(8),
      path: constants.IN_MEMORY_STORAGE,
    });
    const container = await storage.getContainer(makeid(8), {
      type: 'cache',
      ttl: 1,
    });
    container.set('testval', 'testval');
    expect(container.list()[0]).toBe('testval');
  });
  it('test TTL parameter in set method', async () => {
    const storage = new Byteroo({
      name: makeid(8),
      path: constants.IN_MEMORY_STORAGE,
    });
    const container = await storage.getContainer(makeid(8), {
      type: 'cache',
      ttl: 1,
    });
    container.set('testval', 'testval', 3);
    expect(container.get('testval')).not.toBeUndefined();
    await wait(2000);
    expect(container.get('testval')).not.toBeUndefined();
    await wait(1500);
    expect(container.get('testval')).toBeUndefined();
  });
});
