import { writeFileSync, unlinkSync } from 'fs';
import makeid from '../../src/utils/makeid';
import { readDataSync } from '../../src/utils/readDataSync';

describe('test readDataSync function', () => {
	const testFilePath = makeid(8);
	const testFileContent = makeid(8);
	it('read test file', async () => {
		writeFileSync(testFilePath, testFileContent);
		expect(readDataSync(testFilePath)).toBe(testFileContent);
		unlinkSync(testFilePath);
	});
});
