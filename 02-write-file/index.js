const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'), (err) => {
  if (err) {
    return console.error(err);
  }
});

stdout.write('Hello! Write something! (Type "exit" or press Ctrl+C to quit)\n');

stdin.on('data', (data) => {
  const dataString = data.toString();

  if (dataString.trim() === 'exit') {
    stdout.write('The process is completed. Thank you!');
    process.exit();
  }

  output.write(dataString);
});

process.on('SIGINT', () => {
  stdout.write('The process is completed. Thank you!\n');
  process.exit();
});
