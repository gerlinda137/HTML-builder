const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname), (err, data) => {
  if (err) throw err;
  let hasDir = false;
  for (const iterator of data) {
    if (iterator == 'files-copy') {
      hasDir = true;
    }
  }
  if (!hasDir) {
    fs.mkdir(path.join(__dirname, 'files-copy'), (err) => {
      if (err) throw err;
    });
  }
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
});
