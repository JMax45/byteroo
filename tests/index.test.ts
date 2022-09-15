import Byteroo, { Container } from '../src';
import { constants } from '../src/constants';
import makeid from '../src/utils/makeid';
import { rm, existsSync, writeFile, mkdir } from 'fs';
import path from 'path';
import { promisify } from 'util';

const wait = (n: number) => new Promise((resolve) => setTimeout(resolve, n));
const writeFileAsync = promisify(writeFile);
const mkdirAsync = promisify(mkdir);

describe('test Byteroo', () => {
  it('write string value', async () => {
    const storage = new Byteroo({
      name: makeid(8),
      path: constants.IN_MEMORY_STORAGE,
    });
    const container = await storage.getContainer(makeid(8));
    const testvalues = { key: makeid(8), value: makeid(8) };
    container.set(testvalues.key, testvalues.value);
    await container.commit();
    expect(container.get(testvalues.key)).toBe(testvalues.value);
  });
  it('test commit function', async () => {
    const storage = new Byteroo({
      name: makeid(8),
      path: makeid(8),
    });
    const containerName = makeid(8);
    const container = await storage.getContainer(containerName);
    container.set(makeid(8), makeid(8));
    await container.commit();
    expect(existsSync(path.join(storage.path, containerName))).toBe(true);
    rm(storage.path, { recursive: true, force: true }, () => {});
  });
  it('test getContainerSync', () => {
    const storage = new Byteroo({
      name: makeid(8),
      path: makeid(8),
    });
    const containerName = makeid(8);
    const container = storage.getContainerSync(containerName);
    expect(container).toBeInstanceOf(Container);
  });
  it('test automatic storage path detection', async () => {
    const storage = new Byteroo({
      name: makeid(8),
    });
    const containerName = makeid(8);
    const container = await storage.getContainer(containerName);
    container.set(makeid(8), makeid(8));
    await container.commit();
    expect(existsSync(storage.path)).toBe(true);
    rm(storage.path, { recursive: true, force: true }, () => {});
  });
  it('test remove method of container', async () => {
    const storage = new Byteroo({
      name: makeid(8),
      path: constants.IN_MEMORY_STORAGE,
    });
    const container = await storage.getContainer(makeid(8));
    const testvalues = { key: makeid(8), value: makeid(8) };
    container.set(testvalues.key, testvalues.value);
    container.remove(testvalues.key);
    expect(container.get(testvalues.key)).toBeUndefined();
  });
  it('test has method of container', async () => {
    const storage = new Byteroo({
      name: makeid(8),
      path: constants.IN_MEMORY_STORAGE,
    });
    const container = await storage.getContainer(makeid(8));
    const randomProperty = makeid(8);
    expect(container.has(randomProperty)).toBe(false);
    container.set(randomProperty, makeid(8));
    expect(container.has(randomProperty)).toBe(true);
  });
  it('test clear method of container', async () => {
    const storage = new Byteroo({
      name: makeid(8),
      path: constants.IN_MEMORY_STORAGE,
    });
    const container = await storage.getContainer(makeid(8));
    container.set('property1', 'value1');
    container.set('property2', 'value2');
    container.clear();

    expect(container.get('property1')).toBeUndefined();
    expect(container.get('property2')).toBeUndefined();
  });
  it('test size method of container', async () => {
    const storage = new Byteroo({
      name: makeid(8),
      path: constants.IN_MEMORY_STORAGE,
    });
    const container = await storage.getContainer(makeid(8));
    container.set('property1', 'value1');
    container.set('property2', 'value2');
    expect(container.size()).toBe(2);
  });
  it('test list method of container', async () => {
    const storage = new Byteroo({
      name: makeid(8),
      path: constants.IN_MEMORY_STORAGE,
    });
    const container = await storage.getContainer(makeid(8));
    container.set('property1', 'value1');
    container.set('property2', 'value2');
    expect(container.list()[0]).toBe('property1');
    expect(container.list()[1]).toBe('property2');
  });
  it('test rest parameters in remove method', async () => {
    const storage = new Byteroo({
      name: makeid(8),
      path: constants.IN_MEMORY_STORAGE,
    });
    const container = await storage.getContainer(makeid(8));
    container.set('property1', 'value1');
    container.set('property2', 'value2');
    container.remove('property1', 'property2');
    expect(container.list().length).toBe(0);
  });
  it('test autocommit one-item queue', async () => {
    const storageName = makeid(8);
    const containerName = makeid(8);
    const storage = new Byteroo({
      name: storageName,
      autocommit: true,
    });
    const container = await storage.getContainer(containerName);
    container.set('test1', 'test1');
    container.set('test2', 'test2');
    container.remove('test1');
    container.set('test3', 'test3');

    // Delays the following tests for a maximum amount of times,
    // necessary since the file saving doesn't complete immediately.
    // This is not a very good solution but should work for now
    for (let i = 0; i < 5; i++) {
      if ((container as any).saveFlagRequest) {
        await wait(500);
      } else if (!(container as any).saveFlagRequest) break;
    }

    // Load the saved file in another container and check if properties
    // got saved correctly
    const storage2 = new Byteroo({
      name: storageName,
      autocommit: true,
    });
    const container2 = await storage2.getContainer(containerName);

    expect(container2.has('test1')).toBe(false);
    expect(container2.has('test2')).toBe(true);
    expect(container2.has('test3')).toBe(true);

    expect(existsSync(storage.path)).toBe(true);
    rm(storage.path, { recursive: true, force: true }, () => {});
  });
  it('test invalid data object', async () => {
    const storage = new Byteroo({
      name: makeid(8),
      autocommit: true,
    });
    const containerName = makeid(8);
    await mkdirAsync(storage.path);
    await writeFileAsync(
      path.join(storage.path, containerName),
      'INVALID JSON DATA'
    );
    const container = await storage.getContainer(containerName);
    expect(container).not.toBeUndefined();
    rm(storage.path, { recursive: true, force: true }, () => {});
  });
});
