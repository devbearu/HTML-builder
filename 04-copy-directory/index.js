const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, '/files');
const folderCopyPath = path.join(__dirname, '/files-copy');

const copyDir = (folderPath, folderCopyPath) => {
  fs.rm(folderCopyPath, { recursive: true, force: true }, (err) => {
    if (err) {
      return console.error(err);
    }

    fs.mkdir(folderCopyPath, { recursive: true }, (err) => {
      if (err) {
        return console.error(err);
      }
    });

    fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
      if (err) {
        return console.error(err);
      }

      files.forEach((file) => {
        const filePath = path.join(folderPath, file.name);
        const fileCopyPath = path.join(folderCopyPath, file.name);

        if (file.isFile()) {
          fs.copyFile(filePath, fileCopyPath, (err) => {
            if (err) {
              return console.error(err);
            }
          });
        }

        if (file.isDirectory()) {
          copyDir(filePath, fileCopyPath);
        }
      });
    });
  });
};

copyDir(folderPath, folderCopyPath);
