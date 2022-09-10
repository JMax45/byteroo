import pathModule from 'path';
import CacheContainer from './CacheContainer';
import { constants } from './constants';
import Container from './Container';
import { readData } from './utils/readData';
import { readDataSync } from './utils/readDataSync';
import { saveData } from './utils/saveData';

interface ByterooConfig {
  /** Will be used if path is not provided */
  name: string;
  path?: string;
  serialize?: (data: any) => string;
  deserialize?: (data: string) => any;
  autocommit?: boolean;
}

const defaultOpts: ByterooConfig = {
  name: 'byteroo',
  path: pathModule.join(constants.DATA_FOLDER, 'byteroo'),
  serialize: (data: any) => JSON.stringify(data || '{}'),
  deserialize: (data: string) => JSON.parse(data || '{}'),
  autocommit: false,
};

interface ContainerConfig {
  type: 'default';
}
interface CacheContainerConfig {
  type: 'cache';
  ttl: number;
}

class Byteroo {
  path: string;
  config: ByterooConfig;
  constructor(config: ByterooConfig) {
    this.path =
      config.path || pathModule.join(constants.DATA_FOLDER, config.name);
    this.config = { ...defaultOpts, ...config };
  }
  private async saveDataWrapper(path: string, data: string) {
    if (this.path === constants.IN_MEMORY_STORAGE) return;
    await saveData(path, this.config.serialize!(data));
    return;
  }
  async getContainer(
    name: string,
    params?: ContainerConfig | CacheContainerConfig
  ) {
    const data = await readData(pathModule.join(this.path, name));
    if (params && params.type === 'cache') {
      return this._returnCacheContainer(
        name,
        this.config.deserialize!(data),
        params.ttl
      );
    } else {
      return this._returnContainer(name, this.config.deserialize!(data));
    }
  }
  getContainerSync(
    name: string,
    params?: ContainerConfig | CacheContainerConfig
  ) {
    const data = readDataSync(pathModule.join(this.path, name));
    if (params && params.type === 'cache') {
      return this._returnCacheContainer(
        name,
        this.config.deserialize!(data),
        params.ttl
      );
    } else {
      return this._returnContainer(name, this.config.deserialize!(data));
    }
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
  private _returnCacheContainer(name: string, data: string, ttl: number) {
    const containerPath = pathModule.join(this.path, name);
    return new CacheContainer(
      name,
      this.saveDataWrapper.bind(this, containerPath),
      data,
      this.config.autocommit!,
      ttl
    );
  }
}

export default Byteroo;
export { ByterooConfig };
