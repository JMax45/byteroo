import { writeFile } from 'fs';
import { checkPath } from './checkPath';

export const saveData = (path: string, data: string): Promise<void> => {
	return new Promise(async (resolve, reject) => {
		const pathWithoutName = path.substring(0, path.lastIndexOf('/'));
		const exists = await checkPath(pathWithoutName);
		if (!exists) {
			return reject();
		}
		writeFile(path, data, (err) => {
			if (err) return reject(err);
			resolve();
		});
	});
};
