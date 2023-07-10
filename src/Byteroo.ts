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
  deserialize: (data: string) => {
    try {
      return JSON.parse(data);
    } catch (err) {
      return {};
    }
  },
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
  private async saveDataWrapper(containerName: string, data: string) {
    if (this.path === constants.IN_MEMORY_STORAGE) return;
    await saveData(containerName, this.path, this.config.serialize!(data));
    return;
  }
  async getContainer<T = any>(
    name: string,
    params?: ContainerConfig | CacheContainerConfig
  ) {
    const data = await readData(pathModule.join(this.path, name));
    if (params && params.type === 'cache') {
      return this._returnCacheContainer<T>(
        name,
        this.config.deserialize!(data),
        params.ttl
      );
    } else {
      return this._returnContainer<T>(name, this.config.deserialize!(data));
    }
  }
  getContainerSync<T = any>(
    name: string,
    params?: ContainerConfig | CacheContainerConfig
  ) {
    const data = readDataSync(pathModule.join(this.path, name));
    if (params && params.type === 'cache') {
      return this._returnCacheContainer<T>(
        name,
        this.config.deserialize!(data),
        params.ttl
      );
    } else {
      return this._returnContainer<T>(name, this.config.deserialize!(data));
    }
  }
  private _returnContainer<T>(name: string, data: string) {
    return new Container<T>(
      name,
      this.saveDataWrapper.bind(this, name),
      data,
      this.config.autocommit!
    );
  }
  private _returnCacheContainer<T>(name: string, data: string, ttl: number) {
    return new CacheContainer<T>(
      name,
      this.saveDataWrapper.bind(this, name),
      data,
      this.config.autocommit!,
      ttl
    );
  }
}

export default Byteroo;
export { ByterooConfig };
