import Container, { saveDataFunc } from './Container';

class CacheContainer<T> extends Container<T> {
  ttl: number;
  constructor(
    name: string,
    saveData: saveDataFunc,
    data: any,
    autocommit: boolean,
    ttl: number
  ) {
    super(name, saveData, data, autocommit);
    this.ttl = ttl;
  }

  /**
   *
   * @param key key name
   * @param value can be a string or object (will be stringified)
   * @param ttl time to live, can be omitted and will fallback to TTL set during container creation
   */
  set<K extends keyof T>(key: K, value: T[K], ttl?: number) {
    this.data[key] = {
      value: value,
      exp: Math.round(Date.now() / 1000 + (ttl || this.ttl)),
    };
    if (this.autocommit) this.commit();
  }
  get<K extends keyof T>(key: K): T[K] | undefined {
    if (this.data[key] && this.data[key].exp >= Date.now() / 1000)
      return this.data[key].value;
    else this.remove(key);
  }
  list() {
    for (const item of Object.keys(this.data)) this.get(item as keyof T);
    return Object.keys(this.data);
  }
}

export default CacheContainer;
