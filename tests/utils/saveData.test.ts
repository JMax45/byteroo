import { readFileSync, rmSync } from 'fs';
import { saveData } from '../../src/utils/saveData';
import path from 'path';

describe('test saveData function', () => {
  const testFileContent = 'test';
  it('read test file', async () => {
    await saveData('testcontainer', 'teststorage', testFileContent);
    expect(
      await readFileSync(path.join('teststorage', 'testcontainer'), 'utf-8')
    ).toBe(testFileContent);
    rmSync('teststorage', { recursive: true });
  });
});
