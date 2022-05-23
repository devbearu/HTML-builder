const fs = require('fs');
const path = require('path');

const assetsPath = path.join(__dirname, '/assets');
const assetsCopyPath = path.join(__dirname, '/project-dist/assets');
const stylesPath = path.join(__dirname, '/styles');
const templatePath = path.join(__dirname, 'template.html');
const indexPath = path.join(__dirname, 'project-dist', 'index.html');

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }
});

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

copyDir(assetsPath, assetsCopyPath);

const style = fs.createWriteStream(
  path.join(__dirname, '/project-dist', 'style.css'),
  (err) => {
    if (err) {
      return console.error(err);
    }
  },
);

fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    return console.error(err);
  }

  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(stylesPath, file.name);
      const fileExtension = path.extname(filePath).slice(1);

      if (fileExtension === 'css') {
        const readStream = fs.createReadStream(filePath, 'utf-8');
        let data = '';

        readStream.on('data', (chunk) => (data += chunk));
        readStream.on('end', () => {
          style.write(data.trim());
          style.write('\n\n');
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

fs.copyFile(templatePath, indexPath, (err) => {
  if (err) {
    return console.error(err);
  }
});

fs.readFile(templatePath, 'utf-8', (err, data) => {
  if (err) console.log(err);

  let templateData = data;
  const templateTags = data.match(/{{\w+}}/gm);

  for (let tag of templateTags) {
    const tagPath = path.join(
      __dirname,
      '/components',
      `${tag.slice(2, -2)}.html`,
    );

    fs.readFile(tagPath, 'utf-8', (err, dataTag) => {
      if (err) console.log(err);

      templateData = templateData.replace(tag, dataTag);

      fs.rm(indexPath, { recursive: true, force: true }, (err) => {
        if (err) {
          return console.error(err);
        }
        const index = fs.createWriteStream(indexPath);
        index.write(templateData);
      });
    });
  }
});
