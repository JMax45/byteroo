import { writeFile } from 'fs';
import { checkPath } from './checkPath';
import pathModule from 'path';

export const saveData = (
  containerName: string,
  storagePath: string,
  data: string
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const exists = await checkPath(storagePath);
    if (!exists) {
      return reject();
    }
    writeFile(pathModule.join(storagePath, containerName), data, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};
