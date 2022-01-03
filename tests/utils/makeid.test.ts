import makeid from '../../src/utils/makeid';

describe('test makeid function', () => {
	const length = 32;
	it('generate test string and check length', async () => {
		const string = makeid(length);
		expect(string.length).toBe(length);
	});
});
