import { checkPath } from '../../src/utils/checkPath';
import { rm } from 'fs';
import makeid from '../../src/utils/makeid';

describe('test checkPath function', () => {
	it('create folder', async () => {
		const testPath = makeid(32);
		const res = await checkPath(testPath);
		expect(res).toBe(true);
		rm(testPath, { recursive: true, force: true }, () => {});
	});
});
