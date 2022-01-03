import { readFile } from 'fs';

export const readData = (path: string): Promise<string> => {
	return new Promise((resolve, _reject) => {
		readFile(path, 'utf-8', (err, res) => {
			if (err) return resolve('');
			resolve(res);
		});
	});
};
