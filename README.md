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

// saving data to disk
container.commit();

// checking if a property exists
container.has('john@doe.com');

// deleting all items
container.clear();
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
