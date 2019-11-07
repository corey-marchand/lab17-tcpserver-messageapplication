'use strict';

const fs = require('fs');
const util = require('util');
const net = require('net');
// const eventEmitter = require('./eventEmitter');
// require('./file-event');

const client = new net.Socket();

client.connect(3001, 'localhost', () => {});


const readFile = async file => {
  const fsRead = util.promisify(fs.readFile);
  try{
    const data = await fsRead(file);
    eventEmitter.emit('file-read');
    return data;
  } catch (error) {
    eventEmitter.emit('file-readError', error);
  }
};

const upperCase = data => {
  console.log(data);
  let text = data.toString().toUpperCase();
  eventEmitter.emit('file-uppercased', text);
  return text;
};

const saveFile = async (file, text) => {
  const fsWrite = util.promisify(fs.writeFile);
  await fsWrite(file, Buffer.from(text));
  eventEmitter.emit('file-saved');
};

const alterFile = async file => {
  // read the file
  const data = await readFile(file);

  // convert data to upper case

  const text = upperCase(data);

  // write it back to the file system

  saveFile(file, text);
};


let file = process.argv.slice(2).shift();
alterFile(file);
