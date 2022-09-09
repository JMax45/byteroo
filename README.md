# Byteroo

[![codecov](https://codecov.io/gh/JMax45/byteroo/branch/master/graph/badge.svg?token=ISW3Z8TOSJ)](https://codecov.io/gh/JMax45/byteroo)

Byteroo is a key-value storage for your Node.js applications.

**This library is heavily inspired by sindresorhus' [conf](https://github.com/sindresorhus/conf), you might want to use their library instead of this one since it's more feature rich.**

# Usage:

```js
const Byteroo = require('byteroo');
const storage = new Byteroo({
  name: 'mystorage',
  path: '/path/to/storage',
});
const container = storage.getContainerSync('users');
/* or
const container = await storage.getContainer('sync');
*/
```

| Property    | Description                                                                                     |
| ----------- | ----------------------------------------------------------------------------------------------- |
| name        | Name of your storage, used to automatically find a path in case it's not provided               |
| path        | [optional] Path where all the containers will be stored, created automatically if doesn't exist |
| serialize   | [optional] Custom function to serialize the data object to a string                             |
| deserialize | [optional] Custom function to deserialize string to data object                                 |
| autocommit  | [optional] Automatically save data to disk on each change. Default: false                       |

```js
// adding new value
container.set('johh@doe.com', 'value');

// retrieving a value
container.get('john@doe.com'); // -> 'value'

// removing a value
container.remove('john@doe.com');

// you can remove multiple values at once
container.remove('key1', 'key2', 'key3');

// saving data to disk
container.commit();

// checking if a property exists
container.has('john@doe.com');

// deleting all items
container.clear();

// get amount of items
container.size();

// get list of items
container.list();
```

#### Storing data in memory

You can store your data in memory by using the IN_MEMORY_STORAGE constant exported by the module.

```js
const constants = require('byteroo/constants');
{
  path: constants.IN_MEMORY_STORAGE;
}
```

This will disable the commit() function (you can still call it without any error) and the data won't be stored to disk.

#### Cache Container

Byteroo includes a container that can be used for caching purposes, you can retrieve it like this:

```js
const container = storage.getContainerSync('users', { type: 'cache', ttl: 30 });
/* or
const container = await storage.getContainer('sync', { type: 'cache', ttl: 30 });
*/
```

| Property | Description                                                                                   |
| -------- | --------------------------------------------------------------------------------------------- |
| type     | Type of the container ('default'/'cache'), in this case we use cache                          |
| ttl      | Timeout after which the entries are considered expired (not available in 'default' container) |

CacheContainer can be interacted with in the same way that the normal Container does, in fact it's an extended class of the Container itself. This means that any method that's available in the normal container is also available in CacheContainer, the difference is that CacheContainer automatically checks if your entries are expired based on the `ttl` property. The expired entries are removed from the memory automatically, which means that you don't have to worry about cleaning up disk space.

**Thanks to [Zeverotti](https://github.com/Zeverotti) for his work on this component.**
