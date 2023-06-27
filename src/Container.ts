type saveDataFunc = (data: string, containerName: string) => Promise<void>;
type commitResolve = (value: void | PromiseLike<void>) => void;

class Container {
  name: string;
  private saveData: saveDataFunc;
  protected data: any;
  protected autocommit: boolean;
  protected saveFlag: boolean;
  protected saveFlagRequest: boolean;
  private commitQueue: commitResolve[];
  constructor(
    name: string,
    saveData: saveDataFunc,
    data: any,
    autocommit: boolean
  ) {
    this.name = name;
    this.saveData = saveData;
    this.data = data;
    this.autocommit = autocommit;
    this.saveFlag = false;
    this.saveFlagRequest = false;
    this.commitQueue = [];
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
  commit(): Promise<void> {
    return new Promise(async (resolve) => {
      if (this.saveFlag) {
        this.saveFlagRequest = true;
        this.commitQueue.push(resolve);
        return;
      }
      this.saveFlag = true;
      await this.saveData(this.data, this.name);
      resolve();
      this.saveFlag = false;
      if (this.saveFlagRequest) {
        await this.commit();
        this.commitQueue.forEach((e) => e());
        this.commitQueue.length = 0;
      }
      this.saveFlagRequest = false;
    });
  }
}

export default Container;
export { saveDataFunc };
