const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname), (err, data) => {
  if (err) throw err;
  const pathOrigDir = path.join(__dirname, 'files');
  const pathTargetDir = path.join(__dirname, 'files-copy');

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
