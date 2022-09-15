type saveDataFunc = (data: string, containerName: string) => Promise<void>;

class Container {
  name: string;
  private saveData: saveDataFunc;
  protected data: any;
  protected autocommit: boolean;
  protected saveFlag: boolean;
  protected saveFlagRequest: boolean;
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
    this.saveFlag = false;
    this.saveFlagRequest = false;
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
  async commit() {
    if (this.saveFlag) {
      this.saveFlagRequest = true;
      return;
    }
    this.saveFlag = true;
    await this.saveData(this.data, this.name);
    this.saveFlag = false;
    if (this.saveFlagRequest) {
      this.commit();
    }
    this.saveFlagRequest = false;
  }
}

export default Container;
export { saveDataFunc };
