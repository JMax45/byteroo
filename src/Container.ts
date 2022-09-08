type saveDataFunc = (data: string, containerName: string) => Promise<void>;

class Container {
  name: string;
  private saveData: saveDataFunc;
  private data: any;
  private autocommit: boolean;
  constructor(
    name: string,
    saveData: saveDataFunc,
    data: any,
    autocommit: boolean
  ) {
    this.name = name;
    this.saveData = saveData;
    try {
      this.data = data;
    } catch (error) {
      this.data = {};
    }
    this.autocommit = autocommit;
  }

  /**
   *
   * @param key key name
   * @param value can be a string or object (will be stringified)
   */
  set(key: string, value: any) {
    this.data[key] = value;
    if (this.autocommit) this.commit();
  }
  get(key: string) {
    return this.data[key];
  }
  remove(...keys: string[]) {
    for (const key of keys) delete this.data[key];
    if (this.autocommit) this.commit();
  }
  has(key: string) {
    return this.data.hasOwnProperty(key);
  }
  clear() {
    this.data = {};
    if (this.autocommit) this.commit();
  }
  size() {
    return Object.keys(this.data).length;
  }
  list() {
    return Object.keys(this.data);
  }

  /**
   * save changes on disk
   */
  commit() {
    return this.saveData(this.data, this.name);
  }
}

export default Container;
