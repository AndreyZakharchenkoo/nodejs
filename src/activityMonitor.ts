import fs from 'fs';
import path from 'path';

interface ILogProcesses {
  (processInfo: string, fileName: string): void;
}

const logProcesses: ILogProcesses = (processInfo, fileName) => {
  const unixTime = Date.now();
  const logItem = `${unixTime}\t${processInfo}`;
  const directoryPath = path.join(__dirname, 'logs');

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  fs.appendFile(path.join(directoryPath, fileName), logItem, (error) => {
    if (error) throw error;
    console.log('Saved!');
  });
};

export default logProcesses;
