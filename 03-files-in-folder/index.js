const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, '/secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    return console.error(err);
  }

  files.forEach((file) => {
    if (file.isFile()) {
      const fileName = file.name.split('.').slice(0, -1).join('.');
      const filePath = path.join(__dirname, '/secret-folder', file.name);
      const fileExtension = path.extname(filePath).slice(1);

      fs.stat(filePath, (err, file) => {
        if (err) {
          return console.error(err);
        }

        const fileSize = file.size / 1024;

        console.log(
          fileName + ' - ' + fileExtension + ' - ' + fileSize + ' kb',
        );
      });
    }
  });
});
