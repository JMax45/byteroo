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
  serialize?: (data: any) => string;
  deserialize?: (data: string) => any;
  autocommit?: boolean;
}

const defaultOpts: SimpleStorageConfig = {
  name: 'byteroo',
  path: pathModule.join(constants.DATA_FOLDER, 'byteroo'),
  serialize: (data: any) => JSON.stringify(data || '{}'),
  deserialize: (data: string) => JSON.parse(data || '{}'),
  autocommit: false,
};

class SimpleStorage {
  path: string;
  config: SimpleStorageConfig;
  constructor(config: SimpleStorageConfig) {
    this.path =
      config.path || pathModule.join(constants.DATA_FOLDER, config.name);
    this.config = { ...defaultOpts, ...config };
  }
  private async saveDataWrapper(path: string, data: string) {
    if (this.path === constants.IN_MEMORY_STORAGE) return;
    await saveData(path, this.config.serialize!(data));
    return;
  }
  async getContainer(name: string) {
    const data = await readData(pathModule.join(this.path, name));
    return this._returnContainer(name, this.config.deserialize!(data));
  }
  getContainerSync(name: string) {
    const data = readDataSync(pathModule.join(this.path, name));
    return this._returnContainer(name, this.config.deserialize!(data));
  }
  private _returnContainer(name: string, data: string) {
    const containerPath = pathModule.join(this.path, name);
    return new Container(
      name,
      this.saveDataWrapper.bind(this, containerPath),
      data,
      this.config.autocommit!
    );
  }
}

export default SimpleStorage;
export { SimpleStorageConfig };
