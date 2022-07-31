type saveDataFunc = (data: string, containerName: string) => Promise<void>;

class Container {
  name: string;
  private saveData: saveDataFunc;
  private data: any;
  constructor(name: string, saveData: saveDataFunc, data: any) {
    this.name = name;
    this.saveData = saveData;
    try {
      this.data = data;
    } catch (error) {
      this.data = {};
    }
  }

  /**
   *
   * @param key key name
   * @param value can be a string or object (will be stringified)
   */
  set(key: string, value: any) {
    this.data[key] = value;
  }
  get(key: string) {
    return this.data[key];
  }
  remove(key: string) {
    delete this.data[key];
  }

  /**
   * save changes on disk
   */
  commit() {
    return this.saveData(this.data, this.name);
  }
}

export default Container;
