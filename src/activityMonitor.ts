import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';

interface ILogProcesses {
  (processInfo: string, fileName: string): void;
}

const logProcesses: ILogProcesses = async (processInfo, fileName) => {
  const unixTime = Date.now();
  const logItem = `${unixTime}\t${processInfo}`;
  const directoryPath = path.join(__dirname, 'logs');

  try {
    if (!fs.existsSync(directoryPath)) {
      await fsPromises.mkdir(directoryPath);
      console.log(`Directory 'logs' created`);
    }

    await fsPromises.appendFile(path.join(directoryPath, fileName), logItem);
  } catch (error) {
    console.error(error);
  }
};

export default logProcesses;
