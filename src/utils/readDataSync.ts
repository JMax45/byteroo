import { readFileSync } from 'fs';

export const readDataSync = (path: string) => {
	try {
		const data = readFileSync(path, 'utf-8');
		return data;
	} catch (err) {
		return '';
	}
};
