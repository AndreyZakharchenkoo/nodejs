type TypeListener = Record<string, {
  event: Function,
  once?: Boolean
}[]>;

class EventEmitter {
  protected listeners: TypeListener = {}

  addListener(eventName: string, fn: Function, once?: boolean) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }

    this.listeners[eventName].push({
      event: fn,
      once
    });
  }

  on(eventName: string, fn: Function) {
    this.addListener(eventName, fn);
  }

  emit(eventName: string, ...args: any[]) {
    if (this.listeners.hasOwnProperty(eventName)) {
      let updatedListeners = [];

      for (const listener of this.listeners[eventName]) {
        listener.event.call(this.listeners[eventName], args);

        if (!listener.once) {
          updatedListeners.push(listener);
        }
      }

      this.listeners[eventName] = updatedListeners;
    } else {
      console.error(`Event ${eventName} was not found`);
    }
  }

  removeListener(eventName: string, fn: Function) {
    if (this.listeners.hasOwnProperty(eventName)) {
      delete this.listeners[eventName];
    }

    console.error(`Event ${eventName} was not found`);
  }

  off(eventName: string, fn: Function) {
    this.removeListener(eventName, fn);
  }

  once(eventName: string, fn: Function) {
    this.addListener(eventName, fn, true);
  }

  listenerCount(eventName: string) {
    if (this.listeners.hasOwnProperty(eventName)) {
      return Object.keys(this.listeners[eventName]).length;
    } else {
      return 0;
    }
  }

  rawListeners(eventName: string) {
    if (this.listeners.hasOwnProperty(eventName)) {
      return this.listeners[eventName].map((listener) => listener.event);
    } else {
      return [];
    }
  }
}

// const emitter = new EventEmitter();
//
// // Test addListener and emit
// emitter.addListener('testEvent', (data: any) => console.log(data));
// emitter.emit('testEvent', 'Hello, World!'); // Should log 'Hello, World!'
//
// // Test listenerCount
// console.log(emitter.listenerCount('testEvent')); // Should log 1
//
// // Test rawListeners
// console.log(emitter.rawListeners('testEvent')); // Should log [ [Function] ]
//
// // Test removeListener
// emitter.removeListener('testEvent', console.log);
// console.log(emitter.listenerCount('testEvent'));

// Метод executeповинен видавати такі події:
//
//   beginподія на початку виконання.
//   dataподія, якщо асинхронна функція надає дані, передаючи дані як аргумент будь-яким dataслухачам подій.
//   endподія в кінці виконання.
//   errorподія, якщо під час виконання асинхронної функції виникає помилка, передаючи об’єкт Error як аргумент будь-яким errorслухачам подій.

// class withTime extends EventEmitter {
//   execute(eventName: string, fn: Function) {
//     console.time()
//     this.addListener(eventName, fn);
//   }
// //   dataподія, якщо асинхронна функція надає дані, передаючи дані як аргумент будь-яким dataслухачам подій.
// //   endподія в кінці виконання.
// //   errorподія, якщо під час виконання асинхронної функції виникає помилка, передаючи об’єкт Error як аргумент будь-яким errorслухачам подій.
//
// }

const csv = require('csvtojson');
import fs from 'fs';

// function exportCsvToTxt(csvFilePath: string) {
//   return csv().fromFile(csvFilePath)
//     .then(async (json: any) => {
//       const txtFilePath = csvFilePath.replace('csv', 'txt');
//
//       fs.writeFile(txtFilePath, JSON.stringify(json), (error: any) => {
//         if (error) throw error;
//
//         console.log(`${txtFilePath} was created successfully.`);
//       });
//     })
//     .catch((error: any) => {
//       console.error(error);
//     });
// }


function exportCsvToTxt(csvFilePath: string): Promise<void> {
  const txtFilePath = csvFilePath.replace('.csv', '.txt');
  const readableStream = fs.createReadStream(csvFilePath);
  const writableStream = fs.createWriteStream(txtFilePath);

  return new Promise((resolve, reject) => {
    readableStream
      .pipe(csv({
        delimiter: ';'
      }))
      .on('data', (chunk: Buffer) => {
        writableStream.write(chunk.toString('utf-8'));
      })
      .on('end', () => {
        console.log('Operation csv to txt successfully finished!');
        resolve();
      })
      .on('error', (error: any) => {
        console.log('Operation csv to txt failed!', error);
        reject(error);
      });
  })
}

exportCsvToTxt('src/assets/books.csv')
  .then(() => {});
