const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, '/styles');
const output = fs.createWriteStream(
  path.join(__dirname, '/project-dist', 'bundle.css'),
  (err) => {
    if (err) {
      return console.error(err);
    }
  },
);

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    return console.error(err);
  }

  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(folderPath, file.name);
      const fileExtension = path.extname(filePath).slice(1);

      if (fileExtension === 'css') {
        const readStream = fs.createReadStream(filePath, 'utf-8');
        let data = '';

        readStream.on('data', (chunk) => (data += chunk));
        readStream.on('end', () => {
          output.write(data.trim());
          output.write('\n\n');
        });
        readStream.on('error', (err) => {
          if (err) {
            return console.error(err);
          }
        });
      }
    }
  });
});
