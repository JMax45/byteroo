import { readFileSync, unlinkSync } from 'fs';
import { saveData } from '../../src/utils/saveData';

describe('test saveData function', () => {
	const testFilePath = './test';
	const testFileContent = 'test';
	it('read test file', async () => {
		await saveData(testFilePath, testFileContent);
		expect(await readFileSync(testFilePath, 'utf-8')).toBe(testFileContent);
		unlinkSync(testFilePath);
	});
});
