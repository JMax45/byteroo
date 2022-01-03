import { access, mkdir } from 'fs';
import util from 'util';

const accessAsync = util.promisify(access);
const mkdirAsync = util.promisify(mkdir);

export const checkPath = async (path: string) => {
	let res = false;
	try {
		await accessAsync(path);
		res = true;
	} catch (err) {
		await mkdirAsync(path, { recursive: true });
		res = true;
	}
	return res;
};
