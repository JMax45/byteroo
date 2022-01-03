import { writeFileSync, unlinkSync } from 'fs';
import { readData } from '../../src/utils/readData';
import makeid from '../../src/utils/makeid';

describe('test readData function', () => {
	const testFilePath = makeid(8);
	const testFileContent = makeid(8);
	it('read test file', async () => {
		writeFileSync(testFilePath, testFileContent);
		expect(await readData(testFilePath)).toBe(testFileContent);
		unlinkSync(testFilePath);
	});
});
