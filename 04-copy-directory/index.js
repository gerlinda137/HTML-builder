const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname), (err, data) => {
  if (err) throw err;
  for (const iterator of data) {
    if (iterator == 'files-copy') {
      hasDir = true;
    }
  }
  fs.rm(
    path.join(__dirname, 'files-copy'),
    { recursive: true, force: true },
    () => {
      fs.mkdir(path.join(__dirname, 'files-copy'), (err) => {
        if (err) throw err;
      });
      fs.readdir(path.join(__dirname, 'files'), (err, data) => {
        if (err) throw err;
        for (const iterator of data) {
          const origPath = path.join(__dirname, 'files', iterator);
          const targetPath = path.join(__dirname, 'files-copy', iterator);
          fs.copyFile(origPath, targetPath, (err) => {
            if (err) throw err;
          });
        }
      });
    },
  );
});
