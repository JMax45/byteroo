import pathModule from 'path';
import { constants } from './constants';
import Container from './Container';
import { readData } from './utils/readData';
import { readDataSync } from './utils/readDataSync';
import { saveData } from './utils/saveData';

interface SimpleStorageConfig {
	/** Will be used if path is not provided */
	name: string;
	path?: string;
}

class SimpleStorage {
	path: string;
	config: SimpleStorageConfig;
	constructor(config: SimpleStorageConfig) {
		this.path =
			config.path || pathModule.join(constants.DATA_FOLDER, config.name);
		this.config = config;
	}
	private async saveDataWrapper(path: string, data: string) {
		if (this.path === constants.IN_MEMORY_STORAGE) return;
		await saveData(path, data);
		return;
	}
	async getContainer(name: string) {
		const data = await readData(pathModule.join(this.path, name));
		return this._returnContainer(name, data);
	}
	getContainerSync(name: string) {
		const data = readDataSync(pathModule.join(this.path, name));
		return this._returnContainer(name, data);
	}
	private _returnContainer(name: string, data: string) {
		const containerPath = pathModule.join(this.path, name);
		return new Container(
			name,
			this.saveDataWrapper.bind(this, containerPath),
			data
		);
	}
}

export default SimpleStorage;
export { SimpleStorageConfig };
