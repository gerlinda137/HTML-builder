const fs = require('fs');
const path = require('path');

//create folder

fs.readdir(path.join(__dirname), (err, data) => {
  if (err) throw err;
  let hasDir = false;
  for (const iterator of data) {
    if (iterator == 'project-dist') {
      hasDir = true;
    }
  }
  if (!hasDir) {
    fs.mkdir(path.join(__dirname, 'project-dist'), (err) => {
      if (err) throw err;
      console.log('Folder was created');
    });
  }

  // read template.html
  const templateStream = fs.createReadStream(
    path.join(__dirname, 'template.html'),
    'utf-8',
  );
  templateStream.on('data', (chunk) => {
    console.log(chunk);
  });

  // fs.readdir(path.join(__dirname, 'files'), (err, data) => {
  //   if (err) throw err;
  //   for (const iterator of data) {
  //     const origPath = path.join(__dirname, 'files', iterator);
  //     const targetPath = path.join(__dirname, 'files-copy', iterator);
  //     fs.copyFile(origPath, targetPath, (err) => {
  //       if (err) throw err;
  //     });
  //   }
  // });
});

// styles
fs.readdir(
  path.join(__dirname, 'styles'),
  { withFileTypes: true },
  (err, data) => {
    if (err) throw err;
    const bundle = fs.createWriteStream(
      path.join(__dirname, 'project-dist', 'bundle.css'),
    );

    for (const iterator of data) {
      if (iterator.isFile()) {
        const fileName = iterator.name;
        let extName = path.extname(fileName);
        extName = extName.substring(1);
        if (extName == 'css') {
          const input = fs.createReadStream(
            path.join(__dirname, 'styles', fileName),
            'utf-8',
          );
          input.on('data', (chunk) => bundle.write(chunk));
        }
      }
    }
  },
);

// assets
fs.readdir(path.join(__dirname), (err, data) => {
  if (err) throw err;
  const pathOrigDir = path.join(__dirname, 'assets');
  const pathTargetDir = path.join(__dirname, 'project-dist', 'assets');

  fs.rm(pathTargetDir, { recursive: true, force: true }, () => {
    copyDir(pathOrigDir, pathTargetDir);
  });
});
function copyDir(dirPath, targetDirPath) {
  fs.mkdir(targetDirPath, (err) => {
    if (err) throw err;

    fs.readdir(dirPath, (err, data) => {
      if (err) throw err;

      for (const iterator of data) {
        fs.stat(path.join(dirPath, iterator), (err, stats) => {
          if (err) {
            console.error(err);
            return;
          }
          const origPath = path.join(dirPath, iterator);
          const targetPath = path.join(targetDirPath, iterator);
          if (stats.isFile()) {
            fs.copyFile(origPath, targetPath, (err) => {
              if (err) throw err;
            });
          } else if (stats.isDirectory()) {
            copyDir(origPath, targetPath);
          }
        });
      }
    });
  });
}
